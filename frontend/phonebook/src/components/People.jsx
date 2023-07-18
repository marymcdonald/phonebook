const Contact = ({person, deleteContact}) => {
  return (
    <div>
      <li>
        {person.name} {person.phone}
        <button onClick={deleteContact}>delete</button>
      </li>
    </div>
  )

}

const People = ({list, deleteHandler}) => {
  return (
    <div>
      <ul>
        {list.map(person =>
          <Contact 
            key={person.id}
            person={person}
            deleteContact={() => deleteHandler(person.name, person.id)}
          />
        )}
      </ul>
    </div>
  )
}

export default People