const mongoose = require("mongoose");

// Define the schema for the permissions collection
const PermissionSchema = new mongoose.Schema({
    watchSubs: {
        type: Boolean,
        required: true,
    },
    createSubs: {
        type: Boolean,
        required: true,
    },
    updateSubs: {
        type: Boolean,
        required: true,
    },
    deleteSubs: {
        type: Boolean,
        required: true,
    },
    watchMovies: {
        type: Boolean,
        required: true,
    },
    createMovies: {
        type: Boolean,
        required: true,
    },
    updateMovies: {
        type: Boolean,
        required: true,
    },
    deleteMovies: {
        type: Boolean,
        required: true,
    },
});

const WorkerSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdDate: {
        type: Date,
        required: true,
    },
    permission: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Permission",
    },
});

// Create models for both collections
const Permission = mongoose.model("Permission", PermissionSchema);
const Worker = mongoose.model("Worker", WorkerSchema);

module.exports = {
    Permission,
    Worker,
};
