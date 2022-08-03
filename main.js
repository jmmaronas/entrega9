const express = require("express")
const {fork}=require('child_process')
const parseArgs = require('minimist')

const MongoStore = require("connect-mongo")
const session = require("express-session")
const passport = require("passport")
const { Strategy: LocalStrategy } = require('passport-local')
const { createHash, isValidPassword } = require('./src/util/util.js')
const flash = require('connect-flash')

const { Server: HttpServer } = require("http")
const { Server: IOServer } = require("socket.io")

const ejs = require("ejs")
const path = require("path")
const cors = require("cors")

const { getAllTest } = require("./src/services/app.facker.js")
const { connectDB } = require('./db.js')
const { getAllChats, addChat } = require('./src/controller/chat.controller.js')
const { MONGODB_URI } = require("./config.js")
const User = require("./src/model/user.js")

const options={
    default:{
        PORT:8080
    }
}
const args_port = parseArgs(process.argv.slice(2), options)
console.log(args_port)
const PORT = args_port.PORT || 8080

const auth = (req, res, next) => {
    if (req.session.name) return next()
    return res.redirect("/login")
}


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

app.use(session({
    store: MongoStore.create({
        mongoUrl: MONGODB_URI,
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }        
    }),
    secret: "qwerty",
    resave: true,
    saveUninitialized: true
}))

app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

passport.use('login', new LocalStrategy((username, password, done) => {
    return User.findOne({ username })
        .then(user => {
            if (!user) {
                return done(null, false, { message: 'Nombre de usario incorrecto' })
            }
            if (!isValidPassword(user.password, password)) {
                return done(null, false, { message: 'Contraseña incorrecta' })
            }
            return done(null, user)
        })
        .catch(err => done(err))
}))

passport.use('signup', new LocalStrategy({ passReqToCallback: true }, (req, username, password, done) => {
    return User.findOne({ username })
        .then(user => {
            if (user) {
                return done(null, false, { message: 'El nombre de usario ya existe' })
            }
            const newUser = new User()
            newUser.username = username
            newUser.password = createHash(password)
            newUser.email = req.body.email
            console.log(newUser)
            return newUser.save()
        })
        .then(user => done(null, user))
        .catch(err => done(err))
}))

passport.serializeUser((user, done) => {
    console.log('serailizeUser')
    done(null, user._id)
})

passport.deserializeUser((id, done) => {
    console.log('DeserealizeUser')
    User.findById(id, (err, user) => {
        done(err, user)
    })
})

app.get('/info', (req,res)=>{
    let argv=process.argv.slice(2)
    let name=process.platform
    let version=process.version
    let rss=JSON.stringify(process.memoryUsage(), null,2)
    let path=process.execPath
    let pid=process.pid
    let folder=process.cwd()
    return res.render('info.ejs', {argv, name, version, rss, path, pid, folder})
})

app.post('/api/randoms', (req,res)=>{    
    const maxi=req.query.cant
    console.log(maxi)
    const calcular=fork('./calcular.js')
    calcular.send(maxi)
    calcular.on('message', result=>{
        return res.end(`randoms ${result}`)
    })
})

app.get("/", (req, res) => {
    res.render("index", { user: req.flash('user'), email: req.flash('email') })
})
app.get("/api/productos-test", (req, res) => {
    const db = getAllTest()
    res.render("tabla.ejs", { db })
})
app.get("/login", (req, res) => {
    res.render("login.ejs", { message: req.flash('error') })
})
app.post("/login", passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))
app.get("/logout", (req, res) => {
    return req.session.destroy(err => {
        if (!err) {
            return res.send({ logout: true })
        }
        return res.send({ err: err })
    })
})
app.get("/signup", (req, res) => {
    return res.render("signUp.ejs", { message: req.flash('error') })
})
app.post("/signup", passport.authenticate('signup', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true
}))

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