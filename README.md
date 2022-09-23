# Pwoli with TypeScript enabled Express.js - Sample Application

A sample TypeScript enabled Express.js app which uses Pwoli to show users how it works.

## Try it out

Easiest way is to clone this repo into your local:

```
git clone https://github.com/internetmango/pwoli-express-typescript-sample.git
npm install
```

- Provide your DB credentials in the file config/config.json
- Build the app
```
npm run build
```
- Initialize the DB with tables

```
node dist/dbinit.js
```
- For adding some seed data(dummy data) to the tables, please run:

```
sequelize db:seed:all
```

- Run the app
```
npm run start
```

Point your browser to http://localhost:8080/items/list and you should see a page with a `GridView` where you can do CRUD operations for the items.

Point your browser to http://localhost:8080/items/api to see the RESTful API features mentioned in https://internetmango.github.io/pwoli/rest-api
