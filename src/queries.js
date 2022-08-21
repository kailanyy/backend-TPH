const { response, request } = require('express')

const Pool = require('pg').Pool
const db = new Pool({
  host: 'localhost',
  database: 'ThePurpleHouse-DB',
  user: 'postgres',
  password: 'senai',
  port: 5432
})

const registerUser = (request, response) => {
  try {
    const { fullName, email, phoneNumber, birthDate, password } = request.body
    console.log('valores registerUser:', { fullName, email, phoneNumber, birthDate, password });

    db.query('INSERT INTO person ( fullName, email, phoneNumber, birthDate, pass ) values ($1, $2, $3, $4, $5)',
      [fullName, email, phoneNumber, birthDate, password], (error, results) => {
        console.log('error', error);
        console.log('response', response);
        response.status(201).send('Usuário adicionado')
      }
    )
  } catch (error) {
    console.log('Erro: ' + error);
    response.status(400).send({
      status: 400,
      message: 'Erro ao adicionar usuário. ' + error
    })
  }
}

const authenticate = (request, response) => {
  try {
    const { email, password } = request.body
    console.log('valores authenticate:', { email, password });

    db.query('SELECT * FROM person WHERE email = $1 AND pass = $2',
      [email, password], (error, results) => {
        console.log('error:', error, 'results:', results);
        if (error || results.rowCount === 0) {
          return response.status(401).send({
            status: 401,
            message: 'Erro ao autenticar o usuário. ' + error
          })
        } response.status(200).send({ user: results.rows[0] })
      })
  } catch (error) {
    console.log('Erro @ authenticate: ' + error);
    response.status(500).send({
      status: 500,
      message: 'Erro ao autenticar o usuário. ' + error
    })
  }
}

const registerWorker = (request, response) => {
  try {
    const { idPerson, idService, descriptionService, priceService, city, localization, whatsapp } = request.body
    console.log('valores registerWorker:', { idPerson, idService, descriptionService, priceService, city, localization, whatsapp });

    db.query('INSERT INTO worker ( idPerson, idService, descriptionService, priceService, city, localization, whatsapp ) values ($1, $2, $3, $4, $5, $6, $7)',
      [idPerson, idService, descriptionService, priceService, city, localization, whatsapp], (error, results) => {
        console.log('Error', error);
        response.status(201).send('Trabalhador adicionado')
      }
    )
  } catch (error) {
    console.log('Erro: ' + error);
    response.status(500).send({
      status: 500,
      message: 'Erro ao adicionar trabalhador. ' + error
    })
  }
}

const getServices = (request, response) => {
  console.log('getServices');
  db.query('SELECT * FROM service',
    (error, results) => {
      console.log('results', results);
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
}

const getWorkers = (request, response) => {
  db.query('SELECT * FROM worker',
    (error, results) => {
      console.log('results', results);
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
}

const getWorkerById = (request, response) => {
  const id = parseInt(request.params.id)

  db.query('select * from worker where idperson = $1',
    [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
}

const deleteWorkerService = (request, response) => {
  try {
    const idPerson = parseInt(request.params.id)
    const { idService } = request.body
    console.log('valores deleteWorkerService:', { idPerson, idService });
    console.log('request body', request.body)

    db.query('DELETE FROM worker WHERE idPerson = $1 and idService = $2',
      [idPerson, idService], (error, results) => {
        console.log('Error', error);
        response.status(201).send('Serviço removido com sucesso!')
      }
    )
  } catch (error) {
    console.log('Erro: ' + error);
    response.status(400).send({
      status: 400,
      message: 'Erro ao remover serviço. ' + error
    })
  }
}

const updateUser = (request, response) => {
 try{
  const idPerson = parseInt(request.params.id)
  const {email, password, phoneNumber} = request.body
  console.log('valores updateUser: ', {email, password, phoneNumber})

  db.query('UPDATE person SET email = $1, pass = $2, phoneNumber =  $3 WHERE idperson = $4',
  [email, password, phoneNumber, idPerson],
  (error, results) => {
    if (error) {
        throw error
    }
  response.status(201).send('Usuario atualizado')
  })
 } catch  (error) {
  console.log('Erro: ' + error);
  response.status(400).send({
    status: 400,
    message: 'Erro ao atualizar o registro. ' + error
  })
}
}


module.exports = {
  registerUser,
  authenticate,
  registerWorker,
  getServices,
  getWorkers,
  getWorkerById,
  deleteWorkerService,
  updateUser
}