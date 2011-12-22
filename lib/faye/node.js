var faye       = require('faye'),
    Connection = require('./connection'),
    META       = /^\/meta\//,
    SERVICE    = /^\/service\//,
    CLUSTER    = /^\/faye\/cluster\//;

var Node = function(endpoint) {
  this._endpoint    = endpoint;
  this._connections = {};
};

Node.prototype.added = function(server) {
  this._server = server;
  this._client = new faye.Client(server);
  
  this._client.subscribe('/faye/cluster/endpoint', function(endpoint) {
    this.connect(endpoint);
    var remotes = Object.keys(this._connections);
    this._client.publish('/faye/cluster/endpoints', remotes);
  }, this);
};

Node.prototype.incoming = function(message, callback) {
  callback(message);
  var channel = message.channel;
  if (META.test(channel) || SERVICE.test(channel) || CLUSTER.test(channel)) return;
  if (message.ext && message.ext.cluster) return;
  this._forward(message);
};

Node.prototype.outgoing = function(message, callback) {
  if (message.ext) delete message.ext.cluster;
  callback(message);
};

Node.prototype.connect = function(endpoints) {
  endpoints = [].concat(endpoints);
  
  var i     = endpoints.length,
      conns = this._connections,
      endpoint;
  
  while (i--) {
    endpoint = endpoints[i];
    if (endpoint !== this._endpoint)
      conns[endpoint] = conns[endpoint] || new Connection(this, endpoint);
  }
};

Node.prototype._forward = function(message) {
  message.ext = message.ext || {};
  message.ext.cluster = {publish: true};
  for (var endpoint in this._connections)
    this._connections[endpoint].forward(message);
};

module.exports = Node;

