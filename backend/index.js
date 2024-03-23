require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const Person = require("./models/person");

const app = express();

morgan.token("body", function (req) {
  return JSON.stringify(req.body);
});
const logger = morgan(
  ":method :url :status :res[content-length] - :response-time ms :body"
);

app.use(express.static("dist"));
app.use(express.json());
app.use(cors());
app.use(logger);

app.get("/info", (request, response) => {
  Person.find({}).then((result) => {
    response.send(
      `<div>
        <p>Phonebook has info for ${result.length} people</p>
        <p>${Date()}</p>
      </div>`
    );
  });
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((result) => {
    response.json(result);
  });
});

app.post("/api/persons", (request, response, next) => {
  const { name, number } = request.body;
  const person = new Person({ name, number });
  person
    .save()
    .then((result) => {
      response.json(result);
    })
    .catch((error) => {
      next(error);
    });
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((result) => {
      if (result) response.json(result);
      else response.status(404).end();
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  const { name, number } = request.body;
  Person.findByIdAndUpdate(
    id,
    { name, number },
    { new: true, runValidators: true }
  )
    .then((result) => {
      if (result) response.json(result);
      else response.status(404).end();
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  Person.findByIdAndDelete(id)
    .then(() => response.status(204).end())
    .catch((error) => {
      next(error);
    });
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  } else if (error.name === "MongoServerError" && error.code === 11000) {
    return response.status(400).json({ error: "duplicated name" });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
