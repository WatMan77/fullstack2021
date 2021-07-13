import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { filterReducer, anecdoteFilter } from '../reducers/filterReducer'

const Filter = () => {
  const dispatch = useDispatch()
  const handleChange = (event) => {
    event.preventDefault()
    console.log(event.target.value)
    dispatch(anecdoteFilter(event.target.value))
  }
  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter <input onChange={handleChange} />
    </div>
  )
}

export default Filter