const axios = require('axios');
const bcrypt = require('bcryptjs');


module.exports = async function (fastify, opts) {
    fastify.get('/users', async (req, res) => {
        try {
            const response = await axios.get('http://db-service:3000/users');
            return response.data;
        } catch (err) {
            console.error('Error fetching data from db-service', err);
        }
    });

    // Get user profile by identifier
    fastify.get('/users/:idOrUsername', async (req, res) => {
        try {
            const { idOrUsername } = req.params;
            const response = await axios.get(`http://db-service:3000/users/${idOrUsername}`);
            return response.data;
        } catch (err) {
            fastify.log.error('Error fetching data from db-service', err);
            const status = err.response?.status || 500
            const message = err.response?.data || { error: 'Internal Server Error' };
            return res.code(status).send(message);
        }
    });

    // Update user's avatar
    fastify.patch('/users/:idOrUsername/avatar', async (req, res) => {
        try {
            const { idOrUsername } = req.params;
            const response = await axios.patch(`http://db-service:3000/users/${idOrUsername}/avatar`, {
                avatar: req.body.avatar
            });
            return res.data;
        } catch (err) {
            fastify.log.error('Error updating avatar', err);
            const status = err.response?.status || 500
            const message = err.response?.data || { error: 'Internal Server Error' };
            return res.code(status).send(message);
        }
    });

    fastify.patch('/users/:idOrUsername', async (req, res) => {
        const { idOrUsername } = req.params;
        const { username, biography, password } = req.body;

        if (!username && !biography && !password) {
            return res.code(400).send({ error: 'No fields to update' });
        }

        try {
            const updatePayload = {};
            if (username) updatePayload.username = username;
            if (biography) updatePayload.biography = biography;
            if (password) {
                const saltRounds = 10;
                updatePayload.password = await bcrypt.hash(password, saltRounds);
            }

            const response = await axios.patch(`http://db-service:3000/users/${idOrUsername}`, updatePayload);
            return res.send(response.data);
        } catch (err) {
            const status = err.response?.status;
            const message = err.response?.data;

            fastify.log.error(`User update failed [${status || 500}]`, message || err.message);

            if (status && message) {
                return res.code(status).send(message);
            }

            return res.code(500).send({ error: 'Could not update user' });
        }
    });
}