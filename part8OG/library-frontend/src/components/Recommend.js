import React, { useEffect, useState } from 'react'
import { useLazyQuery, useQuery } from '@apollo/client'
import {  BOOKS_OF_GENRE, ME } from '../query'

const Recommend = (props) => {

  const [genreBooks, result] = useLazyQuery(BOOKS_OF_GENRE, { fetchPolicy: 'no-cache' })
  const [books, setBooks] = useState([])
  const user = useQuery(ME)

  // We have to wait for the user to have data
  useEffect(() => {
    if(user.data) {
      genreBooks({ variables: {genre: user.data.me.favoriteGenre}})
    }
  }, [genreBooks, user])

  // We need to wait for the genreBooks to get it's data
  // 2 useEffect hooks neede because we don't want another query done after
  //user data has been received
  useEffect(() => {
    if(result.data && result.data.allBooks){
      setBooks(result.data.allBooks)
    }
  }, [result.data, books])


  if(!props.show){
    return null
  }

  if(books.loading || user.loading){
    return (
      <div>
        loading...
      </div>
    )
  }

  const favGenre = user.data.me.favoriteGenre
  return (
    <div>
      <h2>Recommendations</h2>

      <p>books in your favorite genre <b>{favGenre}</b></p>
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
          {books.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>

    </div>
  )
}

export default Recommend