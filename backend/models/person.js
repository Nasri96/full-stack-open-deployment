const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);
mongoose.connect(url, { family: 4 })
    .then(result => {
        console.log("connected to mongodb");
    })
    .catch(error => {
        console.log("error connecting to mongodb: ", error.message);
    })


const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        minLength: 8,
        validate: {
            validator: (v) => {
                return /^(\d{2,3})-(\d{6})$/.test(v);
            },
            message: (props) => {
                return `${props.value} is not a valid number. (11/111)-(1234567) is a valid format.`;
            }
        }

    }
})

personSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
})

module.exports = mongoose.model("Person", personSchema);