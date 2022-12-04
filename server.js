const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const routes = require('./src/queries')
const cors = require('cors');
const fs = require('fs');
const { verify } = require('crypto');
const PORT = 3001

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

app.put('/users/email/:id', routes.updateEmail)
app.put('/users/birthdate/:id', routes.updateBirthDate)
app.put('/users/pass/:id', routes.updatePassword)
app.put('/updateworker/:id', routes.updateProfileWorker)
app.put('/chats/cancel/:id', routes.cancelService)
app.put('/chats/close/:id', routes.closeService)
app.put('/chats/denounce/:id', routes.denounceService)

app.post('/registerUser', routes.registerUser)
app.post('/registerWorker', routes.registerWorker)
app.post('/login', routes.authenticate)
app.post('/reviews', routes.registerReview)
app.post('/chats', routes.createChat)
app.post('/messages', routes.sendMessage)
app.post('/postImage', routes.postImage)
app.post('/denounce', routes.createDenounce)
app.post('/profileImage', routes.profileImage)

app.get('/services', routes.getServices)
app.get('/workers', routes.getWorkers)
app.get('/workers/:id', routes.getWorkerByIdPerson)
app.get('/updateworker/:id', routes.getWorkerById)
app.get('/getServicesFromUser/:id', routes.getServicesFromUser)
app.get('/workersByCategory/:id', routes.workersByCategory)
app.get('/servicesReviewed/:id', routes.getServicesReviewed)
app.get('/denounce/:id', routes.getServicesDenounced)
app.get('/reviewsByWorker/:id', routes.getReviewsByWorker)
app.get('/averageRatingByWorker/:id', routes.getAverageRating)
app.get('/chats/:id', routes.getChatsByLoggedUser)
app.get('/messages/:id', routes.getMessages)
app.get('/getImageWorker/:id', routes.getImageWorker)
app.get('/chats/:id/:id2', routes.getIfChatExists)
app.get('/complaintsByWorker/:id', routes.getComplaintsByWorker)
app.get('/requestedServicesByUser/:id', routes.getRequestedServicesByUser)
app.get('/requestedServicesForUser/:id', routes.getRequestedServicesForUser)
app.get('/updateUser/:id', routes.updateUser)

app.delete('/workers/:id', routes.deleteWorkerService)
app.delete('/users/:id', routes.deleteUser)
app.delete('/reviews/:id', routes.deleteReview)
app.delete('/denounce/:id', routes.deleteDenounce)
app.delete('/deleteCarouselImage/:id', routes.deleteCarouselImage)

app.listen(process.env.PORT || PORT, () => {
  console.log("API REST rodando em " + PORT)
})