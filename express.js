const express = require('express');
const axios = require('axios');
const PatreonUser = require('./PatreonUser')

// In-memory store for demonstration purposes (use a real database in production)
const userAccessTokens = {};

const app = express();
const port = 3000;

// OAuth callback route for linking Patreon account
app.get('/oauth/callback', async (req, res) => {
    const { code, state } = req.query;

    if (!code || !state) {
        return res.status(400).send('Invalid request: missing code or state.');
    }

    const discordUserId = Buffer.from(state, 'base64').toString('utf-8');

    try {
        const tokenResponse = await axios.post(
            'https://www.patreon.com/api/oauth2/token',
            new URLSearchParams({
                code,
                client_id: process.env.PATREON_CLIENT_ID, // Use environment variables
                client_secret: process.env.PATREON_CLIENT_SECRET, // Use environment variables
                redirect_uri: 'http://cypher-8noe.onrender.com/oauth/callback',
                grant_type: 'authorization_code',
            }).toString(),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        const { access_token } = tokenResponse.data;

        const existingUser = await PatreonUser.findOne({ discordUserId });
        if (existingUser) {
            return res.send('You have already linked your Patreon account.');
        }

        // Save user details to MongoDB
        await PatreonUser.create({
            discordUserId,
            accessToken: access_token,
            premiumStatus: false, // Initial premium status
            tier: 'Free',
        });

        res.send('Patreon account successfully linked!');
    } catch (error) {
        console.error('Error during OAuth callback:', error.response?.data || error.message);
        res.status(500).send('Failed to verify Patreon account.');
    }
});

app.get('/linkCommand', async (req, res) => {
    const { discordUserId } = req.query; // Assuming you're passing the user's Discord ID

    if (!discordUserId) {
        return res.status(400).send('Discord user ID is required.');
    }

    try {
        const user = await PatreonUser.findOne({ discordUserId });
        if (user) {
            return res.send('You have already linked your Patreon account.');
        }

        // Generate the link if not linked
        const state = Buffer.from(discordUserId).toString('base64');
        const linkUrl = `https://www.patreon.com/oauth2/authorize?response_type=code&client_id=${process.env.PATREON_CLIENT_ID}&redirect_uri=http://cypher-8noe.onrender.com/oauth/callback&state=${state}`;
        
        res.send(`Link Your Patreon Account<br><a href="${linkUrl}">Click here to link your Patreon account.</a>`);
    } catch (error) {
        console.error('Error during link command:', error.message);
        res.status(500).send('Failed to process link command.');
    }
});


// Check premium status and update tier
app.get('/checkPremium', async (req, res) => {
    const { discordUserId } = req.query;

    if (!discordUserId) {
        return res.status(400).send({ error: 'Discord user ID is required' });
    }

    try {
        const user = await PatreonUser.findOne({ discordUserId });
        if (!user) {
            return res.send({ premium: false, error: 'User has not linked Patreon account.' });
        }

        const response = await axios.get(
            'https://www.patreon.com/api/oauth2/v2/identity?include=memberships&fields[member]=patron_status,tier',
            { headers: { Authorization: `Bearer ${user.accessToken}` } }
        );

        const memberships = response.data.included || [];
        const activeMembership = memberships.find(
            (member) => member.attributes.patron_status === 'active_patron'
        );

        if (activeMembership) {
            const tier = activeMembership.attributes.tier || 'Unknown';

            // Update user with premium and tier info
            user.premiumStatus = true;
            user.tier = tier;
            user.updatedAt = new Date();
            await user.save();

            return res.send({ premium: true, tier });
        }

        // No active membership found
        user.premiumStatus = false;
        user.tier = 'Free';
        await user.save();

        res.send({ premium: false, tier: 'Free' });
    } catch (error) {
        console.error('Error checking premium status:', error.message || error.response?.data);
        res.status(500).send({ error: 'Failed to check premium status' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
