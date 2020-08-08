const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION ! Shuting down server and app');
  if (process.env.NODE_ENV === 'development') {
    console.log(err);
  } else {
    console.log(err.name, err.message);
  }

  process.exit(1);
});

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB is succesfully connected!!');
  });

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`Server is running at port ${port}.......`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION ! Shuting down server and app');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
