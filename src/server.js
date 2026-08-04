const app = require('./app');
const env = require('./config/env');

const port = env.port;
app.listen(port, () => {
  console.log(`QA Review AI listening on port ${port}`);
});
