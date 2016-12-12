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

## How to run the project for development after setup ##

Nodemon is used in Procfile_dev so that any changes to the Node.js code are automatically applied and the app is restarted
```
foreman start -f Procfile_dev

If you get a "foreman: command not found" error try the following:
- Check your node/npm versions:
npm -v
3.10.3
node -v
v6.3.1
To switch node versions using nvm:
nvm install 6.3.1
nvm use 6.3.1

- Install Foreman with Node:
npm install foreman grunt-cli bower nodemon -g

- If that doesn't work install with Ruby:
gem install foreman -v 0.78.0

- If you have a gem installed that is the wrong version uninstall it first:
gem uninstall gem_name

- If you get a "Could not find 'sass' " error:
gem install sass

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