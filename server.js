const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const app = express();
const moviesData = require("./Movie-Data/data.json");
const pg = require("pg");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
dotenv.config();
const DATABASE_URL = process.env.DATABASE_URL;
const client = new pg.Client(DATABASE_URL);
app.use(express.json());
const APIKEY = process.env.APIKEY;

function MoviesLibrary(title, poster_path, overview) {
  this.title = title;
  this.poster_path = poster_path;
  this.overview = overview;
}

let homePageHandler = (req, res) => {
  let moviesLibray = [];
  moviesData.data.forEach((movie) => {
    movie = new MoviesLibrary(movie.title, movie.poster_path, movie.overview);
    moviesLibray.push(movie);
  });
  return res.status(200).json(moviesLibray);
};

app.get("/", homePageHandler);

let favoritePageHandler = (req, res) => {
  return res.status(200).send("To be filled...");
};

app.get("/favorite", favoritePageHandler);

let trendingPageHandler = (req, res) => {
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
};

app.get("/trending", trendingPageHandler);

let topRatedPageHandler = (req, res) => {
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
};

app.get("/topRated", topRatedPageHandler);

let upcomingPageHandler = (req, res) => {
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
};

app.get("/upcoming", upcomingPageHandler);

let searchPageHandler = (req, res) => {
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
};

app.get("/search", searchPageHandler);

const addMovieHandler = (req, res) => {
  let movie = req.body;
  let sql = `INSERT INTO movies(title, poster_path,overview,comment) VALUES($1, $2, $3, $4); RETURN *`;
  let values = [movie.id, movie.poster_path, movie.overview, movie.comment];

  client.query(sql, values).then((data) => {
    console.log(data);
    return res.status(201).json(data.rows);
  });
};

app.post("/addMovie", jsonParser, addMovieHandler);

const getMoviesHandler = (req, res) => {
  let sql = "SELECT * FROM movies";
  client.query(sql).then(() => {
    res.status(200).json(data.row);
  });
};

app.get("/getMovies", getMoviesHandler);

const pageNotFoundHandler = (req, res) => {
  return res.status(404).send({
    status: 404,
    responseText: "page not found",
  });
};

app.get("*", pageNotFoundHandler);

// const errorHandler = (err, req, res) => {
//   res.send({
//     status: 500,
//     responseText: "Something went wrong",
//   });
// };

// app.use(errorHandler);

client.connect().then(() => {
  app.listen(3030, () => {
    console.log("listening to port 3030");
  });
});
