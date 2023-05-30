var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/', function (req, res, next) {
  if (req.body.query != undefined) {
    text=''
    text+='<!DOCTYPE HTML><html lang="pl"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Bootstrap demo</title><link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous"><script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.7/dist/umd/popper.min.js" integrity="sha384-zYPOMqeu1DAVkHiLqWBUTcbYfZ8osu1Nd6Z89ify25QV9guujx43ITvfi12/QExE" crossorigin="anonymous"></script><script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.min.js" integrity="sha384-Y4oOpwW3duJdCWv5ly8SCFYWqFDsfob/3GkgExXKV4idmbt98QcxXYs9UoXAB7BZ" crossorigin="anonymous"></script></head><body>'
  text+='<nav class="navbar bg-primary"><div class="container-fluid"><span class="navbar-brand mb-0 h1">Witaj na stronie sendQuery</span></div></nav><div class="m-4">'
    textQuery = req.body.query
    if (textQuery.trim().split(" ")[0].toLowerCase() === "select") {
      const fromIndex = textQuery.indexOf("FROM") + 5;
      const spaceIndex = textQuery.indexOf(" ", fromIndex);
      const tableName = textQuery.substring(fromIndex, spaceIndex !== -1 ? spaceIndex : undefined);
      const query2 = {
        text: `SELECT * FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '` + tableName + `'`,
      };

      pool.query(query2)
        .then((result2) => {
          i = 0;
          var isToShow = false;
          textToShow = ''
          poles = result2.rows.map(row => row.column_name)
          data_type = result2.rows.map(row => row.data_type)
          while (i < poles.length) {
            if (req.body[poles[i]]) {
              if (data_type[i] == 'integer') {
                isToShow = true;
                textToShow += poles[i] + req.body[poles[i] + '_select'] + '' + req.body[poles[i]] + ', '
              }
              else {
                isToShow = true;
                textToShow += poles[i] + `='` + req.body[poles[i]] + `', `
              }

            }
            i += 1;
          }
          if (isToShow) {
            textToShow = " WHERE " + textToShow.slice(0, -2);
          }
          if (isToShow) {
            textQuery += textToShow
          }

          if (req.body.sortBy != undefined) {
            textQuery += ' ORDER BY ' + req.body.sortBy + ' ' + req.body.order
          }
          const query = {
            text: textQuery
          };
          pool.query(query)
            .then((result) => {
              if (textQuery.trim().split(" ")[0].toLowerCase() === "select") {
                const fromIndex = textQuery.indexOf("FROM") + 5;
                const spaceIndex = textQuery.indexOf(" ", fromIndex);
                const tableName = textQuery.substring(fromIndex, spaceIndex !== -1 ? spaceIndex : undefined);
                let tableHTML = '<table>';
                tableHTML += '<tr>';
                Object.keys(result.rows[0]).forEach(key => {
                  tableHTML += `<th>${key}</th>`;
                });
                tableHTML += '<th>FILTRUJ</th></tr>';
                const query1 = {
                  text: `SELECT * FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '` + tableName + `'`,
                };
                pool.query(query1)
                  .then((result1) => {

                    tableHTML += '</tr>';
                    result.rows.forEach(row => {
                      tableHTML += '<tr>';
                      Object.values(row).forEach(value => {
                        tableHTML += `<td>${value}</td>`;
                      });

                    });
                    tableHTML += '<tr><form method="POST" action="/query">'
                    i = 0;
                    while (i < result1.rows.length) {
                      if ('integer' == Object.values(result1.rows[i])[7]) {
                        tableHTML += `<td><select name="` + Object.values(result1.rows[i])[3] + `_select"><option value=">">></option><option value="<"><</option><option value="=">=</option></select><input type="number" name="` + Object.values(result1.rows[i])[3] + `"/>${Object.values(result1.rows[i])[3]}</td>`
                      }
                      else {
                        tableHTML += `<td><input type="text" name="` + Object.values(result1.rows[i])[3] + `"/>${Object.values(result1.rows[i])[3]}</td>`
                      }

                      i += 1;
                    }

                    tableHTML += `<td><button type="submit" name="query" value="` + req.body.query + `">Filtruj</button></td></form></tr></table>`;

                    text += tableHTML
                    text += `<form action="/query" method="POST"><select id="sortBy" name="sortBy">`
                    Object.keys(result.rows[0]).forEach(key => {
                      if (req.body.sortBy == key) {
                        text += `<option value="` + key + `" selected>` + key + `</option>`
                      }
                      else {
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
                    res.send(text+"</div></body></html>");


                  })
                  .catch((error) => {
                    text = ""
                    text += error + '<form method="GET" action="/"><button type="submit" name="query" value="' + req.body.query + '">Powrót do strony głównej</button></form>'
                    res.send(text);
                  });
              }
              else {
                res.send(result);
              }
            })
            .catch((error) => {
              text = ""
              text += error + '<form method="GET" action="/"><button type="submit" name="query" value="' + req.body.query + '">Powrót do strony głównej</button></form>'
              res.send(text);
            });
        })
        .catch((error2) => {

          res.send("NIE dostałem2" + error2);
        });
    }

  }
  else {
    res.send("BRAK DANYCH");
  }
});

module.exports = router;
//TODO CO INNEGO DLA BLEDU