function fetchAPI(url, options = {}) {
    options.credentials = 'same-origin';
    options.headers =  {
        ...(options.headers),
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
    };

    return fetch(url, options)
        .then(res => {
            if (!res.ok) {
                return res.json().then(text => Promise.reject(text));
            }
            return res.json()
        });
}

fetchAPI.get = (url, options) => {
    return fetchAPI(url, options);
};

fetchAPI.post = (url, body, options={}) => {
    return fetchAPI(url, {
        ...options,
        method: 'POST',
        body: JSON.stringify(body)
    });
};

fetchAPI.put = (url, body, options={}) => {
    return fetchAPI(url, {
        ...options,
        method: 'PUT',
        body: JSON.stringify(body)
    });
};

export default fetchAPI;