var faye = require('faye');

var Cluster = function(endpoint) {
  this._endpoint = endpoint;
};

var META    = /^\/meta\//,
    SERVICE = /^\/service\//;

Cluster.prototype.incoming = function(message, callback) {
  callback(message);
  var channel = message.channel;
  if (META.test(channel) || SERVICE.test(channel)) return;
  if (message.ext && message.ext.cluster) return;
  this._forward(message);
};

Cluster.prototype.outgoing = function(message, callback) {
  if (message.ext) delete message.ext.cluster;
  callback(message);
};

Cluster.prototype.connect = function(endpoint) {
  this._upstream = new faye.Client(endpoint);
  this._upstream.addExtension({
    outgoing: function(message, callback) {
      if (META.test(message.channel)) return callback(message);
      message.channel = message.data.channel;
      message.ext = message.data.ext;
      message.data = message.data.data;
      callback(message);
    }
  });
};

Cluster.prototype._forward = function(message) {
  message.ext = message.ext || {};
  message.ext.cluster = {publish: true};
  this._upstream.publish('/cluster', message);
};

module.exports = Cluster;

