const express = require('express')
const {
    connect
} = require('mongoose')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const validator = require('express-validator')
require('dotenv').config()

const userRouter = require('./routes/user')
const categoryRouter = require('./routes/categoy')
const productRouter = require('./routes/product')

const app = express()

//mongodb
connect(process.env.URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
}).then(() => {
    console.log("Database is connecting")
}).catch(err => {
    console.error('Failed to connect database...', err)
})

//middlewares
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(validator())

app.use("/users", userRouter)
app.use("/categories", categoryRouter)
app.use("/products", productRouter)

const port = process.env.PORT

app.listen(port || 5000, () => {
    console.log(` Port ${port} is running`)
})