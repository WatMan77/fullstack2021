
// export const addBlog = (blog) => {
//   return dispatch => {
//     dispatch({
//       type: 'ADD',
//       data: blog
//     })
//   }
// }
// addBlog is not used as it does not create unique id's for the blogs
// instead, after adding a blog, we fetch all blogs from the backend
// like we did previously

export const initBlogs = (blogs) => {
  return dispatch => {
    dispatch({
      type: 'INIT_BLOGS',
      data: blogs
    })
  }
}

const blogReducer = (state = [], action) => {
  switch(action.type) {
  case 'ADD':
    return state.concat(action.data)

  case 'INIT_BLOGS':
    return action.data

  default:
    return state
  }
}

export default blogReducer