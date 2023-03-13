const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log("Password is required")
    process.exit()
}

const password = process.argv[2]
const url = `mongodb+srv://fullstack:${password}@myfirstcluster.r38o8ej.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url)

const personsSchema = new mongoose.Schema({
    name: String,
    number: String
})
const Persons = mongoose.model('Person', personsSchema)

if (process.argv.length < 5) {
    // display all of the entries in the phonebook
    console.log("phonebook:")
    Persons.find({}).then(result => {
        result.forEach(person => {
            console.log(person.name, person.number);
        });
        mongoose.connection.close()
    })
}
else {
    // add new entry to the phonebook
    const name = process.argv[3];
    const number = process.argv[4];
    const person = new Persons({
        "name": name, 
        "number": number
    })
    
    person.save().then(result => {
        console.log(`added ${person.name} number ${person.number} to phonebook`)
        mongoose.connection.close()
    })
}
