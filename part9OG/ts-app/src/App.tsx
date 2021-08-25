import React from 'react';

// new types
interface CoursePartBase {
  name: string;
  exerciseCount: number;
  type: string;
}

interface CourseWithDescription extends CoursePartBase {
  description: string;
}

// Final parts start here
interface CourseNormalPart extends CourseWithDescription {
  type: "normal";
}
interface CourseProjectPart extends CoursePartBase {
  type: "groupProject";
  groupProjectCount: number;
}

interface CourseSubmissionPart extends CourseWithDescription {
  type: "submission";
  exerciseSubmissionLink: string;
}

interface CourseSpecialPart extends CourseWithDescription {
  type: "special";
  requirements: string[];
}

type CoursePart = CourseNormalPart | CourseProjectPart | CourseSubmissionPart | CourseSpecialPart;

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discrimindated union member: ${JSON.stringify(value)}`
  );
}


const Header = ({ name }: { name: string }) => {
  return <h1>{name}</h1>
};

const Part = (props: CoursePart) => {
  switch(props.type){
    case 'normal':
      return(
        <div>
        <p><b>{props.name} {props.exerciseCount}</b>
        <br></br> {props.description}
        </p>
        </div>

      );
    case 'groupProject':
      return(
        <p>
        <b>{props.name} {props.exerciseCount}</b><br></br>
        project exercises {props.groupProjectCount}
        </p>
      );

    case 'submission':
      return(
        <p>
        <b>{props.name} {props.exerciseCount}</b><br></br>
        {props.exerciseSubmissionLink}
        </p>
      );

    case 'special':
      return(
        <p>
          <b>{props.name} {props.exerciseCount}</b><br></br>
          {props.description}<br></br>
          requirements: {props.requirements.join(', ')}
        </p>
      );

    default:
      return assertNever(props);
  }

}

const Content = (part: CoursePart) => {
  return (
    <>
    <Part {...part} />
    </>
  )
}

const Total = ({courseParts}: {courseParts: CoursePart[]}) => {
  return (
    <>
    {courseParts.reduce((carry, part) => carry + part.exerciseCount, 0)}
    </>
  )
}

const App = () => {
  const courseName = "Half Stack application development";
  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
      description: "This is the leisured course part",
      type: "normal"
    },
    {
      name: "Advanced",
      exerciseCount: 7,
      description: "This is the harded course part",
      type: "normal"
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      groupProjectCount: 3,
      type: "groupProject"
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing description",
      exerciseSubmissionLink: "https://fake-exercise-submit.made-up-url.dev",
      type: "submission"
    },
    {
      name: "Backend development",
      exerciseCount: 21,
      description: "Typing the backend",
      requirements: ["nodejs", "jest"],
      type: "special"
    }
  ]

  return (
    <div>
      <Header name={courseName}/>
        {courseParts.map(part => 
          <p key={part.name}>
            <Content {...part} />
          </p>          
          )}
      <p>
        Number of exercises{" "}
        <Total courseParts={courseParts} />
      </p>
    </div>
  );
};

export default App;