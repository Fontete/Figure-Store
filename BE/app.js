const express = require('express')
const {connect} = require('mongoose')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const validator = require('express-validator')
const cors = require('cors')
require('dotenv').config()

const userRouter = require('./routes/user')
const categoryRouter = require('./routes/categoy')
const productRouter = require('./routes/product')
const paymentRouter = require('./routes/payment')
const orderRouter = require('./routes/order')

const app = express()

//mongodb
connect(process.env.URI, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
})
	.then(() => {
		console.log('Database is connecting')
	})
	.catch(err => {
		console.error('Failed to connect database...', err)
	})

//middlewares
app.use(morgan('dev'))
app.use(
	bodyParser.json({
		limit: '50mb',
	}),
)
app.use(
	bodyParser.urlencoded({
		limit: '50mb',
		extended: true,
		parameterLimit: 50000,
	}),
)
app.use(cookieParser())
app.use(validator())
app.use(
	cors({
		credentials: true,
		allowedHeaders: [
			'Origin',
			'X-Requested-With',
			'Content-Type',
			'Accept',
			'X-Access-Token',
			'Authorization',
		],
		methods: 'GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS',
	}),
)

app.use('/users', userRouter)
app.use('/categories', categoryRouter)
app.use('/products', productRouter)
app.use('/payments', paymentRouter)
app.use('/orders', orderRouter)

const port = process.env.PORT

app.listen(port || 5000, () => {
	console.log(` Port ${port} is running`)
})
