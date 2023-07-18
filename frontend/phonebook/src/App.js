import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import People from './components/People'
import ContactForm from './components/ContactForm'
import Notification from './components/Notification'
import contactService from './services/contacts'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [message, setMessage] = useState('an error occurred...')

  useEffect(() => {
    contactService
      .getAll()
      .then(initialContacts => {
        setPersons(initialContacts)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const personObj = {
      name: newName,
      phone: newNumber,
    }

    if (findName()) {
      if(window.confirm(`${newName} is already in the phonebook. Replace phone number?`)) {
        const id = persons.findIndex(contact => contact.name === newName) + 1
        contactService
          .update(id, personObj)
          .then(returnedContact => {
            setPersons(persons.map(contact => contact.id !== id ? contact:returnedContact))
            setNewName('')
            setNewNumber('')
            setMessage(`Updated phone number for ${newName}`)
            setTimeout(() => {
              setMessage(null)
            }, 5000)
          })
          .catch(error => {
            setMessage(`The contact ${newName} has already been deleted from the server.`)
            setPersons(persons.filter(contact => contact.id !== id))
          })
      }
    } else {
      contactService
        .create(personObj)
        .then(returnedContact => {
          setPersons(persons.concat(returnedContact))
          setNewName('')
          setNewNumber('')
          setMessage(`Added ${newName}`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
    }

  }

  const handleNameChange = event => {
    setNewName(event.target.value)
  }

  const findName = () => {
    const findArr = persons.filter(person => person.name === newName)
    return findArr.length === 1
  }

  const handleNumberChange = event => {
    setNewNumber(event.target.value)
  }

  const handleSearchChange = event => {
    setSearchTerm(event.target.value)
    if (event.target.value === '') {
      setShowAll(true)
    } else {
      setShowAll(false)
    }
  }

  const pplToShow = showAll
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const deleteHandler = (name, id) => {
    if(window.confirm(`Delete ${name}?`)) {
      contactService
      .deleteContact(id)
      .then(() => {
        setPersons(persons.filter(contact => contact.id !== id))
      })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter value={searchTerm} eventHandler={handleSearchChange}/>
      <h2>Add Contact</h2>
      <ContactForm values={[newName, newNumber]} eventHandlers={[addPerson, handleNameChange, handleNumberChange]}/>
      <h2>Contact List</h2>
      <People list={pplToShow} deleteHandler={deleteHandler}/>
    </div>
  )
}

export default App