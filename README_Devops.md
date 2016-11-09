# TaxPlan Web - Devops #

## Nginx ##

The config file is located at /etc/nginx/sites-available/default on the remote server

## Upstart ##

The config file is located at /etc/init/taxplanweb.conf on the remote server

The service is set to spawn on server start and automatically respawn itself.  You can manually start it using:
```
sudo service taxplanweb start
```


## TODO ##

ssl https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04