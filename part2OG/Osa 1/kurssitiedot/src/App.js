import React from 'react'

const Header = ({course}) => {
  return(
  <h1>{course}</h1>
  )
}

const Part = (props) => {
  return (
    <p>
      {props.name} {props.exercises}
    </p>
  )
}

const Content = ({parts}) => {
  console.log("What are parts?", parts)
  console.log("First thing", parts[0].name)
  return(
    <div>
      <Part name={parts[0].name} exercises={parts[0].exercises} />
      <Part name={parts[1].name} exercises={parts[1].exercises}/>
      <Part name={parts[2].name} exercises={parts[2].exercises}/>
    </div>
  )
}

const Total = ({parts}) => {
  let i = 0
  parts.forEach(thing => {
    i += thing.exercises
  })
  return(
    <p>Number of exercises {i}</p>
  )
}


const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }
  return (
    <div>
      <Header course={course.name}/>
      <Content parts={course.parts}/>
      <Total parts={course.parts}/>
    </div>
  )
}

export default App