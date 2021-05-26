import React, { useState, useEffect} from 'react'
import axios from "axios"
import Countries from "./Countries.js"

const Finder = ({name, changeName}) => {
  return (
    <form>
      <div>
        find countries <input value={name} onChange={changeName} />
      </div>
    </form>
  )
}

const App = () => {

  const [ name, setName ] = useState("")
  const [countries, setCountries ] = useState([])
  const handleNameChange = (event) => {
    event.preventDefault() //Needed?
    setName(event.target.value)
  }
  const hook = () => {
    if(name === ""){
      return
    }
    //An error 404 might happen if no country with the name
    //is found. I couldn't find any solution to this
    //Just provide a valid name
    axios
      .get(`https://restcountries.eu/rest/v2/name/${name}`)
      .then(response => {
        setCountries(response.data)
      })
      .catch(error => {
        console.log("No country found")
      })
  }
  useEffect(hook, [name])

  const handleFiller = name => {
    setName(name)
  }

  return ( 
    <div>
      <Finder name={name} changeName={handleNameChange} />
      <Countries countries={countries} filler={handleFiller} />
    </div>
  )
}

export default App;
