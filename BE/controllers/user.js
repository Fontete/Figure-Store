const userModel = require('../models/user')
const jwt = require('jsonwebtoken')
const error = require('../general/error')
const method = require('../general/method')

exports.register = async (req, res) => {
    const user = new userModel(req.body)
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
    userModel.findOne({
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

exports.profile = async (req, res) => {
    res.json({
        user: req.profile
    })
}

//middlewares
exports.userByID = async (req, res, next, id) => {
    userModel.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                err: "User is not existed"
            })
        }
        req.profile = user
        next();
    })
}

exports.isMember = (req, res, next) => {
    let user = req.profile && req.profile._id == req.authenticate._id
    if (!user) {
        return res.status(403).json({
            err: "Unauthorize"
        })
    }
    next()
}

exports.isAdmin = (req, res, next) => {
    if (req.profile.role !== 0) {
        return res.status(403).json({
            err: "You are not an admin"
        })
    }
    next();
}