const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
require('dotenv').config();

const app = express();

// cors
const cors = require('cors');
var corsOptions = {
    origin: '*', // Reemplazar con dominio
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

// import routes
const authRoutes = require('./routes/auth');
const validateToken = require('./middleware/validateToken');
const dashboardRoutes = require('./routes/dashboard');

// route middlewares
app.use('/api/user', authRoutes);
app.use('/api/dashboard', validateToken, dashboardRoutes);

app.get('/', (req, res) => {
    res.json({
        estado: true,
        mensaje: 'Mercury'
    })
});

// Conexión a Base de datos
const uri = `mongodb://${process.env.USER}:${process.env.PASSWORD}@cluster0-shard-00-00.06ye9.mongodb.net:27017,cluster0-shard-00-01.06ye9.mongodb.net:27017,cluster0-shard-00-02.06ye9.mongodb.net:27017/${process.env.DBNAME}?ssl=true&replicaSet=atlas-ygi9nb-shard-0&authSource=admin&retryWrites=true&w=majority`;
const option = { useNewUrlParser: true, useUnifiedTopology: true };
mongoose.connect(uri, option)
.then(() => console.log('Base de datos conectada'))
.catch(e => console.log('error db:', e))

// iniciar server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`servidor andando en: ${PORT}`)
})