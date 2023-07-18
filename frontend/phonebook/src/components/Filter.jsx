const Filter = ({value, eventHandler}) => {
  return (
    <div>
      <label>filter shown with 
        <input value={value} onChange={eventHandler}/>
      </label>
    </div>
  )
}

export default Filter