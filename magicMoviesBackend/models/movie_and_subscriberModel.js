const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema({
  name: { type: String, required: true },
  premiered: { type: Date, required: true },
  genres: { type: String, required: true },
  image: { type: String, required: true },
  subscribers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subscriber" }],
});

const SubscriberSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  city: { type: String, required: true },
  createdDate: { type: Date, required: true },
  movies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
});

const Movie = mongoose.model("Movie", MovieSchema);
const Subscriber = mongoose.model("Subscriber", SubscriberSchema);

module.exports = { Movie, Subscriber };
