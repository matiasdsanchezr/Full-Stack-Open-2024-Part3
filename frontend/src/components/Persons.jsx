const Persons = ({ persons, clickDeleteHandler }) => {
  return (
    <div>
      <h2>Numbers</h2>
      {persons.map((person) => (
        <Person
          key={person.name}
          person={person}
          clickDeleteHandler={clickDeleteHandler}
        />
      ))}
    </div>
  );
};

const Person = ({ person, clickDeleteHandler }) => {
  return (
    <li>
      {person.name} - {person.number}{" "}
      <button onClick={() => clickDeleteHandler(person)}>Delete</button>
    </li>
  );
};

export default Persons;
