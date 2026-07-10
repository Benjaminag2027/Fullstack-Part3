const express = require('express')
const app = express()

app.use(express.json())

let persons = [
    { 
        "id": "1",
        "name": "Arto Hellas", 
        "number": "040-123456"
    },
    { 
        "id": "2",
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
    },
    { 
        "id": "3",
        "name": "Dan Abramov", 
        "number": "12-43-234345"
    },
    { 
        "id": "4",
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<div><a href="/api/persons">/api/persons</a></div><div><a href="/info">/info</a></div>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  person = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => Number(n.id)))
    : 0
  return String(maxId + 1)
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({ 
        error: 'name or number missing' 
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    console.log(person)

    let exists = false;
    persons.map(p => {
        if (p.name === body.name) {
            exists = true;
        }
    })

    if (!exists) {
        persons = persons.concat(person)
    }
    else {
        return response.status(409).json({ 
        error: 'person already exists' 
        })
    }

    response.json(person)

})

app.get('/info', (request, response) => {
    let date = new Date();

    let days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat']
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']

    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${days[date.getDay()]} ${months[date.getMonth()]} ${date.getDate()} ${date.getFullYear()} ${date.toTimeString()}</p>`)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})