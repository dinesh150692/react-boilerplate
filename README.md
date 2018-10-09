# React/Preact Boilerplate
This is React/Preact boilerplate with webpack 4 with various plugins to optimize you build with long term caching and faster first paint.


## CLI Commands for running 

# install dependencies
npm install

# serve with hot reload at localhost:3000
npm run local_run

# build for production with minification
npm run build

# test the production build locally
npm run prod_server

## Project Structure

#src/components
This folder will have the basic/reusable components across multiple pages.

#src/pages
This folder will have the routes of you app

#src/redux

#actions
This folder have the actions which will used in your components/pages

#sagas
This folder will have the sagas which is used for linking data from componets/pages to redux state mangament with the reducer mapping 

#reducers
This folder will have your app state management

#actionType
This is a constant file for mapping sagas/reducers

#store
This store is where all your reducers and saga are combined into a single source of state which is made available to your app through the redux functionality