const fastify = require('fastify')();
const metrics = require('fastify-metrics');

fastify.register(require('./routes/user'));
fastify.register(metrics, { endpoint: '/metrics' });


fastify.listen({ host: '0.0.0.0', port: 3000}, (err, addr) => {
	if (err) {
		fastify.log.error(err);
		process.exit(1);
	}
	fastify.log.info(`fastify listening at ${addr}`);
});
