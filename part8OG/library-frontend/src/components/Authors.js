  
import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { ALL_AUTHORS, EDIT_BIRTH } from '../query'
import Select from 'react-select'

const Authors = (props) => {
  const authors = useQuery(ALL_AUTHORS)
  const [name, setName] = useState('')
  const [born, setBirth] = useState('')

  const [editAuthor] = useMutation(EDIT_BIRTH, {
    refetchQueries: [{ query: ALL_AUTHORS }]
  })
  

  if (!props.show) {
    return null
  }

  const submit = (event) => {
    event.preventDefault()

    editAuthor({ variables: { name: name.value, setBornTo: Number(born) }})
    setName('')
    setBirth('')

  }

  if(authors.loading){
    return (
      <div>loading...</div>
    )
  }

  const options = authors.data.allAuthors.map(x => (
    {
      value: x.name,
      label: x.name
    }
  ))
  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.data.allAuthors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
      <h3>Set birthyear</h3>
      <form onSubmit={submit}>
        <div>
        <Select
          defaultInputValue={name}
          onChange={setName}
          options={options}
        />
        </div>
        <div>
          born
          <input 
            type='number'
            value={born}
            onChange={({ target }) => setBirth(target.value)}
          />
        </div>
        <button type='submit'>update author</button>
      </form>

    </div>
  )
}

export default Authors
