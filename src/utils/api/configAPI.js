'use strict';

import fetchAPI from './fetchAPI.js'

const mockDataUrl = '/mockData/data.json';

export const getData = () => {
    return fetchAPI.get(mockDataUrl);
};