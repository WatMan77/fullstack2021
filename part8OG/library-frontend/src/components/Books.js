import React, { useState } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../query'

const Books = (props) => {

  const books = useQuery(ALL_BOOKS)
  const [filter, setFilter] = useState('')

  if (!props.show) {
    return null
  }

  if(books.loading){
    return (
      <div>loading...</div>
    )
  }

  let genres = new Set(books.data.allBooks.map(x => x.genres).flat())
  genres = [...genres]

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {books.data.allBooks.filter(x => filter !== '' ? x.genres.includes(filter) : x).map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
      <div>
        {genres.map(x =>
          <button key={x} onClick={() => setFilter(x)}>{x}</button>
            )}
        <button onClick={() => setFilter('')}>all genres</button>
      </div>
    </div>
  )
}

export default Books