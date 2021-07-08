import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'
import BlogForm from './BlogForm'
// import { prettyDOM } from '@testing-library/dom'

describe('<Blog />', () => {
  let component
  const mockHandler = jest.fn()

  beforeEach(() => {

    const blog = {
      title: 'First test blog',
      author: 'The developer',
      url: 'www.www.com',
      likes: 10,
    }
    component = render(
      <Blog blog={blog} like={mockHandler} remove={mockHandler}/>
    )

  })

  test('only title and author should be seen at first', () => {

    expect(component.container).toHaveTextContent(
      'First test blog'
    )
    expect(component.container).toHaveTextContent(
      'The developer'
    )

    expect(component.container).not.toHaveTextContent(
      'www.www.com'
    )

    expect(component.container).not.toHaveValue(
      10
    )
  })

  test('url and likes should be visible after pressing "show"', () => {

    const button = component.getByText('show')
    expect(component.container).not.toHaveTextContent('www.www.com')
    fireEvent.click(button)

    expect(component.container).toHaveTextContent('www.www.com')
    expect(component.container).toHaveTextContent('10') // It sees likes as a string for some reason
  })

  test('clicking buttons should work', () => {
    const show = component.getByText('show')
    fireEvent.click(show)

    const like = component.getByText('like')
    fireEvent.click(like)
    fireEvent.click(like)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })

})

describe('blogForm', () => {
  const mocker = jest.fn()

  const component = render(
    <BlogForm createBlog={mocker} />
  )

  const title = component.container.querySelector('#title')
  const author = component.container.querySelector('#author')
  const url = component.container.querySelector('#url')

  let form = component.container.querySelector('form')

  fireEvent.change(title, {
    target: { value: 'Test book' }
  })

  fireEvent.change(author, {
    target: { value: 'Jorma' }
  })

  fireEvent.change(url, {
    target: { value: 'www.somesite.com' }
  })

  fireEvent.submit(form)

  expect(mocker.mock.calls).toHaveLength(1)
  expect(mocker.mock.calls[0][0].title).toBe('Test book')
  expect(mocker.mock.calls[0][0].author).toBe('Jorma')
  expect(mocker.mock.calls[0][0].url).toBe('www.somesite.com')

})