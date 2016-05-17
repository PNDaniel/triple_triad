'use strict';

const Hapi = require('hapi'),
    server = new Hapi.Server();

server.connection({ port: process.argv[2] });

const options = {
    ops: {
        interval: 0
    },
    reporters: {
        console: [{
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{
                log: '*',
                response: '*'
            }]
        }, {
                module: 'good-console'
            }, 'stdout']
    }
};

server.route({
    method: 'GET',
    path: '/api/status',
    handler: function (request, reply) {
        reply({
            'ip': server.info.ip,
            'port': server.info.port,
            'conn_db': false,
            'conn_fb': false,
            'conn_tw': false
        });
    }
});

server.register({
    register: require('good'),
    options: options
}, (err) => {
    if (err) {
        console.error(err);
    } else {
        server.start(() => {
            console.info('Server running at: ', server.info.uri);
        });
    }
});