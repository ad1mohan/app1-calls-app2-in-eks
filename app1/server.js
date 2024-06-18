const express = require('express');
const axios = require('axios');
const app = express();
const port = 8080;

const APP2_IP = process.env.APP2_IP || 'localhost';
const APP2_PORT = process.env.APP2_PORT || 80;

app.get('/', async (req, res) => {
  try {
    const response = await axios.get(`http://${APP2_IP}:${APP2_PORT}`);
    res.send(`Response from App2: ${response.data}`);
  } catch (error) {
    res.status(500).send('Error communicating with App2');
  }
});

app.listen(port, () => {
  console.log(`App1 listening on port ${port}`);
});
