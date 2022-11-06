const express = require("express");
const mongoose = require("mongoose");
const app = express();
const router = require("./routers/router");
const cors = require("cors")
// const bodyParser = require("body-parser")

app.use(cors())
app.use(router)
app.use(express.json());
// app.use(bodyParser())

mongoose.connect("mongodb://localhost/todoapp",()=>{
    console.log("Database Connected")
},e=>console.log(e))


app.listen(8080,()=>{
    console.log("Server is listening at Port 8080");
})