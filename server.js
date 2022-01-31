const express = require("express");

const app = express();
const errorHandler = require("errorHandler");

app.get("*", pageNotFoundHandler);

const pageNotFoundHandler = (req, res) => {
  return res.status(404).send({
    status: 404,
    responseText: "page not found",
  });
};

const errorHandler = (err, req, res) => {
  res.send({
    status: 500,
    responseText: "Something went wrong",
  });
};

app.use(errorHandler);

app.get("/", moviesLibraryHandler);

app.listen(3000, () => {
  console.log("listening to port 3000");
});

const moviesData = require("./Movie-Data/data.json");

app.get("/", homePageHandler);

function MoviesLibrary(title, poster_path, overview) {
  this.title = title;
  this.poster_path = poster_path;
  this.overview = overview;
}

const homePageHandler = (req, res) => {
  let moviesLibray = [];
  moviesData.data.forEach((movie) => {
    let movie = new MoviesLibrary(
      movie.title,
      movie.poster_path,
      movie.overview
    );
    moviesLibray.push(movie);
  });
  return res.status(200).json(moviesLibray);
};

app.get("/favorite", favoritePageHandler);

const favoritePageHandler = (req, res) => {
  return res.status(200).send("To be filled...");
};
