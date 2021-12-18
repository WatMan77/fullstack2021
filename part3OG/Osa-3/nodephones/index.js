// ORIGINAL OSA3!!
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
const Person = require('./models/person')
app.use(express.static('build'))
app.use(express.json())
app.use(cors())
//I wouldn't say it was that hard :-)
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

//Trying stuff

let people = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456'
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523'
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345'
  },
  {
    id: 4,
    name: 'Mary Poppendick',
    number: '39-23-6423122'
  },
  {
    id: 5,
    name: 'Mr. Test',
    number: '42-0420'
  }
]

app.get('/info', (req, res, next) => {
  const now = new Date
  res.send(`<h1>Phone book has info for ${people.length} people</h1><p>${now.toString()}</p>`)
    .catch(e => next(e))
})

app.get('/api/persons', (req, res) => {
//res.json(people)
  console.log('What is person?', Person)
  Person.find({}).then(humans => {
    res.json(humans)
  })
})

app.get('/api/persons/:id', (req, res, next) => {

  Person.findById(req.params.id).then(human => {
    if(!human){
      res.status(404).end()
    } else {
      res.json(human)
    }
  })
    .catch(error => {
      console.log('Error in getting id')
      next(error)
    })

  /* const found = people.find(x => x.id === Number(req.params.id))
    if(found){
  res.json(found)
    } else {
  res.status(404).end()
    } */
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => {
      console.log('Error in deletion')
      next(error)
    })
    /*console.log('DELETING!!')
    const id = Number(req.params.id)
    console.log('What is id?', id)
    people = people.filter(x => x.id !== id)
    res.status(204).end()*/
})

app.post('/api/persons', (request, response, next) => {
  const person = request.body

  //Front end shows an error when they receive status 404
  //Should it though?
  if(!person.name || person.name.length === 0){
    console.log('Name missing!')
    response.status(404).send({ error: 'Name missing' })
    return
  }

  if(!person.number || person.number.length === 0){
    console.log('Number missing')
    response.status(404).send({ error: 'Number missing' })
    return
  }

  const human = new Person({
    name: person.name,
    number: person.number
  })

  human.save().then(savedHuman => {
    response.json(savedHuman)
  })
    .catch(error => next(error))

  /*
    if(people.find(x => x.name === person.name)){
  response.status(404).json({error: 'Name must be unique'})
  return
    }

    person.id = Math.floor(Math.random() * 5000)
    people = people.concat(person)
    response.json(person) */
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const human = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, human, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next ) => {
  console.error(error.message)
  if(error.name === 'CastError'){
    return response.status(400).send({ error: 'malformatted id' })
  } else if(error.name === 'ValidationError'){
    return response.status(400).send({ error: error.message })
  }
  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
app.use(errorHandler)

// eslint-disable-next-line no-undef
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})