exports = function(purpose,projectId="",clusterName="",process=""){


  // Get stored credentials...
  const username = context.values.get("atlasPublicKey");
  const password = context.values.get("atlasPrivateKey");
  var resourcePath = '';
  
  //build path based on purpose
  switch(purpose) {
    case 'clusterInfo':
      resourcePath = "/api/atlas/v1.0/groups/"+ projectId + "/clusters/"+clusterName;
      // API Specification: https://www.mongodb.com/docs/atlas/reference/api-resources-spec/#tag/Clusters/operation/returnOneCluster
      break;
    case 'metrics':
      resourcePath = "/api/atlas/v1.0/groups/"+ projectId + "/processes/"+ process + "/measurements";
      // API Specification: https://www.mongodb.com/docs/atlas/reference/api-resources-spec/#tag/Monitoring-and-Logs/operation/returnMeasurementsForOneMongodbProcess
      break;
    case 'clusterScale':
      resourcePath = "/api/atlas/v1.0/groups/"+projectId + "/clusters/"+clusterName;
      // API Specification: https://www.mongodb.com/docs/atlas/reference/api-resources-spec/#tag/Clusters/operation/updateConfigurationOfOneCluster
      break;
    default:
      return {'err':'missing purpose'};
  }
  
  return { 
    scheme: 'https', 
    host: 'cloud.mongodb.com', 
    path: resourcePath, 
    username: username, 
    password: password,
    digestAuth:true
  };
};