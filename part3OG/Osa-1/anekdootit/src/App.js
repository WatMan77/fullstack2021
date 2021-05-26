import React, { useState } from 'react'

const Anecdote = ({text, votes}) => {
  return(
    <div>
      {text}
      <p>{`has ${votes} votes`}</p>
    </div>
    
  )
}

const BestAnecdote = ({text, votes}) => {
  return (
    <div>
      <h1>Anecdotes with the most votes</h1>
      {text}
      <p>has {votes} votes</p>
    </div>
  )
}

const Button = ({handleClick, text}) => {
  return (
    <button onClick={handleClick}>
      {text}
    </button>
  )
}
//This doesn't have to be here. Would it be better to put inside App?
const getRandom = (max) => {
  return Math.floor(Math.random() * max)
}


const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [points, pointsHandler] = useState(new Array(anecdotes.length).fill(0))

  const vote = () => {
    const copy = [...points]
    copy[selected] += 1
    pointsHandler(copy)
  }

  return (
    <div>
      <Anecdote text={anecdotes[selected]} votes={points[selected]}/>
      <p><Button text={"press for anecdote"} handleClick={() => setSelected(getRandom(anecdotes.length))} /></p>
      <p><Button text={"Vote"} handleClick={vote} /></p>
      <BestAnecdote text={anecdotes[points.indexOf(Math.max.apply(null, points))]} votes={Math.max.apply(null, points)} />
    </div>
  )
}

export default App