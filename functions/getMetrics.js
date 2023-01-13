exports = async function(projectId, processes){

  var readings = {};
  for (var process of processes){
    var apiCall = await context.functions.execute('getApiTemplate','metrics',projectId,'', process=process);
    apiCall.query ={
      'period':['PT1M'],
      'm':['CONNECTIONS'],
      'granularity':['PT1M']
    }
    response = await context.http.get(apiCall);
    const returnBody = EJSON.parse(response.body.text());
    
    readings[process] = {'CONNECTIONS':returnBody.measurements[0].dataPoints.map(({ value }) => value)};
  }

  return readings;
};