const algoliasearch = require('algoliasearch');

const client = algoliasearch('7US0C5AKLU', '0ff92ba3000c69672407b95ac47513f6');
const index = client.initIndex('posts');

export function searchRequest(query, page = 0, pageSize = 0) {

  index.search({
    query: query,
    page: page,
    hitsPerPage: pageSize
  }, (err, {hits, nbHits} ={}) => {

    return {err, hits, nbHits}
  })
}

