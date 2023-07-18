const ContactForm = ({values, eventHandlers}) => {
  const [newName, newNumber] = values
  const [addPerson, handleNameChange, handleNumberChange] = eventHandlers 
  return (
    <div>
      <form onSubmit={addPerson}>
          <div>
            <label>
              name: 
              <input value={newName} onChange={handleNameChange}/>
            </label>
            <label>
              phone: 
              <input value={newNumber} onChange={handleNumberChange}/>
            </label>
          </div>
          <div>
            <button type="submit">add</button>
          </div>
      </form>
    </div>
  )
}

export default ContactForm