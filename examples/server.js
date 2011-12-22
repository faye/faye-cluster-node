// Run by passing a port to listen on and optionally the port of another member
// of the cluster. The node will discover all the others itself.
// 
// e.g.
//       node server.js 8000        # initial master
//       node server.js 8001 8000   # second member

var faye    = require('faye'),
    cluster = require('../lib/faye/cluster'),
    
    port    = process.argv[2],
    remote  = process.argv[3];

var server = new faye.NodeAdapter({mount: '/faye', timeout: 60}),
    node   = new cluster.Node('http://localhost:' + port + '/faye');

server.addExtension(node);
server.listen(port);

if (remote) node.connect('http://localhost:' + remote + '/faye');

server.bind('publish', function(clientId, channel, data) {
  console.log(channel, data);
});

