const categoryModel = require("../models/category")
const error = require("../general/error")

exports.addProduct = (req, res) => {
    const category = new categoryModel(req.body)
    category.save((err, data) => {
        if (err) {
            return res.status(403).json({
                err: error.errorHandler(err)
            })
        }
        res.json({
            data
        })
    })
}