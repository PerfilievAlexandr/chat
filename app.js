const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();

require('./handlers/01-favicon').init(app);
require('./handlers/02-static').init(app);
require('./handlers/03-logger').init(app);
require('./handlers/04-templates').init(app);
require('./handlers/05-errors').init(app);
require('./handlers/06-session').init(app);
require('./handlers/07-bodyParser').init(app);
require('./handlers/08-passport').init(app);
require('./handlers/09-flash').init(app);

const router = new Router();

const AuthController = require('./controllers/auth');

const checkIsAuthenticated = (ctx, next) => {
  if (!ctx.isAuthenticated()) {
    return next()
  }

  ctx.redirect('/')
}

const checkIsNotAuthenticated = (ctx, next) => {
  if (ctx.isAuthenticated()) {
    return next()
  }

  ctx.redirect('/login')
}

router
  .get('/', checkIsNotAuthenticated, AuthController.renderPrivate)
  .get('/login', checkIsAuthenticated, AuthController.renderLogin)
  .post('/logout', AuthController.logout)
  .get('/registration', AuthController.renderRegistration)
  .get('/get-users', AuthController.getUsers)
  .delete('/delete-user/:id', AuthController.delete)
  .post('/registration', AuthController.signUp)
  .post('/login', AuthController.signIn)

app.use(router.routes());

module.exports = app;
