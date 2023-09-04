// This is cool. But you gotta watch https://www.youtube.com/watch?v=mbsmsi7l3r4


require("dotenv").config()
const jwt = require("jsonwebtoken")
const express = require("express");

const server = express()

server.use(express.json())

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}


const posts = [
    {
        username: "Jerry Notinvited",
        title: "Post 1"
    },
    {
        username: "Yubi Gagai",
        title: "Post 2"
    }
]


server.get("/posts", authenticateToken, (req, res) => {
    res.json(posts.filter(post => post.username === req.user.name))
})


server.listen(3000, () => {
    console.log("listening on port 3000")
})