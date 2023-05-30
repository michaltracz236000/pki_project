var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/', function (req, res, next) {
  if (req.body.query != undefined) {
    textQuery=req.body.query
    if(req.body.sortBy!=undefined)
    {
      textQuery+=' ORDER BY '+req.body.sortBy+' '+req.body.order
    }
    const query1 = {
      text: textQuery
    };
    pool.query(query1)
      .then((result) => {
        if(textQuery.trim().split(" ")[0].toLowerCase()==="select")
        {
          let tableHTML = '<table>';
          tableHTML += '<tr>';
          Object.keys(result.rows[0]).forEach(key => {
            tableHTML += `<th>${key}</th>`;
          });
  
          tableHTML += '</tr>';
          result.rows.forEach(row => {
            tableHTML += '<tr>';
            Object.values(row).forEach(value => {
              tableHTML += `<td>${value}</td>`;
            });
            tableHTML += '</tr>';
          });
          tableHTML += '</table>';
          text = tableHTML
          text += `<form action="/query" method="POST"><select id="sortBy" name="sortBy">`
          Object.keys(result.rows[0]).forEach(key => {
            if (req.body.sortBy == key) {
              text += `<option value="` + key + `" selected>` + key + `</option>`
            }
            else
            {
              text += `<option value="` + key + `">` + key + `</option>`
            }
          });
          text += `</select><select id="order" name="order"><option value="ASC">Rosnąco</option>`
          if (req.body.order == 'DESC') {
            text += '<option value="DESC" selected>Malejąco</option>'
          }
          else {
            text += '<option value="DESC">Malejąco</option>'
          }
          text += `</select><button type="submit" name="query" value="` + req.body.query + `">Sortuj</button></form>`
          text += '<form method="GET" action="/"><button type="submit" name="query" value="' + req.body.query + '">Powrót do strony głównej</button></form>'
          res.send(text);
        }
        else
        {
          res.send(result);
        }
      })
      .catch((error) => {
        text = ""
        text += error + '<form method="GET" action="/"><button type="submit" name="query" value="' + req.body.query + '">Powrót do strony głównej</button></form>'
        res.send(text);
      });
  }
  else {
    res.send("BRAK DANYCH");
  }
});

module.exports = router;
