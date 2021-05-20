const Koa = require('koa');
const app = new Koa();

const config = require('config');

require('./handlers/01-favicon').init(app);
require('./handlers/02-static').init(app);
require('./handlers/03-logger').init(app);
require('./handlers/04-templates').init(app);
require('./handlers/05-errors').init(app);
require('./handlers/06-session').init(app);
require('./handlers/07-bodyParser').init(app);

const Router = require('koa-router');
const UsersControllers = require('./controllers/users');
const { catchLoadByIdErrors } = require('./validators');

const userRouter = new Router({
  prefix: '/users',
})

userRouter
  .get('/', UsersControllers.find)
  .get('/:id', UsersControllers.findById)
  .post('/', catchLoadByIdErrors, UsersControllers.add)
  .delete('/:id', catchLoadByIdErrors, UsersControllers.delete)
  .patch('/:id', catchLoadByIdErrors, UsersControllers.update);

app.use(userRouter.routes());
app.listen(config.get('port'));
