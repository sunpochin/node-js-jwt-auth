const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

router.get('/', (req, res) => {
	res.send('hello');
});

router.post('/register', async (req, res) => {
	try {
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(req.body.password, salt);

		const user = new User({
			name: req.body.name,
			email: req.body.email,
			password: hashedPassword,
		});

		const result = await user.save();
		const { password, ...data } = await result.toJSON();

		res.send(data);
	} catch (error) {
		console.log('Register Error:', error);
	}
});

router.post('/login', async (req, res) => {
	const user = await User.findOne({ email: req.body.email });

	if (!user) {
		console.log('User not found');
		return res.status(404).send({
			message: 'User not found',
		});
	}

	if (!(await bcrypt.compare(req.body.password, user.password))) {
		console.log('Invalid credentials');
		return res.status(400).send({
			message: 'Invalid credentials',
		});
	}

	const token = jwt.sign({ _id: user._id }, 'secret');
	res.cookie('jwt', token, {
		httpOnly: true,
		maxAge: 24 * 60 * 60 * 1000, // 1 day
	});
	res.send('success');
	// res.send(token);
	//  res.send(user);
});

router.get('/user', async (req, res) => {
	try {
		const cookie = req.cookies['jwt'];
		const claims = jwt.verify(cookie, 'secret');
		if (!claims) {
			return res.status(401).send({
				message: 'Unauthenticated',
			});
		}

		const user = await User.findOne({ _id: claims._id });
		const { password, ...data } = await user.toJSON();
		res.send(data);
	} catch (error) {
		return res.status(401).send({
			message: 'Unauthenticated',
		});
	}
	// res.send(user)
});

router.post('/logout', (req, res) => {
	res.cookie('jwt', '', { maxAge: 0 });
	res.send({
		message: 'success',
	});
});

module.exports = router;
