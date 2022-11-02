import { Application as Pwoli, DataHelper, GridView, CheckboxColumn, RadioButtonColumn, SerialColumn, ActionColumn, ActiveForm, ListView } from 'pwoli';
import Organization from './mongo-models/Organization';
import Event from './mongo-models/Event';
import expressLayouts from 'express-ejs-layouts';
import bodyParser from 'body-parser';

import path from 'path';
const mongoose = require('mongoose');
const config = {
    DB_USERNAME: '',
    DB_PASSWORD: '',
    DB_DATABASE: 'pwoli_test',
    DB_HOST: '127.0.0.1',
    DB_PORT: 27017,
    NODE_ENV: 'development'
};

const usernamePassword = config.DB_USERNAME === '' || config.DB_PASSWORD === '' ? "" : `${config.DB_USERNAME}:${config.DB_PASSWORD}@`;
const mongoDB = `mongodb://${usernamePassword}${config.DB_HOST}:${config.DB_PORT}/${config.DB_DATABASE}` + `?authSource=${config.DB_DATABASE}&w=1`;
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true, autoIndex: true}, () => {
    
})
mongoose.set('debug', true);
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
Pwoli.setViewPath(path.join(__dirname, 'views'));
Pwoli.view.setLayout('/layouts/main.ejs');
const express = require("express");
const app = express();
const port = 3006; // default port to listen
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main');
app.set("views", "src/views");
app.use('/static', express.static('static'));
app.use('/public', express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressLayouts);
app.use(express.json());
app.locals.pwoliView = Pwoli.view;
app.use((req, res, next) => { //middleware to assign the current request to Pwoli.
  Pwoli.request = req;
  next();
})
//sequelize.sync()
// define a route handler for the default home page







app.get('/items/list', async function (req, res, next) {
  const filterModel = new Event();
  const dataProvider = (filterModel as any).search(DataHelper.parseUrl(req.url));
  dataProvider.query.populate = 'organization'; //populating a related Collection
  const grid = new GridView({
    dataProvider,
    filterModel,
    columns: [
      { class: CheckboxColumn },
      { class: RadioButtonColumn },
      { class: SerialColumn },
      'id',
      'title',
      'contactPerson.name',
      'organization.title',
      {
          attribute: 'getter',
          filter: false,
      },
      {
          label: 'Sample',
          value: (model, attribute) => model.sampleFunc(attribute),
      },
      { class: ActionColumn, route: 'items' /*visibleButtons: { update: false }*/ },
    ],
    options: { id: 'my-grid' },
  });
  let content;
  if (req.headers['x-requested-with'] === 'XMLHttpRequest')
      content = await Pwoli.view.render('/_grid.ejs', { grid, company: new Event() }, false); //rendering just the grid.ejs without layout if it's a Pjax request.
  else content = await Pwoli.view.render('/grid.ejs', { grid, company: new Event() });
  //res.render('index', { title: 'Pwoli Express Sample App', grid: await grid.render() }) //Express's native way to render the view without Pwoli's custom headers
  return Pwoli.respond(res, content); //Recommended way as this method allows `await` calls inside views.
});














app.get('/items/my-list', async function (req, res, next) {
  const filterModel = new Event();
  const dataProvider = (filterModel as any).search(DataHelper.parseUrl(req.url));
  const grid = new GridView({
    dataProvider,
    filterModel,
    columns: [
      { class: SerialColumn },
      'id',
      'title'
    ],
    options:{ id:'my-grid' }
  });
  let content;
  if (req.headers['x-requested-with'] === 'XMLHttpRequest')
      content = await Pwoli.view.render('/_grid.ejs', { grid, company: new Event() }, false);
  else content = await Pwoli.view.render('/grid.ejs', { grid, company: new Event() });
  return Pwoli.respond(res, content);
});


















app.get('/items/list-view', async function (req, res, next) {
  const filterModel = new Event();
  const dataProvider = (filterModel as any).search(DataHelper.parseUrl(req.url));
  dataProvider.getPagination().setPageSize(5);
  const list = new ListView({
    dataProvider,
    itemView: '/_item.ejs',
    filterModel,
    options: { id:'my-list' },
  });
  let content;
  if (req.headers['x-requested-with'] === 'XMLHttpRequest')
      content = await Pwoli.view.render('/_list.ejs', { list }, false);
  else content = await Pwoli.view.render('/list.ejs', { list });
  return Pwoli.respond(res, content);
});



















































const postHandler = async function (req, res, next) { // if the route is "items/create" or "items/update"
  const event = req.url.includes('items/create')
                ? new Event()
                : await Event.findById(req.params.id);
    if (req.method === 'POST') {
        const post = DataHelper.parseQueryParams(req.body);
        //console.log('post', await DataHelper.parseQueryParams((post)), post);
    if (req.headers['x-requested-with'] === 'XMLHttpRequest' && (event as any).load(post)) { //If it's an ajax validation request sent by ActiveForm
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify(await ActiveForm.validate(event as any)));
        res.end();
        return;
    }
    if ((event as any).load(post) && (await (event as any).verify())) {  
        await event.save();
        return res.redirect('/items/list');
    }
  }
  const form = new ActiveForm();
  await form.initialization;
  const orgsList = {};
  (await Organization.find()).forEach(org => { orgsList[org.id] = org.title } );
  //Recommended way to render a view with layout if the view has async function calls.
  return Pwoli.respond(res, await Pwoli.view.render('/form_mongo.ejs', { form, event, orgsList }));
}
app.all('/items/create', postHandler);
app.all('/items/update/:id/', postHandler);

app.get('/items/delete/:id', async function (req, res, next) {
    await Event.remove(req.params.id);
});















app.get('/items/api', async function (req, res, next) {
    const filterModel = new Event();
    const dataProvider = (filterModel as any).search(DataHelper.parseUrl(req.url));
    dataProvider.query.populate = 'organization'; //populating a related Collection
    dataProvider.getSort().attributes['event.title'] = {
        asc: ['event', 'title', 'asc'],
        desc: ['event', 'title', 'desc'],
    };
    //If you want to add custom fields to the JSON response for each model, just do like below:
    const models = await dataProvider.getModels();
    for (let model of models)
        model.setAttributeValues({ myGetter: await model.getter }) //getter is a custom `getter` method written in Company model.
    Pwoli.serializer.collectionEnvelope = 'events';
    Pwoli.respond(res, dataProvider);
});







































// start the Express server
app.listen( port, () => {
    console.log( `Server started. Please visit http://localhost:${ port }/items/list` );
} );
