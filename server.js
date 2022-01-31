const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const app = express();
const moviesData = require("./Movie-Data/data.json");
dotenv.config();
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
      `https://api.themoviedb.org/3/trending/all/week?api_key=${APIKEY}&language=en-US&query=${searchQuery}`
    )
    .then((value) => {
      value.data.results.forEach((movie) => {
        movie = new MoviesLibrary(
          movie.title,
          movie.poster_path,
          movie.overview
        );
        searchResults.push(movie);

        // value.data((movie) => {
        //   // movie = new MoviesLibrary(
        //   //   movie.title,
        //   //   movie.poster_path,
        //   //   movie.overview
        //   // );
        //   searchResults.push(movie);
      });
      return res.status(200).json(searchResults);
    });
};

app.get("/search", searchPageHandler);

const pageNotFoundHandler = (req, res) => {
  return res.status(404).send({
    status: 404,
    responseText: "page not found",
  });
};

app.get("*", pageNotFoundHandler);

const errorHandler = (err, req, res) => {
  res.send({
    status: 500,
    responseText: "Something went wrong",
  });
};

app.use(errorHandler);
app.listen(3000, () => {
  console.log("listening to port 3000");
});
