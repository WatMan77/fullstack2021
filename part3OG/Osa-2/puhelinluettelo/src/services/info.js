import axios from 'axios'
const baseURL = "/api/persons"

const getAll = () => {
    const request  = axios.get(baseURL)
    return request.then(response => {
        return response.data
    })
}

const create = newObject => {
    const request = axios.post(baseURL, newObject)
    return request.then(response => {
        return response.data
    })
}

const update = (id, newObject) => {
    const request = axios.put(`${baseURL}/${id}`, newObject)
    return request.then(response => {
        return response.data
    })
}

const deletion = id => {
    console.log("Deleteting ID", id)
    const request = axios.delete(`${baseURL}/${id}`)
    return request.then(response => {
        return response.data
    })
}
//NOTE! Browser shows a warning even though this was done exactly like in the material
export default { getAll, create, update, deletion }