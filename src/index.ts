import { Application as Pwoli, DataHelper, GridView, CheckboxColumn, RadioButtonColumn, SerialColumn, ActionColumn, ActiveForm, ListView } from 'pwoli';
import Company from './models/Company';
import Event from './models/Event';
import expressLayouts from 'express-ejs-layouts';
import bodyParser from 'body-parser';
import sequelize from "./models"
import path from 'path';
Pwoli.setViewPath(path.join(__dirname, 'views'));
Pwoli.view.setLayout('/layouts/main.ejs');
const express = require("express");
const app = express();
const port = 8080; // default port to listen
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
sequelize.sync()
// define a route handler for the default home page







app.get('/items/list', async function (req, res, next) {
  const filterModel = new Company();
  const dataProvider = filterModel.search(DataHelper.parseUrl(req.url));
  dataProvider.query.include = [{ model: Event, as: 'event' }]; //including a related Table
  dataProvider.getSort().attributes['event.title'] = { //setting the sort settings for the related column
    asc: ['event', 'title', 'asc'],
    desc: ['event', 'title', 'desc'],
  };
  const grid = new GridView({
    dataProvider,
    filterModel,
    columns: [
      { class: CheckboxColumn },
      { class: RadioButtonColumn },
      { class: SerialColumn },
      'id',
      'title',
      {
          attribute: 'event.title',
          label: 'Event Title(Related column)',
          //value: (model) => model?.title + '..', //If value is not explicitely set, it'll be automatically resolved..
      },
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
      content = await Pwoli.view.render('/_grid.ejs', { grid, company: new Company() }, false); //rendering just the grid.ejs without layout if it's a Pjax request.
  else content = await Pwoli.view.render('/grid.ejs', { grid, company: new Company() });
  //res.render('index', { title: 'Pwoli Express Sample App', grid: await grid.render() }) //Express's native way to render the view without Pwoli's custom headers
  return Pwoli.respond(res, content); //Recommended way as this method allows `await` calls inside views.
});














app.get('/items/my-list', async function (req, res, next) {
  const filterModel = new Company();
  const dataProvider = filterModel.search(DataHelper.parseUrl(req.url));
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
      content = await Pwoli.view.render('/_grid.ejs', { grid, company: new Company() }, false);
  else content = await Pwoli.view.render('/grid.ejs', { grid, company: new Company() });
  return Pwoli.respond(res, content);
});

















app.get('/items/list-view', async function (req, res, next) {
  const filterModel = new Company();
  const dataProvider = filterModel.search(DataHelper.parseUrl(req.url));
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
  const company = req.url.includes('items/create')
                ? new Company()
                : await Company.findOne({ where: { id: req.params.id } });
    if (req.method === 'POST') {
        const post = DataHelper.parseQueryParams(req.body);
        //console.log('post', await DataHelper.parseQueryParams((post)), post);
    if (req.headers['x-requested-with'] === 'XMLHttpRequest' && company.load(post)) { //If it's an ajax validation request sent by ActiveForm
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify(await ActiveForm.validate(company)));
        res.end();
        return;
    }
    if (company.load(post) && (await company.verify())) {  
        await company.save();
        return res.redirect('/items/list');
    }
  }
  const form = new ActiveForm();
  await form.initialization;
  const eventsList = {};
  (await Event.findAll()).forEach(event => { eventsList[event.id] = event.title } );
  //Recommended way to render a view with layout if the view has async function calls.
  return Pwoli.respond(res, await Pwoli.view.render('/form.ejs', { form, company, eventsList }));
}
app.all('/items/create', postHandler);
app.all('/items/update/:id/', postHandler);


















app.get('/items/delete/:id', async function (req, res, next) {
    await Company.destroy({ where: { id: req.params.id } });
});

app.get('/items/api', async function (req, res, next) {
    const filterModel = new Company();
    const dataProvider = filterModel.search(DataHelper.parseUrl(req.url));
    dataProvider.query.include = [{ model: Event, as: 'event' }];
    let sort = dataProvider.getSort();
    //console.log('dp-sort', sort)
    sort.attributes['event.title'] = {
        asc: ['event', 'title', 'asc'],
        desc: ['event', 'title', 'desc'],
    };
    dataProvider.setSort(sort);
    //If you want to add custom fields to the JSON response for each model, just do like below:
    const models = await dataProvider.getModels();
    for (let model of models) {
        model.setAttributeValues({
            myGetter: await model.getter, //getter is a custom `getter` written in Company model.
            // model.dataValues.anotherField = anotherValue;
        });
        console.log('api-model', model);
    }
    await dataProvider.setModels(models);

    Pwoli.respond(res, dataProvider);
});

// start the Express server
app.listen( port, () => {
    console.log( `Server started. Please visit http://localhost:${ port }/items/list` );
} );
