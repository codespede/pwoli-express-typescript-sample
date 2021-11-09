import { Application as Pwoli, DataHelper, GridView } from 'pwoli';
import Company from './models/Company';
import expressLayouts from 'express-ejs-layouts';
Pwoli.viewPath = 'src/views';
const express = require("express");
const app = express();
const port = 8080; // default port to listen
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main');
app.set("views", "src/views");
app.use('/static', express.static('static'));
app.use(expressLayouts);
app.locals.pwoliView = Pwoli.view;
// define a route handler for the default home page
app.get("/", async (req, res) => {
    Pwoli.request = req;
    const filterModel = new Company();
    const dataProvider = filterModel.search(DataHelper.parseUrl(req.url));
    const grid = new GridView({ dataProvider, filterModel, columns: ['id', 'title'] });
    const renderedGrid = await grid.render()
    res.render('index', { renderedGrid })
} );

// start the Express server
app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );
