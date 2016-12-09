#!/bin/bash

# mysql
MYSQL_HOST='taxplan-dev-api.cgl1qxxtbiak.us-east-1.rds.amazonaws.com'
MYSQL_PORT='3306'
MYSQL_DATABASE='taxplan_dev_api'
MYSQL_USER='taxplan_dba'
MYSQL_PASSWORD='pdLa8JReW.81'

# node env
export NODE_ENV='local'
export NODE_PORT=3000
export NODE_LOG_DIRECTORY='logs'
export NODE_COOKIE_KEY1='sessionKey1'
export NODE_COOKIE_KEY2='sessionKey2'

# api
export API_URL='http://staging.taxplancanada.ca/api'
export API_PRODUCT_ID='12345'
