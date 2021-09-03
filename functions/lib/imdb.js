const _ = require('lodash');
const axios = require('axios').default;

const apiKey = process.env.API_KEY;

async function getSeries(id) {
  try {
    const response = await axios.get(`http://www.omdbapi.com/?i=${id}&type=series&apikey=${apiKey}`);
    return response.data;
  } catch(error) {
    return {
      error,
    }
  }
}

async function getSeasons(id, limit) {
  const operations = [];
  for (let i = 1; i <= limit; i++) {
    operations.push(axios.get(`http://www.omdbapi.com/?i=${id}&type=series&Season=${i}&apikey=${apiKey}`));
  }

  try {
    const responses = await axios.all(operations);
    return _.map(responses, 'data');
  } catch(error) {
    return {
      error,
    }
  }
}

module.exports = {
  getSeries,
  getSeasons,
};
