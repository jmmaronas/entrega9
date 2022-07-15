const express = require("express")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const MongoStore = require("connect-mongo")
const { Server: HttpServer } = require("http")
const { Server: IOServer } = require("socket.io")
const ejs = require("ejs")
const path = require("path")
const cors = require("cors")
const { getAllTest } = require("./src/services/app.facker.js")
const { connectDB } = require('./db.js')
const { getAllChats, addChat } = require('./src/controller/chat.controller.js')
const { MONGODB_URI } = require("./config.js")

const PORT = process.env.PORT || 8080

const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

const auth = (req, res, next) => {
    if (req.session.name) return next()
    return res.redirect("/login")
}

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

app.use(cookieParser())
app.use(session({
    store: MongoStore.create({
        mongoUrl: MONGODB_URI,
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        ttl: 600000
    }),
    secret: "qwerty",
    resave: true,
    saveUninitialized: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + "/public"))
app.use(cors())
connectDB()


app.get("/", auth, (req, res) => {
    res.cookie('userName', req.session.name).render("index", { user: req.session.name })
})
app.get("/api/productos-test", (req, res) => {
    const db = getAllTest()
    res.render("tabla.ejs", { db })
})
app.get("/login", (req, res) => {
    console.log(req.session.name)
    res.render("login.ejs")
})
app.post("/login", (req, res) => {
    req.session.name = req.body.name
    res.redirect("/")
})
app.get("/logout", (req, res) => {
    return req.session.destroy(err => {
        if (!err) {
            return res.clearCookie("userName").send({ logout: true })
        }
        return res.send({ err: err })
    })

})
const server = httpServer.listen(PORT, "127.0.0.1", () => {
    console.log(`Server on port: ${server.address().port}`)
})

server.on("error", (err) => {
    console.error(err)
})

io.on("connection", async socket => {
    console.log("NuevoCliente concectado", socket.id)
    socket.emit("bienvenida", await getAllChats())
    socket.emit("bdProductos", await getAllTest())

    socket.on("newProduct", async data => {
        //await add({name:data.name, price:Number(data.price), img:data.img})
        io.sockets.emit("bdProductos", await getAllTest())
    })

    socket.on("mensajeCliente", async data => {
        await addChat(data)
        io.sockets.emit("mensajeProvedor", data)
    })
}) 