const express = require("express");
const app = express();
const morgan = require("morgan");
const Person = require("./models/person");



app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static("dist"));

let data = [
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

// routes
app.get("/api/persons", (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons);
    });
});

app.post("/api/persons", (request, response) => {
    const { name, number } = request.body;

    if(!name || !number) {
        return response.status(400).json({error: "name and number can not be empty"})
    }

    const addedPerson = new Person({
        name,
        number
    })

    addedPerson.save().then(savedPerson => {
        response.status(201).json(savedPerson);
    })
})

app.get("/info", (request, response) => {
    const infoLength = data.length;
    const time = new Date().toString();

    response.send(`
        <p>Phonebook has info for ${infoLength} people</p>
        <p>${time}</p>
        `);
});

app.get("/api/persons/:id", (request, response) => {
    const id = request.params.id;
    const person = data.find(p => p.id === id);

    if(!person) {
        return response.status(404).json({error: "not found"});
    }

    response.json(person);
})

app.delete("/api/persons/:id", (request, response) => {
    const id = request.params.id;
    const personToDelete = data.find(p => p.id == id);

    if(!personToDelete) {
        return response.status(404).json({error: "not found"});
    }

    data = data.filter(p => p.id !== id);

    response.json(personToDelete);
})


const PORT = process.env.port || 3001;
app.listen(PORT, () => {
    console.log(`server running at port ${PORT}`);
})