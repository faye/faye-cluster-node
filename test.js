var faye    = require('faye'),
    Cluster = require('./lib/faye/cluster');

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
var eA = new Cluster('http://localhost:8000/faye'),
    eB = new Cluster('http://localhost:8001/faye');
    
sA.addExtension(eA);
sB.addExtension(eB);

// Connect extension B to server A
process.nextTick(function() {
  eA.connect('http://localhost:8001/faye');
  eB.connect('http://localhost:8000/faye');
});

setTimeout(function() {
  // Create a Faye client for each server
  var cA = makeClient(8000),
      cB = makeClient(8001);
  
  // Subscribe to a channel on the first server
  var sub = cA.subscribe('/msg', function(m) { console.log('A', m) });
  
  sub.callback(function() {
    // Publish to a channel on the second server
    cB.publish('/msg', {hello: 'world'});
  });
}, 100);
