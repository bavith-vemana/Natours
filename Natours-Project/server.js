const { app } = require('./app');
const mongoose = require('mongoose');
require('dotenv').config({ path: `${__dirname}/config.env` });

const port = process.env.PORT || 3000;
let DBUrl = process.env.DATABASE_URL;
DBUrl = DBUrl.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

//Connecting Mongo DB
mongoose
  .connect(DBUrl)
  .then((con) => {
    console.log('Connected');
  })
  .catch((err) => console.log('Error : ', err));

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
