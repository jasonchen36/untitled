# TaxPlan Web - Developer #

## How to set up a local environment ##

NPM and Bower install project dependencies (only needed once).  Grunt builds the frontend CSS and JS files

After cloning the repo:
```
cp .env_example .env
npm install
npm install foreman -g
bower install
grunt build
```

## How to run the project for development after setup ##

Nodemon is used in Procfile_dev so that any changes to the Node.js code are automatically applied and the app is restarted
```
foreman start -f Procfile_dev
```

## How to develop the frontend JS and CSS files ##

Grunt monitors changes and recompiles the build files as needed.  [Live Reload](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei?hl=en) can be used for automated page refreshes once the builds are complete
```
grunt dev
```

## Notes ##

Organize your Files Around Features, Not Roles 
https://blog.risingstack.com/node-hero-node-js-project-structure-tutorial/

## TODO ##

unit tests
https://blog.risingstack.com/node-hero-node-js-unit-testing-tutorial/

monitoring
https://blog.risingstack.com/node-hero-monitoring-node-js-applications/