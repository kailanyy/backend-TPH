const { response, request } = require('express')

const Pool = require('pg').Pool
const db = new Pool({
  host: 'localhost',
  database: 'ThePurpleHouse-DB',
  user: 'postgres',
  password: 'yasmin',
  port: 5432
})

const registerUser = (request, response) => {
  try {
    const { firstName, lastName, email, birthDate, password } = request.body
    db.query('INSERT INTO person ( firstName, lastName, email, birthDate, pass ) values ($1, $2, $3, $4, $5)',
      [firstName, lastName, email, birthDate, password], (error, results) => {
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
    const { idPerson, idService, firstNameWorker, lastNameWorker, descriptionService, phoneNumber, priceService, city, localization, whatsapp } = request.body
    console.log('valores registerWorker:', { idPerson, idService, firstNameWorker, lastNameWorker, descriptionService, phoneNumber, priceService, city, localization, whatsapp });

    db.query('INSERT INTO worker ( idPerson, idService, firstNameWorker, lastNameWorker, descriptionService, phoneNumber, priceService, city, localization, whatsapp ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
      [idPerson, idService, firstNameWorker, lastNameWorker, descriptionService, phoneNumber, priceService, city, localization, whatsapp], (error, results) => {
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
  db.query(`SELECT *
            FROM worker
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

const getWorkerByIdPerson = (request, response) => {
  const id = parseInt(request.params.id)
  db.query('select * from worker where idperson = $1',
    [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
}

const getWorkerById = (request, response) => {
  const id = parseInt(request.params.id)
  db.query('select * from worker where idworker = $1',
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

const updateEmail = (request, response) => {
  try {
    const idPerson = parseInt(request.params.id)
    const { email } = request.body
    console.log('valores updateUser: ', { email })

    db.query('update person set email = $1 where idperson = $2',
      [email, idPerson],
      (error, results) => {
        if (error) {
          throw error
        } response.status(201).send('Email atualizado')
      })

  } catch (error) {
    console.log('Erro: ' + error);
    response.status(400).send({
      status: 400,
      message: 'Erro ao atualizar o email. ' + error
    })
  }
}

const updateBirthDate = (request, response) => {
  try {
    const idPerson = parseInt(request.params.id)
    const { birthDate } = request.body
    console.log('valores updateUser: ', { birthDate })

    db.query('update person set birthdate = $1 where idperson = $2',
      [birthDate, idPerson],
      (error, results) => {
        if (error) {
          throw error
        } response.status(201).send('Data de nascimento atualizada')
      })

  } catch (error) {
    console.log('Erro: ' + error);
    response.status(400).send({
      status: 400,
      message: 'Erro ao atualizar a data de nascimento. ' + error
    })
  }
}

const updatePassword = (request, response) => {
  try {
    const idPerson = parseInt(request.params.id)
    const { pass } = request.body
    console.log('valores updateUser: ', { pass })

    db.query('update person set pass = $1 where idperson = $2',
      [pass, idPerson],
      (error, results) => {
        if (error) {
          throw error
        } response.status(201).send('Senha atualizada')
      })

  } catch (error) {
    console.log('Erro: ' + error);
    response.status(400).send({
      status: 400,
      message: 'Erro ao atualizar a senha. ' + error
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
              *
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
                worker.idworker,
                service.idservice,
                person.idperson,
                person.firstName,
                person.lastName,
                person.email,
                person.birthdate,
                service.titleservice,
                worker.descriptionService,
                worker.phoneNumber,
                worker.priceService,
                worker.city,
                worker.localization,
                worker.whatsapp,
                avg(review.stars)
                FROM worker
                INNER JOIN service
                ON service.idservice = worker.idservice
                INNER JOIN person
                ON worker.idperson = person.idperson
                LEFT JOIN review
                ON review.idworker = worker.idworker
                WHERE service.idservice = $1
                GROUP BY worker.idworker, service.idservice, person.idperson`,
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
    const { idPerson, idWorker, firstNamePerson, lastNamePerson, messageReview, stars } = request.body
    console.log('valores registerWorker:', { idPerson, idWorker, firstNamePerson, lastNamePerson, messageReview, stars });

    db.query('INSERT INTO review ( idPerson, idWorker, firstNamePerson, lastNamePerson, messageReview, stars ) values ($1, $2, $3, $4, $5, $6)',
      [idPerson, idWorker, firstNamePerson, lastNamePerson, messageReview, stars], (error, results) => {
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

const getServicesReviewed = (request, response) => {
  const idperson = parseInt(request.params.id)
  db.query(`SELECT
              review.idreview,
              worker.firstNameWorker,
              worker.lastNameWorker,
              service.titleService,
              review.stars,
              review.messageReview
            FROM review
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

const getReviewsByWorker = (request, response) => {
  const idWorker = parseInt(request.params.id)
  db.query(`SELECT *
            FROM review
            INNER JOIN worker
            ON worker.idworker = review.idworker
            WHERE worker.idworker = $1`,
    [idWorker], (error, results) => {
      console.log('results', results);
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
}

const getAverageRating = (request, response) => {
  const idWorker = parseInt(request.params.id)
  db.query(`SELECT avg(stars)
            FROM review
            INNER JOIN worker
            ON worker.idworker = review.idworker
            WHERE worker.idworker = $1`,
    [idWorker], (error, results) => {
      console.log('results', results);
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
}

const deleteReview = (request, response) => {
  try {
    const idReview = parseInt(request.params.id)

    if (!isNaN(idReview)) {
      db.query('delete from review where idreview = $1', [idReview],
        (error, results) => {
          if (error) {
            throw error
          } response.status(201).send('Avaliação deletada')
        })

    } else {
      throw Error('Erro ao deletar a avaliação. ID não existe')

    }
  } catch (error) {
    console.log(error);
    response.status(400).send({
      status: 400,
      message: 'Erro ao deletar a avaliação.' + error
    })
  }
}

const updateProfileWorker = (request, response) => {
  try {
    const idWorker = parseInt(request.params.id)
    const { descriptionService, phoneNumber, priceService, city, localization, whatsapp } = request.body
    console.log('valores updateUser: ', { descriptionService, phoneNumber, priceService, city, localization, whatsapp })

    db.query('update worker set descriptionService = $1, phoneNumber = $2, priceService = $3, city = $4, localization = $5, whatsapp = $6 where idworker = $7',
      [descriptionService, phoneNumber, priceService, city, localization, whatsapp, idWorker],
      (error, results) => {
        if (error) {
          throw error
        } response.status(201).send('Trabalhador atualizado')
      })

  } catch (error) {
    console.log('Erro: ' + error);
    response.status(400).send({
      status: 400,
      message: 'Erro ao atualizar o registro. ' + error
    })
  }
}

const createChat = (request, response) => {
  try {
    const { idPerson1, firstNamePerson1, lastNamePerson1, idPerson2, firstNamePerson2, lastNamePerson2, idWorker, serviceCategory, status } = request.body
    console.log('valores createChat:', { idPerson1, firstNamePerson1, lastNamePerson1, idPerson2, firstNamePerson2, lastNamePerson2, idWorker, serviceCategory, status });

    db.query('INSERT INTO chat ( idPerson1, firstNamePerson1, lastNamePerson1, idPerson2, firstNamePerson2, lastNamePerson2, idWorker, serviceCategory, status ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
      [idPerson1, firstNamePerson1, lastNamePerson1, idPerson2, firstNamePerson2, lastNamePerson2, idWorker, serviceCategory, status], (error, results) => {
        console.log('Error', error);
        response.status(201).send('Chat criado')
      }
    )
  } catch (error) {
    console.log('Erro: ' + error);
    response.status(500).send({
      status: 500,
      message: 'Erro ao criar chat. ' + error
    })
  }
}

const getChatsByLoggedUser = (request, response) => {
  const idPerson = parseInt(request.params.id)
  db.query(`SELECT *
            FROM chat
            WHERE idPerson1 = $1 or idPerson2 = $1`,
    [idPerson], (error, results) => {
      console.log('results', results);
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
}

const getMessages = (request, response) => {
  const idChat = parseInt(request.params.id)
  db.query(`SELECT *
            FROM messages
            WHERE idChat = $1
            ORDER BY messageDate asc`,
    [idChat], (error, results) => {
      console.log('results', results);
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
}

const sendMessage = (request, response) => {
  try {
    const { idChat, idPerson, messageText } = request.body
    console.log('valores messagem:', { idChat, idPerson, messageText });

    db.query('INSERT INTO messages ( idChat, idPerson, messageText, messageDate ) values ($1, $2, $3, now())',
      [idChat, idPerson, messageText], (error, results) => {
        console.log('Error', error);
        response.status(201).send('Mensagem enviada')
      }
    )
  } catch (error) {
    console.log('Erro: ' + error);
    response.status(500).send({
      status: 500,
      message: 'Erro ao enviar mensagem. ' + error
    })
  }
}

// const deleteMessages = (request, response) => {
//   try {
//     const idChat = parseInt(request.params.id)

//     if (!isNaN(idChat)) {
//       db.query('delete from messages where idChat = $1', [idChat],
//         (error, results) => {
//           if (error) {
//             throw error
//           } response.status(201).send('Mensagens deletadas')
//         })

//     } else {
//       throw Error('Erro ao deletar as mensagens. ID não existe')

//     }
//   } catch (error) {
//     console.log(error);
//     response.status(400).send({
//       status: 400,
//       message: 'Erro ao deletar as mensagens.' + error
//     })
//   }
// }

// const deleteChat = (request, response) => {
//   try {
//     const idChat = parseInt(request.params.id)

//     if (!isNaN(idChat)) {
//       db.query('delete from chat where idChat = $1', [idChat],
//         (error, results) => {
//           if (error) {
//             throw error
//           } response.status(201).send('Chat deletado')
//         })

//     } else {
//       throw Error('Erro ao deletar o chat. ID não existe')

//     }
//   } catch (error) {
//     console.log(error);
//     response.status(400).send({
//       status: 400,
//       message: 'Erro ao deletar o chat.' + error
//     })
//   }
// }

const postImage = (request, response) => {
  try {
    const { idWorker, img } = request.body
    db.query('INSERT INTO workerGallery ( idWorker, img ) values ($1, $2)',
      [idWorker, img], (error, results) => {
        console.log('Error @ postImage:', error);
        response.status(201).send('Imagem Publicada')
      }
    )
  } catch (error) {
    console.log('Erro: ' + error);
    response.status(500).send({
      status: 500,
      message: 'Erro ao publicar imagem' + error
    })
  }
}

const getImageWorker = (request, response) => {
  const idworker = parseInt(request.params.id)
  
  db.query(`SELECT img
            FROM workergallery
            INNER JOIN worker
            ON workergallery.idworker = worker.idworker
            WHERE workergallery.idworker = $1`,
    [idworker], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).json(results.rows)
    })
}

const getIfChatExists = (request, response) => {  
  const { idPerson1 } = parseInt(request.params.id1)
  const { idPerson2 } = parseInt(request.params.id2)
  console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', parseInt(request.params.id));
  console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', parseInt(request.params.id2));
  

  db.query(`SELECT *
            FROM chat
            WHERE idPerson1 = $1 or idPerson2 = $1
            AND idPerson1 = $2 or idPerson2 = $2`,
    [idPerson1, idPerson2], (error, results) => {
      console.log('results', results);
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
}

const cancelService = (request, response) => {
  try {
    const idChat = parseInt(request.params.id)
    const { status } = request.body
    console.log('valores updateUser: ', { status })

    db.query('update chat set status = $1 where idchat = $2',
      [status, idChat],
      (error, results) => {
        if (error) {
          throw error
        } response.status(201).send('Serviço cancelado')
      })

  } catch (error) {
    console.log('Erro: ' + error);
    response.status(400).send({
      status: 400,
      message: 'Erro ao cancelar o registro. ' + error
    })
  }
}

const closeService = (request, response) => {
  try {
    const idChat = parseInt(request.params.id)
    const { status } = request.body
    console.log('valores updateUser: ', { status })

    db.query('update chat set status = $1 where idchat = $2',
      [status, idChat],
      (error, results) => {
        if (error) {
          throw error
        } response.status(201).send('Serviço cancelado')
      })

  } catch (error) {
    console.log('Erro: ' + error);
    response.status(400).send({
      status: 400,
      message: 'Erro ao cancelar o registro. ' + error
    })
  }
}

module.exports = {
  registerUser,
  authenticate,
  registerWorker,
  getServices,
  getWorkers,
  getWorkerByIdPerson,
  deleteWorkerService,
  updateEmail,
  updateBirthDate,
  updatePassword,
  getServicesFromUser,
  workersByCategory,
  registerReview,
  deleteUser,
  getServicesReviewed,
  getReviewsByWorker,
  getAverageRating,
  deleteReview,
  updateProfileWorker,
  getWorkerById,
  createChat,
  getChatsByLoggedUser,
  getMessages,
  sendMessage,
  // deleteMessages,
  // deleteChat,
  postImage,
  getImageWorker,
  getIfChatExists,
  cancelService,
  closeService
}