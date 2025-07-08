const fs = require('fs');
const path = require('path');
const { getFeed } = require('../../helpers/rss');
const axios = require('axios');

require('dotenv').config();

const SEEN_FILE = path.join(process.cwd(), 'tracked-updates.json');

exports.handler = async () => {
    const seen = JSON.parse(fs.readFileSync(SEEN_FILE, 'utf8'));
    const feedItems = await getFeed();

    const newItems = feedItems.filter(item => new Date(item.pubDate) > new Date(seen.lastSeenPubDate));

    if (newItems.length === 0) {
        return { statusCode: 200, body: 'No new items' };
    }

    for (const item of newItems.reverse()) {
        await axios.post(process.env.SLACK_WEBHOOK_URL, {
            text: `${item.title}\n${item.link}`
        });
    }

    fs.writeFileSync(SEEN_FILE, JSON.stringify({ lastSeenPubDate: newItems[newItems.length - 1].pubDate }, null, 2));

    return {
        statusCode: 200,
        body: `Sent ${newItems.length} updates`
    };
};