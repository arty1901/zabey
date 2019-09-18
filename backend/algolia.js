const algoliasearch = require('algoliasearch');

const client = algoliasearch('7US0C5AKLU', '5dc7aa0e120f41ce971b56f3b6b772a7');
export const index = client.initIndex('posts');
