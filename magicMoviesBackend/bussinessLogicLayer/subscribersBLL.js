const { Movie, Subscriber } = require("../models/movie_and_subscriberModel");

// Get Movie by ID
const getSubscriber = (subscriberId) => {
    return new Promise((resolve, reject) => {
        // Find the subscriber document by its ID and populate its movies field
        Subscriber.findOne({ _id: subscriberId })
            .populate("movies")
            .exec((err, subscriber) => {
                if (err) {
                    reject(err);
                } else if (!subscriber) {
                    reject(new Error(`subscriber with ID ${subscriberId} not found`));
                } else {
                    resolve(subscriber);
                }
            });
    });
};

// Check if subscriber exist
const checkSubscriber = (subscriberEmail) => {
    return new Promise((resolve, reject) => {
        Subscriber.findOne({ email: subscriberEmail })
            .populate("movies")
            .exec((err, subscriber) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(subscriber);
                }
            });
    });
};

// Get all subscribers
const getSubscribers = () => {
    return new Promise((resolve, reject) => {
        // Find all Subscriber documents and populate their movies fields
        Subscriber.find({})
            .populate("movies")
            .exec((err, subscribers) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(subscribers);
                }
            });
    });
};

// Create new Subscriber
const createSubscriber = (fullName, email, city, createdDate, movieIds) => {
    return new Promise((resolve, reject) => {
        const subscriber = new Subscriber({
            fullName,
            email,
            city,
            createdDate,
            movies: movieIds,
        });
        subscriber.save((err, savedSubscriber) => {
            if (err) {
                reject(err);
            } else {
                resolve(savedSubscriber);
            }
        });
    });
};

// Update Subscriber by ID
const updateSubscriber = (subscriberId, updatedSubscriber) => {
    return new Promise((resolve, reject) => {
        Subscriber.findByIdAndUpdate(
            subscriberId,
            updatedSubscriber,
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

// Delete Subscriber by ID, and delete his id from all associated movies
const deleteSubscriber = (subscriberId) => {
    return new Promise((resolve, reject) => {
        Subscriber.findByIdAndDelete(subscriberId, (err, deletedDoc) => {
            if (err) {
                reject(err);
            } else {
                // Remove the subscriber ID from all the associated movies
                const movieIds = deletedDoc.movies.map((movie) => movie._id);
                Movie.updateMany(
                    { _id: { $in: movieIds } },
                    { $pull: { subscribers: subscriberId } },
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
    getSubscriber,
    checkSubscriber,
    getSubscribers,
    createSubscriber,
    updateSubscriber,
    deleteSubscriber,
};
