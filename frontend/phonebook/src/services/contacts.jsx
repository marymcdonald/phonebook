import axios from 'axios'

const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = newContact => {
  const req = axios.post(baseUrl, newContact)
  return req.then(response => response.data)
}

const update = (id, newContact) => {
  const req = axios.put(`${baseUrl}/${id}`, newContact)
  return req.then(response => response.data)
}

const deleteContact = (id) => {
  const req = axios.delete(`${baseUrl}/${id}`)
  return req.then(response => response.data)
}

export default { getAll, create, update, deleteContact }