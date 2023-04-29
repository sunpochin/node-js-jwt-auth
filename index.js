const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

mongoose.connect('mongodb://localhost/node_auth', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})
// mongoose.connect(
// 	'mongodb://localhost/node_auth',
// 	{
// 		useNewUrlParser: true,
// 		useUnifiedTopology: true,
// 	},
// 	() => {
// 		console.log('connected to mongodb');
// 	}
// );


const routes = require('./routes/routes')
const app = express()
// var corsOptions = {
// 	origin: 'http://localhost:8081',
// };
// app.use(cors(corsOptions));
app.use(
	cors({
		credentials: true,
		origin: ['http://localhost:3000', 'http://localhost:8080'],
	})
);
app.use(cookieParser())
app.use(express.json() )
app.use('/api', routes)

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}.`);
});
