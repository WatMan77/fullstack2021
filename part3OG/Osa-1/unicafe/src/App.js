import React, { useState } from 'react'

const Button = ({handleClick, text}) => {
  return (
    <button onClick={handleClick} >
      {text}
    </button>
  )
}

const Header = () => {
  return(
    <h1>Give us feedback!</h1>
  )
}

const StatisticsLine = ({text, value}) => {
  return(
    <tr>
       <td>{text}</td>
       <td>{value}</td>
    </tr>
    
  )
}

const Stats = ({good, neutral, bad}) => {
  const sum = good + neutral + bad
  if(sum === 0){
    return (
      <div>
        <h2>Statistics</h2>
        <p>No feedback given</p>
      </div>
    )
  }
  const average = (good - bad) / sum
  const positive = good / sum * 100 + "%"
  return (
    <div>
      <table>
        <tbody>
            <StatisticsLine text="good" value={good}/>
            <StatisticsLine text="neutral" value={neutral} />
            <StatisticsLine text="bad" value={bad} />
            <StatisticsLine text="Average" value={average} />
            <StatisticsLine text="Positive" value={positive} />
        </tbody>

      </table>
    </div>
  )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)


  return (
    <div>
      <Header />
      <Button handleClick={() => setGood(good + 1)} text={"good"} />
      <Button handleClick={() => setNeutral(neutral + 1)} text={"neutral"} />
      <Button handleClick={() => setBad(bad + 1)} text={"bad"} />
      <Stats good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App
