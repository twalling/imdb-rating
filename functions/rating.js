require('dotenv').config();
const imdb = require('./lib/imdb');
const table = require('./lib/table');

function render(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'text/html',
    },
    body,
  }
}

module.exports.handler = async (event) => {
  if (!event.queryStringParameters || !event.queryStringParameters.id) {
    return render(500, 'missing ID');
  }

  const series = await imdb.getSeries(event.queryStringParameters.id);
  if (series.error) {
    return render(500, series.error.message);
  }

  const title = series.Title;
  const seasons = await imdb.getSeasons(series.imdbID, series.totalSeasons);
  if (seasons.error) {
    return render(500, seasons.error.message);
  }

  const heatmap = table.generate({
    title,
    seasons,
  });

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html',
    },
    body: heatmap,
  };
};