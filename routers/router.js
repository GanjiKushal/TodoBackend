const express = require("express");
const router = express.Router();
const user = require("../models/user")
const task = require("../models/task")
const jwt = require('jsonwebtoken');
router.use(express.json())
const bcrypt = require('bcrypt');
const authentication = require("../Athentication/auth")
router.get("/", (req, res) => {
    res.send("hello from router")
})
router.post("/register", async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const data = await user.findOne({ email });
        if (data) {
            res.send({ message: "user is allready exist" })
            return
        }
        else {
            bcrypt.hash(password, 10, async function (err, hash) {
                if (err) {
                    res.send(err.message)
                    return
                }
                const newUser = await user.create({
                    email,
                    password: hash,
                    name
                })
            });
            res.send({ message: "success" });
        }
    } catch (err) {
        res.send(err.message);
    }
})
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const data = await user.findOne({ email });
        // console.log(req.body)
        // console.log(data)
        if (!data) {
            res.send({ message: "user not registered" })
            return;
        }
        else {
            bcrypt.compare(password, data.password, function (err, result) {
                // result == false
                if (err) {
                    res.send(err.message)
                }
                if (result) {
                    const token = jwt.sign({
                        exp: Math.floor(Date.now() / 1000) + (60 * 60),
                        data: data._id
                    }, 'secret');
                    res.send({ message: "success", token })
                }
                else {
                    res.send({ message: "wrong password" })
                }
            });
        }
    } catch (err) {
        res.send(err.message);
    }
})
router.post("/todoList", authentication, async (req, res) => {
    const { activity } = req.body;
    const data = await task.create({
        Activity: activity,
        userid: req.user
    })
    res.send({ message: "success" })
})
router.get("/todoList", authentication, async (req, res) => {
    const userId = req.user;
    const data = await task.find({ userid: userId })
    if (data.length == 0) {
        res.send({ message: "not any task" })
    }
    else {
        res.send({ message: "success", data })
    }
})
router.get("/getUser", authentication, async (req, res) => {
    const data = await user.findOne({ _id: req.user })
    res.send({ "user": data.name })
})
router.patch("/endTask", authentication, async (req, res) => {
    try {
        const { activity, time } = req.body;
        const data = await task.updateOne({ $and: [{ userid: req.user }, { Activity: activity }] }, { status: "completed" });
        const timeUpdate = await task.updateOne({ $and: [{ userid: req.user }, { Activity: activity }] }, { timeTaken:time });
        if (data) {
            res.send({ message: "success" })
        }
    } catch (error) {
        console.log(error.message)
    }
})
router.get("/getCompletedTasks", authentication, async (req, res) => {
    try {
        const data = await task.find({ $and: [{ userid: req.user }, { status: "completed" }] })
        if (data) {
            res.send({ message: "success", data });
        }
    } catch (error) {
        console.log(error.message)
    }
})
module.exports = router






