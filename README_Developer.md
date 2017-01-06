# TaxPlan Web - Developer #

## How to set up a local environment ##

NPM and Bower install project dependencies (only needed once).  Grunt builds the frontend CSS and JS files

After cloning the repo:
```
gem install foreman sass
cp .env_example .env
npm install
npm install foreman grunt-cli bower nodemon -g
bower install
grunt build
```


## How to switch Node versions using NVM ##

```
nvm install 6.3.1
nvm use 6.3.1
```


## How to run the project for development after setup ##

Nodemon is used in Procfile_dev so that any changes to the Node.js code are automatically applied and the app is restarted
```
npm run dev
```
The site is served at [http://localhost:3000](http://localhost:3000)


## How to develop the frontend JS and CSS files ##

Grunt monitors changes and recompiles the build files as needed.  [Live Reload](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei?hl=en) can be used for automated page refreshes once the builds are complete
```
grunt dev
```

## Unit Tests ##

Unit tests are built with [Mocha](https://www.npmjs.com/package/mocha) and [Chai](https://www.npmjs.com/package/chai).

Tests can be run using
```
npm test
```


## Notes ##

Organize your Files Around Features, Not Roles 
https://blog.risingstack.com/node-hero-node-js-project-structure-tutorial/