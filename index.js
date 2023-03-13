const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

morgan.token('body', (req, res) => {
    if (req.method === 'POST') {
        return JSON.stringify(req.body);
    }
})

app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const generate_person_id = () => {
    // Propability of same if with 10000 people is 95%, 100000 is 67%
    return Math.ceil(Math.random() * 1000000000)
}

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.post('/api/persons', (req, res) => {
    body = req.body;
    if (!body.name) {
        return res.status(400).json({"error": "name field missing"})
    }
    else if (!body.number) {
        return res.status(400).json({"error": "number field missing"})
    }
    const is_duplicate = persons.map(person => person.name).includes(body.name)
    if (is_duplicate) {
        return res.status(400).json({"error": "name must be unique"})
    }
    newPerson = {
        id: generate_person_id(),
        name: body.name,
        number: body.number
    }
    persons = persons.concat(newPerson)
    res.status(201).json(newPerson)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(person => person.id === id);
    if (!person) {
        res.statusMessage = `Could not find person id ${id}`;
        return res.status(404).end()
    }
    res.json(person);
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter(person => person.id !== id);
    res.status(204).end()
})

app.get('/info', (req, res) => {
    const num_persons = persons.length;
    const time = new Date().toString();
    res.send(`
    <p>Phonebook has info for ${num_persons} people</p>
    <p>${time}</p>
    `)
})

PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})