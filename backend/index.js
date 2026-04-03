const express = require("express");
const app = express();
const morgan = require("morgan");
const Person = require("./models/person");



app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static("dist"));

// routes
app.get("/api/persons", (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons);
    });
});

app.post("/api/persons", (request, response, next) => {
    const { name, number } = request.body;

    if(!name || !number) {
        return response.status(400).json({error: "name and number can not be empty"})
    }

    const addedPerson = new Person({
        name,
        number
    })

    addedPerson.save()
        .then(savedPerson => {
            response.status(201).json(savedPerson);
        })
        .catch(error => next(error))
})

app.get("/info", (request, response) => {
    const time = new Date().toString();
    Person.find({})
        .then(persons => {
            response.send(`
                <p>Phonebook has info for ${persons.length} people</p>
                <p>${time}</p>
                `)
        })
});

app.get("/api/persons/:id", (request, response, next) => {
    const id = request.params.id;
    
    Person.findById(id)
        .then(person => {
            if(!person) {
                return response.status(404).end();
            }

            response.json(person);
        })
        .catch(error => next(error))
})

app.put("/api/persons/:id", (request, response, next) => {
    const id = request.params.id;
    const { number } = request.body;
    
    Person.findById(id)
        .then(person => {
            if(!person) {
                console.log("not found!");
                return response.status(404).end();
            }

            person.number = number;

            return person.save()
                .then(updatedPerson => {
                    response.json(updatedPerson);
                })

        })
        .catch(error => {
            console.log("catching put error here")
            next(error);
        })
})

app.delete("/api/persons/:id", (request, response, next) => {
    const id = request.params.id;

    Person.findByIdAndDelete(id)
        .then(deleted => {
            if(!deleted) {
                console.log("not found!");
                return response.status(404).end();
            }
            response.json(deleted);
        })
        .catch(error => {
            next(error);
        })
})


function unknownEndpoint(request, response, next) {
    response.json({ error: "unknown endpoint" });
}

function errorHandler(error, request, response, next) {
    console.log("error type: ", error.name);
    console.log("error message: ", error.message);

    if(error.name === "CastError") {
        return response.status(400).send({ error: "invalid id" });
    } else if(error.name === "ValidationError") {
        return response.status(400).send({ error: error.message });
    }

    next(error);
}

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.port || 3001;
app.listen(PORT, () => {
    console.log(`server running at port ${PORT}`);
})