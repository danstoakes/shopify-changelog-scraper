const { getFeed } = require('../../helpers/rss');
const axios = require('axios');

require('dotenv').config();

exports.handler = async () => {
    // Calculate date 24 hours ago
    const cutoffDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const feedItems = await getFeed();

    // Filter items published within last 24 hours
    const newItems = feedItems.filter(item => new Date(item.pubDate) > cutoffDate);

    if (newItems.length === 0) {
        return { statusCode: 200, body: 'No new items in the last 24 hours' };
    }

    for (const item of newItems.reverse()) {
        await axios.post(process.env.SLACK_WEBHOOK_URL, {
            text: `${item.title}\n${item.link}`
        });
    }

    return {
        statusCode: 200,
        body: `Sent ${newItems.length} updates`
    };
};