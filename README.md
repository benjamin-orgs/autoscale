# Foreword

This Project is an example implementation of MongoDB Atlas Cluster Autoscaling based on custom thresholds for the connection count on a cluster and is not considered as a production ready application.

The following Topics has to be taken into consideration: 

- OpLog Size of the cluster for sufficient autoscaling (documentation)
- Number of autoscaling Triggers in a given time to not scale up and down the cluster in a minute matter
- When defining threshold please check out the documentation for further reading

# MongoDB Atlas Cluster Autoscaling

## Prerequisites: 
MongoDB Atlas Cluster (at least M20) is up and running 

## Set up: 
Create an API key for MongoDB realm

Install realm-cli 
### `npm install -g mongodb-realm-cli`

Login in realm
### `realm-cli login --api-key=<public-key> --private-api-key="<private-key>"`

## Configure values: 
Configure cluster names in /values/clusterList.json

Configure thresholds in /values/thresholds.json

## Push app 
Push realm-app

### `realm-cli push`

Follow the command line process as prompted
