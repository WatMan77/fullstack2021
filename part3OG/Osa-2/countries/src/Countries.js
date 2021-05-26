import React from 'react'

const InfoButton = ({name, filler}) => {
    return (
    <button onClick={() => filler(name)} >
        show
    </button>
    )
}

const Country = ({country, filler}) => {
    return (
        <p>{country.name} <InfoButton name={country.name} filler={filler} /></p>
    )
  }
  
//Should this have been made using useEffect?
//Fetching should be done only when one country is shown.
/*const Weather = async({country}) => {
    const api_key = process.env.REACT_APP_API_KEY
    const info = axios
        .get(`http://api.weatherstack.com/current?access_key=${api_key}&query=${country.capital}&units=m`)
        .then(response => response.data)
    console.log("Weather?", info)
    return (
        <div>
            <h1>Weather in {country.capital}</h1>
            <p>Temperatue: {info.current.temperature} Celsius</p>
            <p>Wind speed: {info.current.wind_dir} </p>
        </div>
    )
}*/
//Could not make the weather part work unfortunately

const CountryDetails = ({country}) => {
    return(
        <div>
        <h1>{country.name}</h1>
        <p>Capital {country.capital}</p>
        <p>Population {country.population}</p>
        <ul>
            {country.languages.map(l => {
            return <li key={l.name}>{l.name}</li>
            })}
        </ul>
        <img src={country.flag} alt={"Flag"} height={200} width={250} />
        </div>
    )
 }

const Countries = ({countries, filler}) => {
    if(countries.length > 10){
        return(
        <h1>Too many matches, specify another filter</h1>
        )
    }
    if(countries.length === 1){
        return(
        <CountryDetails country={countries[0]}/>
        )
    }
    return (
        <div>
        {countries.map(country => {
            return (
            <Country key={country.name} country={country} filler={filler} />
            )
        })}
        </div>
    )
}

  export default Countries