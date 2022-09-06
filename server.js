const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const routes = require('./src/queries')
const cors = require('cors');
const fs = require('fs');
const { verify } = require('crypto');

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

app.put('/users/:id', routes.updateUser)

app.post('/registerUser', routes.registerUser)
app.post('/registerWorker', routes.registerWorker)
app.post('/login', routes.authenticate)
app.post('/reviews', routes.registerReview)

app.get('/services', routes.getServices)
app.get('/workers', routes.getWorkers)
app.get('/workers/:id', routes.getWorkerById)
app.get('/getServicesFromUser/:id', routes.getServicesFromUser)
app.get('/workersByCategory/:id', routes.workersByCategory)
app.get('/servicesReviewed/:id', routes.getServicesReviewed)
app.get('/personEmails', routes.getEmail)
app.get('/reviewsByWorker/:id', routes.getReviewsByWorker)
app.get('/averageRatingByWorker/:id', routes.getAverageRating)
app.get('/locationWorkers', routes.getLocationWorkers)

app.delete('/workers/:id', routes.deleteWorkerService)
app.delete('/users/:id', routes.deleteUser)
app.delete('/reviews/:id', routes.deleteReview)

app.listen(3001, () => {
  console.log("API REST rodando em http://localhost:3001")
})