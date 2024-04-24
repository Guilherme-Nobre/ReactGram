require("dotenv").config()

const express = require("express"); // O require está carregando o modulo express do Node.js
const path = require("path"); // O require está carregando o modulo path do Node.js
const cors = require("cors"); // O require está carregando o modulo cors do Node.js

const port = process.env.PORT;

const app = express();

// config JSON and form data response
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Solve CORS
app.use(cors({credentials: true, origin: "http://localhost:3000"}));

// Upload directory
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// DB Connection
require("./config/db.js")

// routes
const router = require("./routes/Router.js");

app.use(router);

app.listen(port, () => {
    console.log(`App rodando da porta ${port}`);
});