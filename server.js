require('dotenv').config();
require('./lib/utils/connect')();
const PORT = process.env.PORT || 7890;

require('./lib/app').listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Started on ${PORT}`);
});
