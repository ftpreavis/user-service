const axios = require('axios');


module.exports = async function (fastify, opts) {
    fastify.get('/users', async (req, res) => {
        try {
            const response = await axios.get('http://db-service:3000/users');
            return response.data;
        } catch (err) {
            console.error('Error fetching data from db-service', err);
        }
    });
}