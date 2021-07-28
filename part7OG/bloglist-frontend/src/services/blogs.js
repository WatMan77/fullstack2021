import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `bearer ${newToken}`
}

const getAll = async() => {
  const response = await axios.get(baseUrl)
  return response.data.sort((a, b) => Number(b.likes) - Number(a.likes))
}

const create = async(newBlog) => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

const like = async(theBlog) => {

  const config = {
    headers: { Authorization: token }
  }

  const blog = {
    user: theBlog.user.id,
    likes: Number(theBlog.likes) + 1,
    author: theBlog.author,
    title: theBlog.title,
    url: theBlog.url
  }
  const response = await axios.put(`${baseUrl}/${theBlog.id}`, blog, config)
  return response.data
}

const remove = async(theBlog) => {

  if(!window.confirm(`Are you sure you want to remove the blog ${theBlog.title}?`)){
    return
  }

  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.delete(`${baseUrl}/${theBlog.id}`, config)
  return response.data
}

const comment = async(info) => {

  const response = await axios.post(`${baseUrl}/${info.id}/comments`, { comment: info.comment })

  return response.data
}
export default { getAll, create, setToken, like, remove, comment }