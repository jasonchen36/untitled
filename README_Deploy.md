# TaxPlan Web - Deploy #

## Software Architecture (High Level) ##

The Node.js server is run on Ubuntu 14 using [Nginx](https://www.nginx.com/) as a http proxy and [Upstart](http://upstart.ubuntu.com/) as a keep-alive daemon.  

[Foreman](https://github.com/strongloop/node-foreman) is used instead of Grunt or the raw node command to run the server. It uses a Procfile to manage Node processes separately and loads environment variables from the .env file.


## Nginx ##

The config file is located at /etc/nginx/sites-available/default on the remote server


## Upstart ##

The config file is located at /etc/init/taxplanweb.conf on the remote server

The service is set to spawn on server start and automatically respawn itself.  You can manually start it using:
```
sudo service taxplanweb start
```


## Foreman ##

Config updates/env variables are not part of the Jenkins build process. Any config changes need to be done manually on the server.

After the correct environment variables are in the .env file, use Foreman to export the config for production use.
```
sudo nf export -o /etc/init
```


## TODO ##

ssl https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04