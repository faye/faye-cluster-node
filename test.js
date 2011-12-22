var faye    = require('faye'),
    cluster = require('./lib/faye/cluster');

var makeServer = function(port) {
  var server = new faye.NodeAdapter({mount: '/faye', timeout: 60});
  server.listen(port);
  return server;
};

var makeClient = function(port) {
  return new faye.Client('http://localhost:' + port + '/faye');
};

// Create two Faye servers using in-memory storage on different ports
var sA = makeServer(8000),
    sB = makeServer(8001);

// Add the cluster extension to each server
var eA = new cluster.Node('http://localhost:8000/faye'),
    eB = new cluster.Node('http://localhost:8001/faye');
    
sA.addExtension(eA);
sB.addExtension(eB);

// Connect extension A to server B
process.nextTick(function() {
  eA.connect('http://localhost:8001/faye');
});

setTimeout(function() {
  // Create a Faye client for each server
  var cA = makeClient(8000),
      cB = makeClient(8001);
  
  // Make clients subscribe to channels on their respective servers
  var subA = cA.subscribe('/msg/a', function(m) { console.log('A', m) }),
      subB = cB.subscribe('/msg/b', function(m) { console.log('B', m) });
  
  subA.callback(function() {
    subB.callback(function() {
      // Send messages between both clients
      cA.publish('/msg/b', {hello: 'world'});
      cB.publish('/msg/a', {hello: 'world'});
    });
  });
}, 100);

