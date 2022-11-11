const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieExists(req, res, next) {
  const movie = await service.getMovie(req.params.movieId);
  if (movie) {
    res.locals.movie = movie;
    return next();
  } else {
    next({
      status: 404,
      message: "Movie cannot be found."
    });
  }
}

async function list(req, res) {
  if (req.query.is_showing === "true") {
    return res.json({ data: await service.listShowing() });
  }
  res.json({ data: await service.list() });
}

async function getMovie(req, res) {
  const movieId = res.locals.movie.movie_id;
  res.json({ data: await service.getMovie(movieId) });
}

async function getTheatersByMovie(req, res) {
  const movieId = res.locals.movie.movie_id;
  res.json({ data: await service.getTheatersByMovie(movieId) });
}

async function getReviewsByMovie(req, res) {
  const movieId = res.locals.movie.movie_id;
  res.json({ data: await service.getReviewsByMovie(movieId) });
}

module.exports = {
  list: asyncErrorBoundary(list),
  getMovie: [asyncErrorBoundary(movieExists), asyncErrorBoundary(getMovie)],
  getTheatersByMovie: [asyncErrorBoundary(movieExists), asyncErrorBoundary(getTheatersByMovie)],
  getReviewsByMovie: [asyncErrorBoundary(movieExists), asyncErrorBoundary(getReviewsByMovie)],
}