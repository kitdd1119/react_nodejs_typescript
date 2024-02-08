const { User } = require("../models/User");

let auth = async (req, res, next) => {
    try {
        // 클라이언트 쿠키에서 토큰 가져오기
        let token = req.cookies.x_auth;

        // 토큰을 복호화한 후 유저를 찾음
        const user = await User.findByToken(token);

        // 유저를 찾지 못한 경우
        if (!user) {
            console.error("유저를 찾을 수 없습니다.");
            return res.status(401).json({ success: false, error: "인증되지 않은 사용자입니다." });
        }

        // 토큰과 유저 정보를 요청 객체에 추가하고 다음 미들웨어로 전달
        req.token = token;
        req.user = user;
        next();
    } catch (err) {
        console.error("오류가 발생했습니다.", err);
        return res.status(500).json({ success: false, error: "인증 중 오류가 발생했습니다." });
    }
}

module.exports = { auth };