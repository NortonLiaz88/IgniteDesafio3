const express = require("express");

const { v4: uuidv4, validate, parse } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];


function checksTodoExists(request, response, next) {
  const { id } = request.params;

  if(!validate(id)) {
    return response.status(404).json({ error: "Mensagem de erro" });
  }
  const repository = repositories.find((repository) => repository.id === id);
  if (!repository) {
    return response.status(404).json({ error: "Mensagem de erro" });
  }
  request.repository = repository;
  next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuidv4(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", checksTodoExists,(request, response) => {
  const {title, techs, url, likes} = request.body;
  const { repository } = request;
  if(likes) {
    return response.json({ likes: repository.likes });
  }

  repository.title = title;
  repository.techs = techs;
  repository.url = url;
  return response.json(repository);
});

app.delete("/repositories/:id", checksTodoExists,(request, response) => {
  const { repository } = request;

  const repositoryIndex = repositories.indexOf(repository);
  repositories.splice(repositoryIndex, 1);

  return response.status(204).json(repositories);
});

app.post("/repositories/:id/like", checksTodoExists,(request, response) => {
  const { repository } = request;

  repository.likes = ++repository.likes

  return response.json({likes: repository["likes"]});
});

module.exports = app;
