exports = async function(projectId,clusterName, clusterInfo, instanceSize){
  console.log('running scale');
  let apiCall = await context.functions.execute('getApiTemplate','clusterScale',projectId, clusterName);
  apiCall.body = '{"providerSettings":{"providerName": "'+clusterInfo.providerName+'","instanceSizeName":"'+instanceSize +'"}}';
  apiCall.headers = {"Content-Type":["application/json"]};
  
  response = await context.http.patch(apiCall);

  return response;
};