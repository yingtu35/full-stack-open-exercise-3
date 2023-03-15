require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")

morgan.token("body", (req) => {
    if (req.method === "POST") {
        return JSON.stringify(req.body)
    }
})

const app = express()
app.use(express.static("build"))
app.use(cors())
app.use(express.json())
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))

const Person = require("./models/person")

app.get("/api/persons", (req, res, next) => {
    Person.find({})
        .then(persons => {
            res.json(persons)
        })
        .catch(error => next(error))
})

app.post("/api/persons", (req, res, next) => {
    const body = req.body
    // if (!body.name) {
    //     return res.status(400).json({"error": "name field missing"})
    // }
    // if (!body.number) {
    //     return res.status(400).json({"error": "number field missing"})
    // }
    Person.exists({ name: body.name })
        .then(result => {
            if (result) {
                return res.status(400).json({ "error": "name must be unique" })
            }
            else {
                const newPerson = new Person({
                    name: body.name,
                    number: body.number
                })
                newPerson.save()
                    .then(savedPerson => {
                        console.log("new person saved")
                        res.status(201).json(savedPerson)
                    })
                    .catch(error => next(error))
            }
        })
        .catch(error => next(error))
})

app.get("/api/persons/:id", (req, res, next) => {
    Person.findById(req.params.id)
        .then(returnedPerson => {
            if (returnedPerson) {
                res.json(returnedPerson)
            }
            else {
                res.status(404).send({ error: "person not found" })
            }
        })
        .catch(error => next(error))
})

app.delete("/api/persons/:id", (req, res, next) => {
    Person.findByIdAndDelete(req.params.id)
        .then(() => {
            console.log("person deleted")
            res.status(204).end()
        })
        .catch(error => next(error))
})

app.put("/api/persons/:id", (req, res, next) => {
    const body = req.body
    // if (!body.name) {
    //     return res.status(400).json({"error": "name field missing"})
    // }
    // if (!body.number) {
    //     return res.status(400).json({"error": "number field missing"})
    // }
    const update = {
        name: body.name,
        number: body.number
    }

    const opts = {
        new: true,
        runValidators: true
    }
    Person.findByIdAndUpdate(req.params.id, update, opts)
        .then(updatedPerson => {
            if (updatedPerson) {
                console.log("person updated")
                res.json(updatedPerson)
            }
            else {
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.get("/info", (req, res, next) => {
    const time = new Date().toString()
    Person.countDocuments({})
        .then(count => {
            res.send(`
            <p>Phonebook has info for ${count} people</p>
            <p>${time}</p>
            `)
        })
        .catch(error => next(error))
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: "unknown endpoint" })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
    console.log(error.message)

    if (error.name === "CastError") {
        res.status(400).send({ error: "malformatted id" })
    }
    else if (error.name === "ValidationError") {
        res.status(400).send({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})