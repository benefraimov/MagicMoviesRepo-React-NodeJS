const router = require("express").Router();
const {
    getSubscriber,
    getSubscribers,
    createSubscriber,
    deleteSubscriber,
    updateSubscriber,
} = require("../bussinessLogicLayer/subscribersBLL");

// Get Subscriber by ID
router.post("/getSubscriber/:id", async (req, res) => {
    try {
        const SubscriberId = req.params.id;
        const subscriber = await getSubscriber(SubscriberId);
        return res.status(200).send(subscriber);
    } catch (error) {
        return res.status(500).send(`Error: ${error}`);
    }
});

// Get all Subscribers
router.post("/getSubscribers", async (req, res) => {
    try {
        const subscribers = await getSubscribers();
        return res.status(200).send(subscribers);
    } catch (error) {
        return res.status(500).send(`Error: ${error}`);
    }
});

// Create new Subscriber
router.post("/newSubscriber", async (req, res) => {
    try {
        const subscriberBody = req.body;
        // get all subscribers data to check if the subscriber email already exist in the system
        const subscribers = await getSubscribers();
        const subscriberFound = subscribers.filter(
            (subscriber) =>
                subscriber.email.toLowerCase() === subscriberBody.email.toLowerCase()
        );
        if (subscriberFound.length > 0) {
            return res.status(405).send({ message: "failed" });
        } else {
            const data = await createSubscriber(
                subscriberBody.fullName,
                subscriberBody.email,
                subscriberBody.city,
                subscriberBody.createdDate,
                subscriberBody.movieIds
            );
            return res.status(201).send({ message: "success", data });
        }
    } catch (error) {
        return res.status(500).send(`Error: ${error}`);
    }
});

// Update Subscriber
router.put("/:id", async (req, res) => {
    try {
        const subscriberId = req.params.id;
        const subscriberBody = req.body;
        // get all subscribers data to check if the subscriber email already exist in the system
        const subscribers = await getSubscribers();
        const subscriberFound = subscribers.filter(
            (subscriber) =>
                subscriber.email.toLowerCase() === subscriberBody.email.toLowerCase()
        );
        if (
            subscriberFound.length > 0 &&
            subscriberFound[0]._id.toString() !== subscriberId.toString()
        ) {
            return res.sendStatus(409);
        } else {
            await updateSubscriber(subscriberId, subscriberBody);
            return res.sendStatus(204);
        }
    } catch (error) {
        return res.status(500).send(`Error: ${error}`);
    }
});

// Update Subscriber - add movie
router.put("/addMovie/:subscriberId/:movieId", async (req, res) => {
    try {
        const subscriberId = req.params.subscriberId;
        const movieId = req.params.movieId;
        await updateSubscriber(subscriberId, { $addToSet: { movies: movieId } });
        return res.sendStatus(204);
    } catch (error) {
        return res.status(500).send(`Error: ${error}`);
    }
});

// Update Subscriber - delete movie
router.put("/deleteMovie/:subscriberId/:movieId", async (req, res) => {
    try {
        const subscriberId = req.params.subscriberId;
        const movieId = req.params.movieId;
        await updateSubscriber(subscriberId, { $pull: { movies: movieId } });
        return res.sendStatus(204);
    } catch (error) {
        return res.status(500).send(`Error: ${error}`);
    }
});

// Delete Subscriber
router.delete("/:id", async (req, res) => {
    try {
        const subscriberId = req.params.id;
        await deleteSubscriber(subscriberId);
        return res.sendStatus(204);
    } catch (error) {
        return res.status(500).send(`Error: ${error}`);
    }
});

module.exports = router;
