var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/', function (req, res, next) {
  text = ''
  text+='<!DOCTYPE HTML><html lang="pl"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Bootstrap demo</title><link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous"><script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.7/dist/umd/popper.min.js" integrity="sha384-zYPOMqeu1DAVkHiLqWBUTcbYfZ8osu1Nd6Z89ify25QV9guujx43ITvfi12/QExE" crossorigin="anonymous"></script><script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.min.js" integrity="sha384-Y4oOpwW3duJdCWv5ly8SCFYWqFDsfob/3GkgExXKV4idmbt98QcxXYs9UoXAB7BZ" crossorigin="anonymous"></script></head><body>'
  text+='<nav class="navbar bg-primary"><div class="container-fluid"><span class="navbar-brand mb-0 h1 text-white">Witaj na stronie sendQuery</span></div></nav><div class="m-4">'
  const query = {
    text: `SELECT * FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '` + req.body.tableName + `'`,
  };
  pool.query(query)
    .then((result) => {
      var i = 0, j = 0;
      var values1 = []
      while (i < result.rows.length) {
        values1[j] = Object.values(result.rows[i])[7];
        values1[j + 1] = Object.values(result.rows[i])[3];
        values1[j + 3] = Object.values(result.rows[i])[5];
        values1[j + 2] = req.body[values1[j + 1]]
        i += 1;
        j += 4;
      }
      //res.send("<br>"+values1)
      if (req.body.type == 'add') {
        var textQuery = `INSERT INTO public.` + req.body.tableName + `(`
        i = 0;
        while (i < values1.length) {
          if (values1[i] == 'integer') {
            if (i + 4 == values1.length) {
              if (values1[i + 3] == null) {
                textQuery += values1[i + 1] + ''
              }
            }
            else {
              if (values1[i + 3] == null) {
                textQuery += values1[i + 1] + ', '
              }
            }
          }
          else {
            if (i + 4 == values1.length)
            {
              textQuery += values1[i + 1] + ' '
            }
            else
            {
              textQuery += values1[i + 1] + ', '
            }
          }
          i += 4;
        }
        textQuery += `) VALUES (`;
        i = 0;
        while (i < values1.length) {
          if (values1[i] == 'integer') {
            if (i + 4 == values1.length) {
              if (values1[i + 3] == null) {
                textQuery += values1[i + 2] + ''
              }
            }
            else {
              if (values1[i + 3] == null) {
                textQuery += values1[i + 2] + ', '
              }
            }
          }
          else {
            if (i + 4 == values1.length)
            {
              textQuery += `'`+values1[i + 2] + `' `
            }
            else
            {
              textQuery += `'`+values1[i + 2] + `', `
            }
          }
          i += 4;
        }
        textQuery += `);`;
        const query1 = {
          text: textQuery,
        };
        pool.query(query1)
          .then((result1) => {

            res.send(text+'<h4 class="text-primary">UDAŁO SIĘ</h4><form action="/showDB" method="POST"><button type="Submit" name="db" value="' + req.body.tableName + '">Powrót</button></form></div></body></html>')
          })
          .catch((error1) => {
            res.send("NIE udało się edytować 2 " + error1);
          });
      }
      else {
        var textQuery = `UPDATE public.` + req.body.tableName + ` SET `
        i = 0;
        while (i < values1.length) {
          if (values1[i] == 'integer') {
            if (i + 4 == values1.length) {
              textQuery += values1[i + 1] + `=` + values1[i + 2] + ` `
            }
            else {
              textQuery += values1[i + 1] + `=` + values1[i + 2] + `, `
            }
          }
          else {
            if (i + 4 == values1.length) {
              textQuery += values1[i + 1] + `='` + values1[i + 2] + `' `
            }
            else {
              textQuery += values1[i + 1] + `='` + values1[i + 2] + `', `
            }
          }
          i += 4;
        }
        textQuery += `WHERE ` + values1[1] + `=` + values1[2] + `;`;
        const query1 = {
          text: textQuery,
        };
        pool.query(query1)
          .then((result1) => {

            res.send(text+'<h4 class="text-primary">UDAŁO SIĘ</h4><form action="/showDB" method="POST"><button type="Submit" name="db" class="btn btn-primary" value="' + req.body.tableName + '">Powrót</button></form></div></body></html>')
          })
          .catch((error1) => {
            res.send("NIE udało się edytować 2 " + error1);
          });
      }

    })
    .catch((error) => {
      res.send("NIE udało się edytować" + error);
    });
});
module.exports = router;
