const { response, request } = require('express')

const Pool = require('pg').Pool
const db = new Pool({
  host: 'localhost',
  database: 'ThePurpleHouse-DB',
  user: 'postgres',
  password: '123',
  port: 5432
})

const registerUser = (request, response) => {
  try {
    const { fullName, email, phoneNumber, birthDate, password } = request.body
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
    const { idPerson, idService, fullNameWorker, descriptionService, priceService, city, localization, whatsapp } = request.body
    console.log('valores registerWorker:', { idPerson, idService, fullNameWorker, descriptionService, priceService, city, localization, whatsapp });

    db.query('INSERT INTO worker ( idPerson, idService, fullNameWorker, descriptionService, priceService, city, localization, whatsapp ) values ($1, $2, $3, $4, $5, $6, $7, $8)',
      [idPerson, idService, fullNameWorker, descriptionService, priceService, city, localization, whatsapp], (error, results) => {
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
  db.query(`SELECT * FROM worker
            INNER JOIN person
            on person.idperson = worker.idperson`,
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
  try {
    const idPerson = parseInt(request.params.id)
    const { email, password } = request.body
    console.log('valores updateUser: ', { email, password})

    db.query('UPDATE person SET email = $1, pass = $2 WHERE idperson = $3',
      [email, password, idPerson],
      (error, results) => {
        if (error) {
          throw error
        }
        response.status(201).send('Usuario atualizado')
      })
  } catch (error) {
    console.log('Erro: ' + error);
    response.status(400).send({
      status: 400,
      message: 'Erro ao atualizar o registro. ' + error
    })
  }
}

const deleteUser = (request, response) => {
  try {
    const idPerson = parseInt(request.params.id)

    if (!isNaN(idPerson)) {
      db.query('delete from person where idperson = $1', [idPerson],
        (error, results) => {
          if (error) {
            throw error
          } response.status(201).send('Usuário deletado')
        })

    } else {
      throw Error('Erro ao deletar o usuário. ID não existe')

    }
  } catch (error) {
    console.log(error);
    response.status(400).send({
      status: 400,
      message: 'Erro ao deletar o usuário.' + error
    })
  }
}

const getServicesFromUser = (request, response) => {
  const idperson = parseInt(request.params.id)
  console.log('request.params', request.params);
  console.log('getServicesFromUser', idperson, request);
  db.query(`SELECT 
              worker.idworker,
              titleservice
            FROM worker
            INNER JOIN person
            ON worker.idperson = person.idperson
            INNER JOIN service
            ON service.idservice = worker.idservice
            WHERE worker.idperson = $1`,
    [idperson], (error, results) => {
      console.log('results', results);
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
}

const workersByCategory = (request, response) => {
  try {
    const id = parseInt(request.params.id)
    db.query(`SELECT 
                idworker, 
                worker.idService,
                fullname
                FROM worker
                INNER JOIN
                service
                ON service.idService = worker.idService
                INNER JOIN person
                ON worker.idperson = person.idperson
                WHERE worker.idService = $1`,
      [id], (error, results) => {
        console.log('Error', error);
        response.status(201).send(results.rows)
      }
    )
  } catch (error) {
    console.log('Erro: ' + error);
    response.status(400).send({
      status: 400,
      message: 'Error' + error
    })
  }
}

const registerReview = (request, response) => {
  try {
    const { idPerson, idWorker, messageReview, stars } = request.body
    console.log('valores registerWorker:', { idPerson, idWorker, messageReview, stars });

    db.query('INSERT INTO review ( idPerson, idWorker, messageReview, stars ) values ($1, $2, $3, $4)',
      [idPerson, idWorker, messageReview, stars], (error, results) => {
        console.log('Error', error);
        response.status(201).send('Avaliação feita :))))))')
      }
    )
  } catch (error) {
    console.log('Erro: ' + error);
    response.status(500).send({
      status: 500,
      message: 'Erro ao adicionar avaliação. ' + error
    })
  }
}

const getWorkersReviewed = (request, response) => {
  const idperson = parseInt(request.params.id)
  db.query(`SELECT
              worker.fullnameWorker,
              service.titleService,
              review.stars,
              review.messageReview
              from review
            INNER JOIN person
            ON person.idperson = review.idperson
            INNER JOIN worker
            ON worker.idworker = review.idworker
            INNER JOIN service
            ON worker.idservice = service.idservice
            WHERE
            person.idperson = $1`,
    [idperson], (error, results) => {
      console.log('results', results);
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
}

module.exports = {
  registerUser,
  authenticate,
  registerWorker,
  getServices,
  getWorkers,
  getWorkerById,
  deleteWorkerService,
  updateUser,
  getServicesFromUser,
  workersByCategory,
  registerReview,
  deleteUser,
  getWorkersReviewed
}