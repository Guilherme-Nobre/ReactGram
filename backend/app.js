const express = require("express"); // O require está carregando o modulo express do Node.js
const path = require("path"); // O require está carregando o modulo path do Node.js
const cors = require("cors"); // O require está carregando o modulo cors do Node.js

const port = 5000;

const app = express();

// config JSON and form data response
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(port, () => {
    console.log(`App rodando da porta ${port}`);
});