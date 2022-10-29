const express = require("express")
const neo4j = require("neo4j-driver")
var path = require("path")
var logger = require("morgan")
var bodyParser = require("body-parser")
var app = express()

// View Engine
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

app.use(logger("dev"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, "public")))

const driver = neo4j.driver(
    "bolt://localhost:7687",
    neo4j.auth.basic("neo4j", "****")
)
var session = driver.session()

app.get("/", function (req, res) {
    session
        .run("MATCH(n:TEAM) RETURN n")
        .then(function (result) {
            result.records.forEach(function (record) {
                console.log(record)
            })
        })
        .catch(function (err) {
            console.log(err)
        })
    res.send("It Works")
})
app.listen(3000)
console.log("Server Started on Port 3000")
module.exports = app
