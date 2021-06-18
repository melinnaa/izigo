const formatResponse = (item) => {
    return {
      id: item.id.toString(),
      text: item.text
    };
};

const searchTweetAPI = async (q) => {
	const baseTwitterSearchUrl = 'https://api.twitter.com/2/users/by/username/ligne3_ratp';
    const defaultFetchOptions = {
        headers: {
            'Authorization': `bearer AAAAAAAAAAAAAAAAAAAAABABQgEAAAAA9SXFVGSLYdYaBrn9jGFD6queSrY%3DV5KKLwEUJKio24ggY4JjnuRMTa33z5uWDhqKPQBTyCaazHjEkL`,
        },
    };

    try {
        const response = await fetch(`${baseTwitterSearchUrl}?query=T1_RATP&tweet.fields=created_at&expansions=author_id`, defaultFetchOptions, { mode: 'no-cors'}, { 'Access-Control-Allow-Origin' : "*"} )
        const json = await response.json();
	    return json.results.map(formatResponse);
    } catch (err) {
        console.log('err : ', err);
    }
}

export {searchTweetAPI}