require('dotenv').config();
const connectDB = require('./config/db');

async function test() {
  await connectDB();
  console.log('Test script finished');
  process.exit(0);
}
test();
