const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
const { User } = require("./models/User");

// application/x-www-form-urlencoded 타입으로 된 것을 분석해서 가져오도록 함
app.use(bodyParser.urlencoded({extended: true}));

//application/json 타입으로 된 것을 분석해서 가져오도록 함
app.use(bodyParser.json());


const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://kitdd1119:qwe123@reactdb.m0qntcs.mongodb.net/?retryWrites=true&w=majority', {
}).then(() => console.log('MongoDB 연결중...'))
  .catch(err => console.log(err))


app.get('/', (req, res) => res.send('Hello'))

app.post('/register', async (req, res) => {
  try {
    // 회원가입 시 필요한 정보들을 client에서 가져오면 그것들을 데이터 베이스에 넣도록
    const user = new User(req.body);
    const userInfo = await user.save();
    return res.status(200).json({ success: true })
  } catch (err) {
    return res.json({ success: false, err })
  }
})

app.listen(port, () => console.log(`포트 연결 port ${port}!`))
