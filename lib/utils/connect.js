const mongoose = require('mongoose');
const { parse } = require('url');

module.exports = (url = process.env.MONGODB_URI) => {
  mongoose.connect(url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  });

  mongoose.connection.on('connected', () => {
    const parsedUrl = parse(url);
    const redactedUrl = `${parsedUrl.protocol}//${parsedUrl.hostname}:${parsedUrl.port}${parsedUrl.pathname}`;
    // eslint-disable-next-line no-console
    console.log(`Connected to MongoDB at ${redactedUrl}`);
  });

  mongoose.connection.on('disconnected', () => {
    // eslint-disable-next-line no-console
    console.log('Disconnected from MongoDB');
  });

  mongoose.connection.on('error', () => {
    // eslint-disable-next-line no-console
    console.log('Error connecting to MongoDB');
  });
};
