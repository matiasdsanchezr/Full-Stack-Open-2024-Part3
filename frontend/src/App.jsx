import { useState, useEffect } from "react";
import Filter from "./components/SearchForm";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Notification from "./components/Notification";
import personService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [filter, setFilter] = useState("");
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [message, setMessage] = useState(null);

  useEffect(() => {
    personService.getAll().then((response) => {
      setPersons(response.data);
    });
  }, []);

  const changeFilterHandler = (event) => {
    setFilter(event.target.value);
  };

  const changeNameHandler = (event) => {
    setNewName(event.target.value);
  };

  const changeNumberHandler = (event) => {
    setNewNumber(event.target.value);
  };

  const showNotification = (text, type = "done") => {
    setMessage({ text, type });
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  const personSubmitHandler = (event) => {
    event.preventDefault();
    const match = persons.find(
      (person) => person.name.toLowerCase() === newName.toLowerCase()
    );
    if (!match) {
      personService
        .create({
          name: newName,
          number: newNumber,
        })
        .then((response) => {
          setPersons(persons.concat(response.data));
          showNotification(`Added ${response.data.name}`);
        })
        .catch((error) => {
          showNotification(error.response.data.error, "error");
        });
      return;
    }

    const confirm = window.confirm(
      `${newName} is already added to the phonebook, replace the old number with a new one?`
    );
    if (confirm) {
      const updatedPerson = { ...match, number: newNumber };

      personService
        .update(match.id, updatedPerson)
        .then(() => {
          setPersons(
            persons.map((person) =>
              person.id === match.id ? updatedPerson : person
            )
          );
        })
        .catch((error) => {
          showNotification(error.response.data.error, "error");
        });
    }
  };

  const clickDeleteHandler = (person) => {
    const confirm = window.confirm(`Delete ${person.name} ?`);
    if (confirm) {
      personService
        .remove(person.id)
        .then(() => {
          setPersons(persons.filter((p) => p.id !== person.id));
        })
        .catch((error) => {
          showNotification(error.response.data.error, "error");
        });
    }
  };

  const personsFiltered = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter changeFilterHandler={changeFilterHandler} />
      <PersonForm
        submitHandler={personSubmitHandler}
        changeNameHandler={changeNameHandler}
        changeNumberHandler={changeNumberHandler}
      />
      <Persons
        persons={personsFiltered}
        clickDeleteHandler={clickDeleteHandler}
      />
    </div>
  );
};

export default App;
