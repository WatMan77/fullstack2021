import React, { useState, useEffect } from 'react'
import './index.css'
import Numbers from "./Numbers.js"
import Filter from "./Filter.js"
import PersonForm from "./PersonForm.js"
import service from "./services/info.js"
import Notification from "./Notification.js"

const App = () => {
  const [ persons, setPersons] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState("")
  const [ filtering, setFilter ] = useState("")
  const [ errorMessage, setErrorMessage ] = useState("")
 
  useEffect(() => {
    service
      .getAll()
      .then(initialPeople => {
        setPersons(initialPeople)
      })
  }, [])

  const showMessage = message => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage("")
    }, 5000)
  }
  
  const addPerson = (event) => {
    event.preventDefault()
    const person = persons.find(x => x.name === newName)
    const personObject = {
      name: newName,
      number: newNumber
    }
    if(person){
      if(window.confirm(`${person.name} is already in the list. Do you want to change the phone number?`)){
        service.update(person.id, personObject)
        .then(returnedPerson => {
          setPersons(persons.map(x => x.id !== person.id ? x : returnedPerson))
        })
        showMessage(`${newName}'s numbers has been changed to ${newNumber}`)
      }
    } else {
      service.create(personObject).then(response => {
      setPersons(persons.concat(response))
      showMessage(`${personObject.name} has been added`)
    })
  }
  setNewName("")
  setNewNumber("")
}

  const changeFilter = (event) => {
    event.preventDefault()
    setFilter(event.target.value)
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  
  const handelNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  //Chaining needed. Otherwise promise might not fulfill before
  //new people are fetched
  const deletePerson = id => {
    const toDelete = persons.find(x => x.id === id).name
    if(!window.confirm(`Do you want to delete ${toDelete}`)){
      return
    }
    service.deletion(id)
    .then(() => service
    .getAll().then(x => setPersons(x)))
    .catch(e => {
      showMessage("Already deleted") //Not a different colot
    })
    showMessage(`${toDelete} successfully deleted`)
  }


  const peopleToShow = (filtering === "")
  ? persons
  : persons.filter(x => x.name.toLowerCase().includes(filtering.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} />
      <Filter filtering={filtering} changeFilter={changeFilter} />
      <h2>Add a new person</h2>
      <PersonForm addPerson={addPerson}
        newName={newName} handleNameChange={handleNameChange}
        newNumber={newNumber} handleNumberChange={handelNumberChange}
        />
      <h2>Numbers</h2>
      <Numbers people={peopleToShow} deletion={deletePerson} />
    </div>
  )

}

export default App