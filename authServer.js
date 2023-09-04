// This is cool. But you gotta watch https://www.youtube.com/watch?v=mbsmsi7l3r4


require("dotenv").config()
const jwt = require("jsonwebtoken")
const express = require("express");

const server = express()

server.use(express.json())

let refreshTokens = []

const generateAccesToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "10m"})
}

server.delete("/logout", (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    res.sendStatus(204)
})

server.post("/login", (req, res) => {
    //res.json("I am authentikateing U")

    const username = req.body.username
    const user = { name: username}

    const accessToken = generateAccesToken(user)
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
    refreshTokens.push(refreshToken)
    res.json({accessToken, refreshToken})
})

server.post("/token", (req, res) => {
    const refreshToken = req.body.token
    if (refreshToken == null) return res.sendStatus(401)
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        const accessToken = generateAccesToken({ name: user.name})
        res.json({ accessToken })
    })
})

server.listen(4000, () => {
    console.log("listening on port 4000")
})