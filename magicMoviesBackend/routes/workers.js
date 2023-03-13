const {
    getWorker,
    getWorkers,
    createWorker,
    updateWorker,
    deleteWorker,
    checkWorker,
} = require("../bussinessLogicLayer/workersBLL");
const router = require("express").Router();

const crypto = require("crypto");
const bcrypt = require("bcrypt");

// Generate a random salt value for use in hashing
const saltRounds = 10; // Choose a value appropriate for your use case
const salt = bcrypt.genSaltSync(saltRounds);

function encryptPassword(password) {
    // Hash the password using bcrypt
    const plainTextPassword = password;
    const hashedPassword = bcrypt.hashSync(plainTextPassword, salt);
    return hashedPassword;
}

function decryptPassword(password, hashedPassword) {
    // To check a password, retrieve the salt and hashed password from the database
    // and compare the hash of the input password with the stored hash
    const inputPassword = password;
    const isMatch = bcrypt.compareSync(inputPassword, hashedPassword);
    console.log("isMatch: ", isMatch);
    return isMatch;
}

// Get Worker by ID
router.post("/getWorker/:id", async (req, res) => {
    try {
        const workerId = req.params.id;
        const worker = await getWorker(workerId);
        return res.status(200).send(worker);
    } catch (error) {
        return res.status(500).send(`Error: ${error}`);
    }
});

// Get Worker by ID
router.post("/loginWorker", async (req, res) => {
    try {
        const workerBody = req.body;
        const workerExist = await checkWorker(workerBody.userName);
        // console.log(workerExist, workerBody);
        if (decryptPassword(workerBody.password, workerExist.password)) {
            return res.status(200).send({
                message: "success",
                body: workerExist,
            });
        } else {
            return res.status(200).send({
                message: "failed",
                body: "",
            });
        }
    } catch (error) {
        return res.status(500).send(`Error: ${error}`);
    }
});

// Get all workers
router.post("/getWorkers", async (req, res) => {
    try {
        const workers = await getWorkers();
        workers.map((worker) => (worker.password = "******"));
        return res.status(200).send(workers);
    } catch (error) {
        return res.status(500).send(`Error: ${error}`);
    }
});

// Create new Worker
router.post("/newWorker", async (req, res) => {
    try {
        const workerBody = req.body;
        // get all worker data to check if the user already exist in the system
        const workers = await getWorkers();
        const workerFound = workers.filter(
            (worker) =>
                worker.userName.toLowerCase() === workerBody.userName.toLowerCase()
        );
        if (workerFound.length > 0) {
            return res.sendStatus(405);
        } else {
            workerBody.password = encryptPassword(workerBody.password);
            const data = await createWorker(workerBody);
            return res.status(201).send({ message: "success", data });
        }
    } catch (error) {
        return res.status(500).send(`Error: ${error}`);
    }
});

// Update Worker
router.put("/:id", async (req, res) => {
    try {
        const workerId = req.params.id;
        const workerBody = req.body;

        // get all worker data to check if the user already exist in the system
        const workers = await getWorkers();
        const workerFound = workers.filter(
            (worker) =>
                worker._id.toString() !== workerId.toString() &&
                worker.userName.toLowerCase() === workerBody.userName.toLowerCase()
        );
        if (workerFound.length > 0) {
            return res.sendStatus(405);
        } else {
            if (workerBody.changePass) {
                workerBody.password = encryptPassword(workerBody.password);
            }
            await updateWorker(workerId, workerBody);
            return res.sendStatus(204);
        }
    } catch (error) {
        return res.status(500).send(`Error: ${error}`);
    }
});

// Delete Worker
router.delete("/:id", async (req, res) => {
    try {
        const workerId = req.params.id;
        await deleteWorker(workerId);
        return res.sendStatus(204);
    } catch (error) {
        return res.status(500).send(`Error: ${error}`);
    }
});

module.exports = router;
