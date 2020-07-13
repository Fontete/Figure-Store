const User = require('../models/user')
const jwt = require('jsonwebtoken')
const error = require('../general/error')
const method = require('../general/method')

exports.register = async (req, res) => {
    const user = new User(req.body)
    user.save((err, user) => {
        if (err) {
            return res.status(400).json({
                err: error.errorHandler(err)
            });
        }
        res.json({
            user
        })
    });
};

exports.logIn = async (req, res) => {
    const {
        email,
        password
    } = req.body
    User.findOne({
        email
    }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                err: "Account is not existed"
            })
        }

        if (!user.authenticate(password)) {
            return res.status(401).json({
                err: "Email or password is invalid"
            })
        }

        //create token
        const token = jwt.sign({
            _id: user._id
        }, process.env.JWT)
        res.cookie('token', token, {
            expire: 60 * 60 * 24 * 7
        })

        const {
            _id,
            fullname,
            email,
            role
        } = user
        return res.json({
            token,
            user: {
                _id,
                fullname,
                email,
                role
            }
        })
    })
}

exports.logOut = async (req, res) => {
    res.clearCookie('token');
    res.json({
        message: "Log out successfully"
    })
}