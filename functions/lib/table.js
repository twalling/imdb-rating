const hogan = require('hogan.js');

const backgroundColors = ['#1a9850','#66bd63','#a6d96a','#d9ef8b','#ffffbf','#fee08b','#fdae61','#f46d43','#d73027'];
const textColors = ['#eee','#fff','#333','#333','#333','#333','#333','#eee','#eee'];
const shades = backgroundColors.length;
const max = 9.2;
const min = 6.8;
const diff = max - min;
const range = Math.round((diff / shades) * 10) / 10;

function getColor(rating) {
  const distance = Math.min(Math.max(max - rating), diff);
  const index = Math.max(Math.floor(distance / range), 0);
  
  return {
    background: backgroundColors[index],
    text: textColors[index],
  };
}

const template = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>{{title}}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      body {
        min-height: 100vh;
        text-rendering: optimizeSpeed;
        line-height: 1;
        font-size: 12px;
        font-family: Helvetica, sans-serif;
        padding: 0;
        margin: 0;
      }

      h2 {
        font-size: 1.2em;
        text-align: center;
      }

      div {
        display: table;
      }

      table, th, td {
        border: 0;
      }

      table {
        border-collapse: separate;
        border-spacing: 5px;
      }

      th {
        background-color: #000;
        color: #fff;
      }

      th:first-child {
        background: none;
      }

      td, th {
        padding: 10px;
        text-align: center;
      }

      .parentCell{
        position: relative;
        cursor: pointer;
      }
    </style>
  </head>
  <body>
    <div>
      <h2>{{title}}</h2>
      <table>
        <tr>
        {{#headings}}
          <th>{{ . }}</th>
        {{/headings}}
        </tr>
        {{#rows}}
        <tr>
          {{#cols}}
            <td class="parentCell" style="background-color: {{background}};"><a href="https://www.imdb.com/title/{{id}}/" title="{{title}}" target="_blank" style="text-decoration: none; color: {{text}} !important;">{{rating}}</a></td>
          {{/cols}}
        </tr>
        {{/rows}}
      </table>
    </div>
  </body>
</html>
`;

const compiled = hogan.compile(template);

function generate(data) {
  const headings = [];
  const rows = [];

  headings.push('');
  data.seasons.forEach((season, i) => {
    headings.push(season.Season);
    season.Episodes.forEach((episode, j) => {
      rows[j] = rows[j] || {};
      rows[j].cols = rows[j].cols || [{rating: j+1, background: '#000', text: '#fff', title: '', id: ''}];
      
      let rating = episode.imdbRating !== 'N/A' ? parseFloat(episode.imdbRating, 10) : null;
      let color = {
        background: '#ccc',
        text: ''
      };
      if (rating) {
        color = getColor(rating);
      }
      
      rows[j].cols[i+1] = {
        rating,
        background: color.background,
        text: color.text,
        title: episode.Title,
        id: episode.imdbID,
      }
    }); 
  });
  return compiled.render({
    title: data.title,
    headings,
    rows,
  });
}

module.exports = {
  generate,
};
