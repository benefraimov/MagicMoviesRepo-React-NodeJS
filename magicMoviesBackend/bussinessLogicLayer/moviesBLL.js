const { Movie, Subscriber } = require("../models/movie_and_subscriberModel");

// Get Movie by ID
const getMovie = (movieId) => {
    return new Promise((resolve, reject) => {
        // Find the movie document by its ID and populate its subscribers field
        Movie.findOne({ _id: movieId })
            .populate("subscribers")
            .exec((err, movie) => {
                if (err) {
                    reject(err);
                } else if (!movie) {
                    reject(new Error(`movie with ID ${movieId} not found`));
                } else {
                    resolve(movie);
                }
            });
    });
};

// Check if movie exist
const checkMovie = (movieName) => {
    return new Promise((resolve, reject) => {
        Movie.findOne({ name: movieName })
            .populate("subscribers")
            .exec((err, movie) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(movie);
                }
            });
    });
};

// Get all movies
const getMovies = () => {
    return new Promise((resolve, reject) => {
        // Find all Movie documents and populate their subscribers fields
        Movie.find({})
            .populate("subscribers")
            .exec((err, movies) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(movies);
                }
            });
    });
};

// Create new Movie
const createMovie = (name, premiered, genres, image, subscriberIds) => {
    return new Promise((resolve, reject) => {
        const movie = new Movie({
            name,
            premiered,
            genres,
            image,
            subscribers: subscriberIds,
        });
        movie.save((err, savedMovie) => {
            if (err) {
                reject(err);
            } else {
                resolve(savedMovie);
            }
        });
    });
};

// Update Movie by ID
const updateMovie = (movieId, updatedMovie) => {
    return new Promise((resolve, reject) => {
        Movie.findByIdAndUpdate(
            movieId,
            updatedMovie,
            { new: true },
            (err, updatedDoc) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(updatedDoc);
                }
            }
        );
    });
};

// Delete Movie by ID, and delete his id from all associated subscribers
const deleteMovie = (movieId) => {
    return new Promise((resolve, reject) => {
        Movie.findByIdAndDelete(movieId, (err, deletedDoc) => {
            if (err) {
                reject(err);
            } else {
                // Remove the movie ID from all the associated subscribers
                const subscriberIds = deletedDoc.subscribers.map(
                    (subscriber) => subscriber._id
                );
                Subscriber.updateMany(
                    { _id: { $in: subscriberIds } },
                    { $pull: { movies: movieId } },
                    (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(deletedDoc);
                        }
                    }
                );
            }
        });
    });
};

module.exports = {
    getMovie,
    checkMovie,
    getMovies,
    createMovie,
    updateMovie,
    deleteMovie,
};
