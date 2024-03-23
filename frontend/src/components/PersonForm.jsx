const PersonForm = ({
  submitHandler,
  changeNameHandler,
  changeNumberHandler,
}) => {
  return (
    <form onSubmit={submitHandler}>
      <h2>Add a new</h2>
      <div>
        Name: <input onChange={changeNameHandler} />
      </div>
      <div>
        Number: <input onChange={changeNumberHandler} />
      </div>
      <div>
        <button type="submit">Add</button>
      </div>
    </form>
  );
};

export default PersonForm;
