const Parser = require('rss-parser');
const parser = new Parser();

require('dotenv').config();

module.exports.getFeed = async () => {
    const feed = await parser.parseURL(process.env.RSS_FEED_URL);

    return feed.items;
};