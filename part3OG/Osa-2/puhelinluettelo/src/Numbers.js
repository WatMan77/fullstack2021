
const Numbers = ({people, deletion}) => {
    return (
        <div>
            {people.map(person => {
                return (
                    <p key={person.name}>{person.name} {person.number} <button onClick={() => deletion(person.id)}>delete</button> </p>
                )
            })}
        </div>
    )
}

export default Numbers