const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
    Activity: { type: String, require: true },
    status: { type: String, require: true, default: "pending" },
    timeTaken: { type: String, require: true, default: "" },
    userid: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
})

const task = mongoose.model("tasks", taskSchema);

module.exports = task;