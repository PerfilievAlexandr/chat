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
const router = new Router();

router.get('/users', UsersControllers.find);

router.get('/users/:id', UsersControllers.findById);

router.post('/users', UsersControllers.add);

router.delete('/users/:id', UsersControllers.delete);

router.patch('/users/:id', UsersControllers.update);

app.use(router.routes());
app.listen(config.get('port'));
