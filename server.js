const dotenv = require('dotenv');
const port = process.env.PORT || 3000;
const localHost = '127.0.0.1';
const { default: mongoose } = require('mongoose');

dotenv.config({ path: './config.env' });

const app = require('./app');
const db = process.env.DATABASE.replace('<password>', process.env.PASSWORD);

mongoose
  .connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connection successful!');
  });
app.listen(port, localHost, () => {
  console.log(`Server is up on http://${localHost}:${port} `);
});
