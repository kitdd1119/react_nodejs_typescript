const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

userSchema.pre('save', function (next) {
    var user = this;
    // 비밀번호를 바꿀 때
    if (user.isModified('password')) {
        // 비밀번호를 암호화 시킴.
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err)

            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err)
                // hash 부분에 나의 db 비번이 들어감.

                user.password = hash
                next()
            })
        }) // 비밀번호를 바꾸는 상황이 아니라면
    } else {
        next()
    }
})

userSchema.methods.comparePassword = function (plainPassword) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
            if (err) return reject(err);
            resolve(isMatch);
        });
    });
};

userSchema.methods.generateToken = function () {
    const user = this;
    const token = jwt.sign(user._id.toHexString(), 'secretToken');
    user.token = token;
    return user.save()
        .then(user => token)
        .catch(err => {
            throw err;
        });
};

userSchema.statics.findByToken = function (token) {
    const User = this;
    return new Promise((resolve, reject) => {
        jwt.verify(token, 'secretToken', function(err, decoded) {
            if (err) return reject(err);
            User.findOne({ _id: decoded, token: token })
                .then(user => resolve(user))
                .catch(err => reject(err));
        });
    });
}



const User = mongoose.model('User', userSchema);

module.exports = { User }