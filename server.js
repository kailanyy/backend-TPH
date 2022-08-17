const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const routes = require('./src/queries')
const cors = require('cors');
const fs = require('fs');

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json({ limit: '15MB' }))

app.get('/', (request, response) => {
  response.json({ info: 'API REST running with success' })
});

app.post('/', (request, response) => {
  fs.writeFile('./out.png', request.body.imgsource, 'base64', (error) => {
    if (error) throw error
  })
  request.status(200)
})

app.post('/registerUser', routes.registerUser)

app.listen(3001, () => {
  console.log("API REST rodando em http://localhost:3001")
})