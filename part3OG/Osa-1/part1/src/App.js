import React from 'react'

const Hello = (dumb) => {
  return (
    <div>
      <p>Hello {dumb.name}</p>
    </div>
  )
}

const App = () => {
  return (
    <div>
      <h1>Greetings</h1>
      <Hello name="Donald" />
      <Hello name="Obama"/>
      <Hello name="Niinistö"/>
    </div>
  )
}

export default App