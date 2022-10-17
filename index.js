const express = require("express")
const neo4j = require("neo4j-driver")

const driver = neo4j.driver(
    "bolt://localhost:7687",
    neo4j.auth.basic("neo4j", "Mindus@123")
)

async function init() {
    const app = express()

    app.get("/get", async (req, res) => {
        const session = driver.session()
        const result = await session.run(
            ` MATCH path = shortestPath(
            (First:PLAYER {name: "Kevin Durant" })-[*]-(Second:TEAM {name: "Brooklyn Nets" })
        )
        UNWIND nodes(path) as node
        RETURN coalesce(node.name, node.title) as text; `,
            {
                PLAYER: req.query.PLAYER,
                TEAM: req.query.TEAM,
            }
        )

        res.json({
            status: "ok",
            path: result.records.map((record) => record.get("text")),
        })

        await session.close()
    })

    app.use(express.static("./static"))

    app.listen(3555)
    console.log("Server Started on Port 3555")
}
init()
