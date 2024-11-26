const PatreonUser = require('./PatreonUser');
const axios = require('axios');

const checkPremium = async (discordUserId) => {
    const user = await PatreonUser.findOne({ discordUserId });
    if (!user) {
        return { premium: false, error: 'User has not linked Patreon account.' };
    }

    try {
        const response = await axios.get(
            'https://www.patreon.com/api/oauth2/v2/identity?include=memberships&fields[member]=patron_status',
            { headers: { Authorization: `Bearer ${user.accessToken}` } }
        );

        const memberships = response.data.included || [];
        const isPremium = memberships.some(
            (member) => member.attributes.patron_status === 'active_patron'
        );

        // Update MongoDB with the latest premium status
        user.premiumStatus = isPremium;
        user.updatedAt = new Date();
        await user.save();

        return { premium: isPremium };
    } catch (error) {
        console.error('Error checking premium status:', error.message || error.response?.data);
        return { premium: false, error: 'Failed to check premium status' };
    }
};

module.exports = { checkPremium };
