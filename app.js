const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index.routes');
const signupRouter = require('./routes/signup.routes');
const loginRouter = require('./routes/login.routes');
const accessDenideRouter = require('./routes/access-denide.routes');
const companyRouter = require('./routes/company.routes');
const userRouter = require('./routes/user.routes');
const profileRouter = require('./routes/profile.routes');
const dashboardRouter = require('./routes/dashboard.routes');
const clientRouter = require('./routes/client.routes');
const businessRouter = require('./routes/business.routes');
const logoutRouter = require('./routes/logout.routes');
const emailRouter = require('./routes/email.routes');
const exportRouter = require('./routes/export.routes');
const tokenRouter = require('./routes/token.routes');
const accessRouter = require('./routes/access.routes');
const multer = require("multer");
const tokenService = require("./services/token.service");
const authController = require("./controller/auth.controller");
const multipart = multer().none();
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(multipart);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/signup', signupRouter);
app.use('/api/login', loginRouter);
app.use('/access-denide', accessDenideRouter);
app.use('/invite/:token', (req, res) => {
	authController.invite(req, res);
});

// validate token middleware for private api
app.use((req, res, next) => {
	const token = tokenService.verifyToken(req);
	if (token.isVerified) {
		next();
	} else {
		res.clearCookie("authToken");
		res.status(401);
		res.redirect("/");
	}
});

// validate token in database for login
const validateTokenFromDatabase = () => {
	return async (req, res, next) => {
		const isLoggedIn = await authController.checkUserLogin(req, res);
		if (isLoggedIn) {
			next();
		} else {
			res.status(401);
			res.clearCookie("authToken");
			res.redirect("/");
		}
	}
}

app.use('/api/private/company', companyRouter);
app.use('/api/private/user', userRouter);
app.use('/logout', logoutRouter);
app.use('/profile', validateTokenFromDatabase(), profileRouter);
app.use('/dashboard', dashboardRouter);
app.use('/client', clientRouter);
app.use('/business', businessRouter);
app.use('/email', emailRouter);
app.use('/export', exportRouter);
app.use('/token', tokenRouter);
app.use('/access', accessRouter);

app.get('*', function (req, res) {
	res.status(404)
		.render('not-found');
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
});

module.exports = app;
