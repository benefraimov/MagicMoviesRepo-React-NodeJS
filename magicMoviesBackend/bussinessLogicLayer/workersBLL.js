const { Worker, Permission } = require("../models/workerModel");

// Get Worker by ID
const getWorker = (workerId) => {
    return new Promise((resolve, reject) => {
        // Find the worker document by its ID and populate its permission field
        Worker.findOne({ _id: workerId })
            .populate("permission")
            .exec((err, worker) => {
                if (err) {
                    reject(err);
                } else if (!worker) {
                    reject(new Error(`worker with ID ${workerId} not found`));
                } else {
                    resolve(worker);
                }
            });
    });
};

// Check if worker exist
const checkWorker = (username) => {
    return new Promise((resolve, reject) => {
        Worker.findOne({ userName: username })
            .populate("permission")
            .exec((err, worker) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(worker);
                }
            });
    });
};

// Get all workers
const getWorkers = () => {
    return new Promise((resolve, reject) => {
        // Find all Worker documents and populate their permission fields
        Worker.find({})
            .populate("permission")
            .exec((err, workers) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(workers);
                }
            });
    });
};

// Create new Worker
const createWorker = (worker) => {
    return new Promise((resolve, reject) => {
        // Create a new permission document with the provided boolean values
        const permissionObject = new Permission(worker.permission);
        // Save the new permission document to the database
        permissionObject.save((err, savedPermission) => {
            if (err) {
                reject(err);
            } else {
                // Create a new Worker document with the provided fields and the newly created permission document
                const workerObject = new Worker({
                    fullName: worker.fullName,
                    isAdmin: worker.isAdmin,
                    userName: worker.userName,
                    password: worker.password,
                    createdDate: worker.createdDate,
                    permission: savedPermission._id,
                });
                // Save the new worker document to the database
                workerObject.save((err, savedWorker) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(savedWorker);
                    }
                });
            }
        });
    });
};

// Update Worker by ID
const updateWorker = (workerId, workerObject) => {
    return new Promise((resolve, reject) => {
        // Find the worker document by its ID and populate its permission field
        Worker.findOne({ _id: workerId })
            .populate("permission")
            .exec((err, worker) => {
                if (err) {
                    reject(err);
                } else if (!worker) {
                    reject(new Error(`worker with ID ${workerId} not found`));
                } else {
                    // Update the worker document with the provided fields
                    worker.fullName = workerObject.fullName;
                    worker.isAdmin = workerObject.isAdmin;
                    worker.userName = workerObject.userName;
                    worker.password = workerObject.password;
                    worker.createdDate = workerObject.createdDate;

                    // Retrieve the permission document from the worker document
                    const permission = worker.permission;

                    // Update the permission document with the provided boolean values
                    permission.watchSubs = workerObject.permission.watchSubs;
                    permission.createSubs = workerObject.permission.createSubs;
                    permission.updateSubs = workerObject.permission.updateSubs;
                    permission.deleteSubs = workerObject.permission.deleteSubs;
                    permission.watchMovies = workerObject.permission.watchMovies;
                    permission.createMovies = workerObject.permission.createMovies;
                    permission.updateMovies = workerObject.permission.updateMovies;
                    permission.deleteMovies = workerObject.permission.deleteMovies;

                    // Save the permission document
                    permission.save((err, savedPermission) => {
                        if (err) {
                            reject(err);
                        } else {
                            // Update the worker document with the new permission document
                            worker.permission = savedPermission._id;

                            // Save the updated worker document to the database
                            worker.save((err, savedWorker) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve(savedWorker);
                                }
                            });
                        }
                    });
                }
            });
    });
};

// Delete Worker by ID
const deleteWorker = (workerId) => {
    return new Promise((resolve, reject) => {
        Worker.findByIdAndDelete(workerId, (err, deletedWorker) => {
            if (err) {
                reject(err);
            } else if (!deletedWorker) {
                reject(new Error(`Worker with ID ${workerId} not found`));
            } else {
                // Delete the related permission document
                Permission.findByIdAndDelete(deletedWorker.permission, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(deletedWorker);
                    }
                });
            }
        });
    });
};

module.exports = {
    getWorker,
    checkWorker,
    getWorkers,
    createWorker,
    updateWorker,
    deleteWorker,
};
