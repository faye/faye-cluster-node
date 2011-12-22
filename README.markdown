# faye-cluster

This extension provides a way to run a decentralized cluster of Faye servers
that can be dynamically expanded at runtime. When you start a new server, you
tell it the endpoint of one other server in the cluster and it will discover the
rest itself. Any message you publish to a server is then forwarded to all the
others.

Using this extension you can run an ever-increasing number of Faye servers that
share no state in order to increase your connection capacity. Each client should
connect to one of these servers, and it will be able to communicate with any
other client connected to the cluster.


## Examples

See `examples/server.js`.


## License

(The MIT License)

Copyright (c) 2011 James Coglan

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the 'Software'), to deal in
the Software without restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

