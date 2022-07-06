const express = require("express")
const { Server: HttpServer } = require("http")
const { Server: IOServer } = require("socket.io")
const ejs = require("ejs")
const path = require("path")
//const {add, getAll}=require("./src/services/app.js")
//const { addChat, getAllChats} = require("./src/services/chats.js")
const cors = require("cors")
const { getAllTest } = require("./src/services/app.facker.js")
const { connectDB } = require('./db.js')
const { getAllChats, addChat  } =require('./src/controller/chat.controller.js')

const PORT = process.env.PORT || 8080

const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + "/public"))
app.use(cors())
connectDB()
;(async()=>console.log(await getAllChats()))()

app.get("/", (req, res) => {
    res.render("index")
})
app.get("/api/productos-test", (req, res) => {
    const db = getAllTest()
    res.render("tabla.ejs", { db })
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
        console.log(data)
        await addChat(data)
        io.sockets.emit("mensajeProvedor", data)
    })
}) 