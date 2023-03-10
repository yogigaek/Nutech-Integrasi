require('./config/database');
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const logger = require('morgan');
const productRoutes = require('./router/product');
const userRoutes = require('./router/user');
const BodyParser = require('body-parser');

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(`/auth`, userRoutes);
app.use(`/api`, productRoutes);

app.use(logger('dev'));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}...`);
});