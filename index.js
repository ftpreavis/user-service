import fastify from 'fastify'
import metrics from 'fastify-metrics'

fastify.register(require('./routes/user'));
fastify.register(metrics, { endpoint: '/metrics' })


fastify.listen({ host: '0.0.0.0', port: 3000}, (err, addr) => {
	if (err) {
		fastify.log.error(err);
		process.exit(1);
	}
	fastify.log.info(`Server listening at ${address}`);
});
