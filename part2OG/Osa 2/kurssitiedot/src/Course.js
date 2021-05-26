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
  const Total = ({parts}) => {
    return (
      <p>Number of exercises {parts.map(x => x.exercises).reduce((a, p) => a + p )}</p>
    )
  }
  
  const Content = ({parts}) => {
    return (
      <div>
        {parts.map(course => {
            return <Part key={course.id} name={course.name} exercises={course.exercises} />
            }
          )}
        <Total parts={parts} />
      </div>
    )
  }
  
  const Course = (props) => {
    return(
      <div>
        <Header course={props.name}/>
        <Content parts={props.parts} />
      </div>
    )
  }

  export default Course