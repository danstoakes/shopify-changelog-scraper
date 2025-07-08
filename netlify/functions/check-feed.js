const fs = require('fs');
const path = require('path');
const { getFeed } = require('../../helpers/rss');
const axios = require('axios');

require('dotenv').config();

const SEEN_FILE = path.resolve(__dirname, '../../tracked-updates.json');

exports.handler = async () => {
    const seen = JSON.parse(fs.readFileSync(SEEN_FILE, 'utf8'));
    const feedItems = await getFeed();

    const newItems = feedItems.filter(item => new Date(item.pubDate) > new Date(seen.lastSeen));

    if (newItems.length === 0) {
        return { statusCode: 200, body: 'No new items' };
    }

    for (const item of newItems.reverse()) {
        // await axios.post(process.env.SLACK_WEBHOOK_URL, {
        //     text: `🆕 *${item.title}*\n${item.link}`
        // });

        // await axios.post(process.env.DISCORD_WEBHOOK_URL, {
        //     content: `🆕 ${item.title}\n${item.link}`
        // });

        // await axios.post(process.env.SENDGRID_API_URL, {
        //     personalizations: [{ to: [{ email: process.env.SENDGRID_FROM_EMAIL }] }],
        //     from: { email: process.env.SENDGRID_TO_EMAIL },
        //     subject: `New Shopify Changelog: ${item.title}`,
        //     content: [{ type: 'text/plain', value: `${item.link}` }]
        // }, {
        //     headers: {
        //         Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
        //         'Content-Type': 'application/json',
        //     }
        // });
        console.log(`🆕 ${item.title}\n${item.link}`);
    }

    fs.writeFileSync(SEEN_FILE, JSON.stringify({ lastSeen: newItems[0].pubDate }, null, 2));

    return {
        statusCode: 200,
        body: `Sent ${newItems.length} updates`
    };
};