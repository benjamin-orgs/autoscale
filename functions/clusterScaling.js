exports = async function(projectId, clusterName){

  const thresholds = context.values.get("thresholds");
  const instanceResources = context.values.get("instanceResourceList");
  const clusterInfo = await context.functions.execute('getClusterState',projectId, clusterName);
  
  console.log(JSON.stringify(clusterInfo))
  //no further actions if cluster is paused
  if (clusterInfo.paused) {
    console.log('status: 200, msg: cluster is paused');
    return {'status':200, 'msg':'cluster is paused'}
  }
  
  // Cluster Status = "IDLE" "CREATING" "UPDATING" "DELETING" "DELETED" "REPAIRING"
  
  if (clusterInfo.clusterState != 'IDLE') {
    console.log('status: 200, msg: cluster status is not IDLE');
    return {'status':200, 'msg':'cluster status is not IDLE'}
  }
  
  clusterInfo.metrics = await context.functions.execute('getMetrics',projectId,clusterInfo.processes);
  
  var connectionThresholds = {};
  
  switch(clusterInfo.currentSize) {
    case 'M20':
      connectionThresholds.current = {
        'threshold':thresholds.connections.M20,
        'instanceSize':clusterInfo.currentSize
      }; 
      connectionThresholds.lower = {
        'threshold':thresholds.connections.M20,
        'instanceSize':'M20'
      }; 
      connectionThresholds.upper = {
        'threshold':thresholds.connections.M20,
        'instanceSize':'M30'
      }; 
      break;
    case 'M30':
      connectionThresholds.current = {
        'threshold':thresholds.connections.M30,
        'instanceSize':clusterInfo.currentSize
      }; 
      connectionThresholds.lower = {
        'threshold':thresholds.connections.M20,
        'instanceSize':'M20'
      }; 
      connectionThresholds.upper = {
        'threshold':thresholds.connections.M40,
        'instanceSize':'M40'
      }; 
      break;
    case 'M40':
      connectionThresholds.current = {
        'threshold':thresholds.connections.M40,
        'instanceSize':clusterInfo.currentSize
      }; 
      connectionThresholds.lower = {
        'threshold':thresholds.connections.M30,
        'instanceSize':'M30'
      }; 
      connectionThresholds.upper = {
        'threshold':thresholds.connections.M40,
        'instanceSize':'M40'
      }; 
      break; 
    default:
      return {'err': 'missing cluster info'} ;
  }
  
  const clusterConnections = [];

  for (var process of clusterInfo.processes) {
    var processConnections = clusterInfo.metrics[process].CONNECTIONS;
    var dataPoints = [];
    if (processConnections != null && processConnections.length){
      for (var connection of processConnections){
        if (connection != null){
          dataPoints.push(connection);
        }
      }
      clusterConnections.push(dataPoints); 
    }
  }
  const highestConnectionCount = Math.max(...clusterConnections); 
  
  if (highestConnectionCount >= connectionThresholds.current.threshold){
    response = await context.functions.execute('scaleCluster',projectId,clusterName, clusterInfo,connectionThresholds.upper.instanceSize);
    console.log('status:200, msg: cluster '+clusterName+' has been scaled up from '+connectionThresholds.current.threshold+' to '+connectionThresholds.upper.threshold);
    return {'status':200, 'msg': 'cluster '+clusterName+' has been scaled up from '+connectionThresholds.current.threshold+' to '+connectionThresholds.upper.threshold};
  }
  
  if (highestConnectionCount < connectionThresholds.lower.threshold) {
    response = await context.functions.execute('scaleCluster',projectId,clusterName, clusterInfo,connectionThresholds.lower.instanceSize);
    console.log('status:200, msg: cluster '+clusterName+' has been scaled down from '+connectionThresholds.current.threshold+' to '+connectionThresholds.lower.threshold);
    return {'status':200, 'msg': 'cluster '+clusterName+' has been scaled down from '+connectionThresholds.current.threshold+' to '+connectionThresholds.lower.threshold};
  }
  console.log('status: 200, msg: cluster not eligible for scaling');
  return {'status':200, 'msg': 'cluster not eligible for scaling'};
};