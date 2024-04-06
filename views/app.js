const express = require('express');
const authRoutes = require('../routes/authRoutes')

const app = express();

app.set('view engine', 'ejs')

app.listen(3000)

app.use(express.static('public'))


app.use(authRoutes)