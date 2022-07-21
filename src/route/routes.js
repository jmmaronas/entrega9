const express = require("express")
const { Router } = express

const router = Router()

const auth = (req, res, next) => {
    const { name, password } = req.body
    if (name) return next()
    return res.redirect("/login")
}


router.get("/", auth, (req, res) => {
    res.cookie('userName', req.session.name).render("index", { user: req.session.name, email: req.session.email })
})
router.get("/api/productos-test", (req, res) => {
    const db = getAllTest()
    res.render("tabla.ejs", { db })
})
router.get("/login", (req, res) => {
    console.log(req.session.name)
    res.render("login.ejs")
})
router.post("/login", (req, res) => {
    req.session.name = req.body.name
    res.redirect("/")
})
router.get("/logout", (req, res) => {
    return req.session.destroy(err => {
        if (!err) {
            return res.clearCookie("userName").send({ logout: true })
        }
        return res.send({ err: err })
    })
})
router.get("/singup", (req, res) => {
    return res.render("singUp.ejs")
})
router.post("/singup", (req, res) => {
    const { name, email, password } = req.body
    req.session.name = name
    req.session.email = email
    req.session.password = password
    return res.redirect("/login")
})

module.exports = router
