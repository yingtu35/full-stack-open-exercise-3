const mongoose = require("mongoose")

const url = process.env.MONGODB_URI

console.log("Connecting to", url)
mongoose.set("strictQuery", false)
mongoose.connect(url)
    .then(() => {
        console.log("Connected to MongoDB")
    })
    .catch(error => {
        console.log("Error connecting to MongoDB", error.message)
    })

const personsSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: [3, "Person name must be at least 3 characters, got '{VALUE}'"],
        required: [true, "Person name required"]
    },
    number: {
        type: String,
        minLength: [8, "Person number should has length of 8 or more, got '{VALUE}'"],
        validate: {
            validator: (v) => {
                return /(^\d{2}-\d{6,})|(^\d{3}-\d{5,})|(^\d{8,})/.test(v)
            },
            message: props => `${props.value} is not a valid number. `
        },
        required: [true, "Person number required"]
    }
})

personsSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model("Person", personsSchema)