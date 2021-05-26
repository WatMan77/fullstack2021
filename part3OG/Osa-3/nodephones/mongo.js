const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.z4eqs.mongodb.net/persons?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

//Gues no ID's?
const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if(process.argv.length === 3){
    console.log("phonebook:")
    console.log("What is perosn in mongo.js", Person)
    Person.find({}).then(result => {
        result.forEach(human => {
            console.log(human)
        })
    mongoose.connection.close()
    })
}

if(process.argv.length === 5){
    const human = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })
    human.save().then(response => {
        console.log(`adde ${human.name} ${human.number} to phonebook`)
        mongoose.connection.close()
    })
}
