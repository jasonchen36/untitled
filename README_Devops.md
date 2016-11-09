# TaxPlan Web - Devops #

## Nginx ##

The config file is located at /etc/nginx/sites-available/default on the remote server

## Upstart ##

The config file is located at /etc/init/taxplanweb.conf on the remote server

The service is set to spawn on server start and automatically respawn itself.  You can manually start it using:
```
sudo service taxplanweb start
```

## Foreman (Daemonizing for production) ##

You can use Foreman to export the config env files for production using:
```
sudo nf export -o /etc/init
```


## TODO ##

ssl https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04