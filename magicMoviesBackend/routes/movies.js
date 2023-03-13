const router = require("express").Router();
const {
    getMovie,
    getMovies,
    createMovie,
    deleteMovie,
    updateMovie,
} = require("../bussinessLogicLayer/moviesBLL");

// Get Movie by ID
router.post("/getMovie/:id", async (req, res) => {
    try {
        const movieId = req.params.id;
        const movie = await getMovie(movieId);
        return res.status(200).send(movie);
    } catch (error) {
        return res.status(500).send(`Error: ${error}`);
    }
});

// Get all Movies
router.post("/getMovies", async (req, res) => {
    try {
        const movies = await getMovies();
        return res.status(200).send(movies);
    } catch (error) {
        return res.status(500).send(`Error: ${error}`);
    }
});

// Create new Movie
router.post("/newMovie", async (req, res) => {
    try {
        const movieBody = req.body;
        // get all movies data to check if the movie name already exist in the system
        const movies = await getMovies();
        const movieFound = movies.filter(
            (movie) => movie.name.toLowerCase() === movieBody.name.toLowerCase()
        );
        if (movieFound.length > 0) {
            return res.sendStatus(409);
        } else {
            const data = await createMovie(
                movieBody.name,
                movieBody.premiered,
                movieBody.genres,
                movieBody.image,
                movieBody.subscribers
            );
            return res.status(201).send({ message: "success", data });
        }
    } catch (error) {
        return res.status(500).send(`Error: ${error}`);
    }
});

// Update Movie
router.put("/:id", async (req, res) => {
    try {
        const movieId = req.params.id;
        const movieBody = req.body;

        // get all movies data to check if the movie name already exist in the system
        const movies = await getMovies();
        const movieFound = movies.filter(
            (movie) => movie.name.toLowerCase() === movieBody.name.toLowerCase()
        );
        if (
            movieFound.length > 0 &&
            movieFound[0]._id.toString() !== movieId.toString()
        ) {
            return res.sendStatus(409);
        } else {
            await updateMovie(movieId, movieBody);
            return res.sendStatus(204);
        }
    } catch (error) {
        return res.status(500).send(`Error: ${error}`);
    }
});

// Update Movie - add subscriber
router.put("/addSubscriber/:movieId/:subscriberId", async (req, res) => {
    try {
        const movieId = req.params.movieId;
        const subscriberId = req.params.subscriberId;
        await updateMovie(movieId, { $addToSet: { subscribers: subscriberId } });
        return res.sendStatus(204);
    } catch (error) {
        return res.status(500).send(`Error: ${error}`);
    }
});

// Update Movie - delete subscriber
router.put("/deleteSubscriber/:movieId/:subscriberId", async (req, res) => {
    try {
        const movieId = req.params.movieId;
        const subscriberId = req.params.subscriberId;
        await updateMovie(movieId, { $pull: { subscribers: subscriberId } });
        return res.sendStatus(204);
    } catch (error) {
        return res.status(500).send(`Error: ${error}`);
    }
});

// Delete Movie
router.delete("/:id", async (req, res) => {
    try {
        const movieId = req.params.id;
        await deleteMovie(movieId);
        return res.sendStatus(204);
    } catch (error) {
        return res.status(500).send(`Error: ${error}`);
    }
});

module.exports = router;
