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
    const { name, email, password, phoneNumber } = request.body
    console.log('valores registerUser:', { name, email, password, phoneNumber });

    db.query('INSERT INTO user ( fullName, email, phoneNumber, birthDate, pass ) values ($1, $2, $3, $4, $5)',
      [email, password, name, phoneNumber], (error, results) => {
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


module.exports = {
  registerUser
}