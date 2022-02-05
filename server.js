// dependencies
const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const app = express();
const moviesData = require("./Movie-Data/data.json");
const pg = require("pg");
// const bodyParser = require("body-parser");
// const jsonParser = bodyParser.json();

// middlewares
app.use(express.json());
app.use(errorHandler);
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
// const client = new pg.Client(DATABASE_URL);
const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
const APIKEY = process.env.APIKEY;
const PORT = process.env.PORT;

// constructor function

function MoviesLibrary(title, poster_path, overview) {
  this.title = title;
  this.poster_path = poster_path;
  this.overview = overview;
}

// end points
app.get("/", homePageHandler);
app.get("/favorite", favoritePageHandler);
app.get("/trending", trendingPageHandler);
app.get("/topRated", topRatedPageHandler);
app.get("/upcoming", upcomingPageHandler);
app.get("/search", searchPageHandler);
app.post("/addMovie", addMovieHandler);
app.get("/getMovies/:id", getMoviesHandler);
app.put("/updateMovieComment/:id", updateMovieCommentHandler);
app.delete("/deleteMovie/:id", deleteMovieHandler);
app.get("*", pageNotFoundHandler);

// endpoints handling functions

function homePageHandler(req, res) {
  let moviesLibray = [];
  moviesData.data.forEach((movie) => {
    movie = new MoviesLibrary(movie.title, movie.poster_path, movie.overview);
    moviesLibray.push(movie);
  });
  return res.status(200).json(moviesLibray);
}

function favoritePageHandler(req, res) {
  return res.status(200).send("To be filled...");
}

function trendingPageHandler(req, res) {
  let trendingMovies = [];
  axios
    .get(
      `https://api.themoviedb.org/3/trending/all/week?api_key=${APIKEY}&language=en-US`
    )
    .then((value) => {
      value.data.results.forEach((movie) => {
        movie = new MoviesLibrary(
          movie.title,
          movie.poster_path,
          movie.overview
        );
        trendingMovies.push(movie);
      });
      return res.status(200).json(trendingMovies);
    });
}

function topRatedPageHandler(req, res) {
  let topRated = [];
  axios
    .get(
      `https://api.themoviedb.org/3/movie/top_rated?api_key=${APIKEY}&language=en-US&page=1`
    )
    .then((value) => {
      value.data.results.forEach((movie) => {
        movie = new MoviesLibrary(
          movie.title,
          movie.poster_path,
          movie.overview
        );
        topRated.push(movie);
      });
      return res.status(200).json(topRated);
    });
}

function upcomingPageHandler(req, res) {
  let upcoming = [];
  axios
    .get(
      `https://api.themoviedb.org/3/movie/upcoming?api_key=${APIKEY}&language=en-US&page=1`
    )
    .then((value) => {
      value.data.results.forEach((movie) => {
        movie = new MoviesLibrary(
          movie.title,
          movie.poster_path,
          movie.overview
        );
        upcoming.push(movie);
      });
      return res.status(200).json(upcoming);
    });
}

function searchPageHandler(req, res) {
  let searchQuery = req.query.search;
  console.log(req.query.search);
  let searchResults = [];

  axios
    .get(
      `https://api.themoviedb.org/3/search/movie?api_key=${APIKEY}&language=en-US&query=${searchQuery}`
    )
    .then((value) => {
      value.data.results.forEach((movie) => {
        movie = new MoviesLibrary(
          movie.title,
          movie.poster_path,
          movie.overview
        );
        searchResults.push(movie);
      });
      return res.status(200).json(searchResults);
    });
}

function addMovieHandler(req, res) {
  let movie = req.bodyy;
  console.log(movie, "data");
  let sql = `INSERT INTO movies(title, poster_path,overview,comment) VALUES($1, $2, $3, $4) RETURNING *;`;
  let values = [movie.title, movie.poster_path, movie.overview, movie.comment];

  client.query(sql, values).then((data) => {
    console.log(data);
    // return res.status(201).json(data.rows);
    return res.status(200).send("test");
  });
  // .catch((err) => errorHandler(err, req, res));
}

function getMoviesHandler(req, res) {
  let id = req.params.id;
  let sql = `SELECT * FROM movies WHERE id=${id};`;
  client.query(sql).then((data) => {
    res.status(200).json(data.rows);
  });
}

function updateMovieCommentHandler(req, res) {
  const id = req.params.id;
  const movie = req.body;

  const sql = `UPDATE movies SET comment=$1 WHERE id=${id} RETURNING *;`;
  const values = [movie.comment];

  client.query(sql, values).then((data) => {
    return res.status(200).json(data.rows);
  });
  // .catch((error) => {
  //   errorHandler(error, req, res);
  // });
}

function deleteMovieHandler(req, res) {
  const { id } = req.params;
  console.log(id);
  const sql = `DELETE FROM movies WHERE id=${id};`;

  client.query(sql).then(() => {
    return res.status(204).json([]);
  });
  // .catch((error) => {
  //   errorHandler(error, req, res);
  // });
}

function pageNotFoundHandler(req, res) {
  return res.status(404).send({
    status: 404,
    responseText: "page not found",
  });
}

function errorHandler(err, req, res, next) {
  res.status(500).send("something went wrong");
  // res.render("error", { error: err });
}

client.connect().then(() => {
  app.listen(PORT, () => {
    console.log(`listening to port ${PORT}`);
  });
});
