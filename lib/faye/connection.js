var faye    = require('faye'),
    FORWARD = '/faye/cluster/forward';

var Connection = function(node, endpoint) {
  this._node     = node;
  this._endpoint = endpoint;
  this._remote   = new faye.Client(endpoint);
  
  this._remote.addExtension(this);
  
  var sub = this._remote.subscribe('/faye/cluster/endpoints', function(endpoints) {
              this._node.connect(endpoints);
            }, this);
  
  sub.callback(function() {
    this._remote.publish('/faye/cluster/endpoint', this._node._endpoint);
  }, this);
};

Connection.prototype.outgoing = function(message, callback) {
  if (message.channel === FORWARD) {
    message.channel = message.data.channel;
    message.ext = message.data.ext;
    message.data = message.data.data;
  }
  callback(message);
};

Connection.prototype.forward = function(message) {
  this._remote.publish(FORWARD, message);
};

module.exports = Connection;

