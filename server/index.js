const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const { auth } = require("./middleware/auth");
const { User } = require("./models/User");

// application/x-www-form-urlencoded 타입으로 된 것을 분석해서 가져오도록 함
app.use(bodyParser.urlencoded({ extended: true }));

// application/json 타입으로 된 것을 분석해서 가져오도록 함
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
}).then(() => console.log('MongoDB 연결중...'))
  .catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello asdasd'))

app.get('/api/hello', (req,res) => {
  res.send("안녕하세요~")
})

app.post('/api/users/register', async (req, res) => {
  try {
    const { email, name, password, confirmPassword } = req.body;
    if (!email || !name || !password || !confirmPassword) {
      return res.status(400).json({ success: false, message: "모든 필드를 입력해주세요." });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "비밀번호가 일치하지 않습니다." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "해당 이메일은 이미 사용 중입니다." });
    }

    const user = new User({ email, name, password });
    await user.save();

    return res.status(200).json({ success: true, registerSuccess: true, message: "회원가입에 성공했습니다." });
  } catch (err) {
    console.error("회원가입 중 오류:", err);
    return res.status(500).json({ success: false, message: "회원가입 중 오류가 발생했습니다." });
  }
});

app.post('/api/users/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      });
    }

    const isMatch = await user.comparePassword(req.body.password);
    if (!isMatch) {
      return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." });
    }

    const token = await user.generateToken();

    // 쿠키에 JWT를 설정합니다.
    res.cookie("x_auth", token, { httpOnly: true })
      .status(200)
      .json({ loginSuccess: true, userId: user._id });
  } catch (err) {
    console.error(err);
    return res.status(400).send(err);
  }
});

// role = 0 => 일반유저, 0이 아니면 관리자
app.get('/api/users/auth', auth, (req, res) => {
  // 미들웨어를 통과해 여기까지 왔다는 뜻은
  // Authentication이 True 라는 뜻임.

  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image:req.user.image
  })
})

app.get('/api/users/logout', auth, async (req, res) => {
  try {
    // 사용자의 토큰을 삭제합니다.
    req.user.token = "";
    await req.user.save();
    
    // 클라이언트에게 쿠키를 비워 응답합니다.
    res.clearCookie('x_auth').status(200).send({
      success: true
    });
  } catch (err) {
    // 오류가 발생한 경우 오류 응답을 보냅니다.
    console.error("로그아웃 중 오류가 발생했습니다.", err);
    return res.status(500).json({ success: false, error: "로그아웃 중 오류가 발생했습니다." });
  }
});


app.listen(port, () => console.log(`포트 연결 port ${port}!`))
