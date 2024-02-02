const express = require('express')
const app = express()
const port = 5000

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://kitdd1119:qwe123@reactdb.m0qntcs.mongodb.net/?retryWrites=true&w=majority', {
}).then(() => console.log('MongoDB 연결중...'))
  .catch(err => console.log(err))


app.get('/', (req, res) => res.send('Hello'))

app.listen(port, () => console.log(`포트 연결 port ${port}!`))