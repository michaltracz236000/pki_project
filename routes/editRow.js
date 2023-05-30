var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('editRow');
});

router.post('/', function (req, res, next) {
  text = ''
  text='<!DOCTYPE HTML><html lang="pl"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Bootstrap demo</title><link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous"><script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.7/dist/umd/popper.min.js" integrity="sha384-zYPOMqeu1DAVkHiLqWBUTcbYfZ8osu1Nd6Z89ify25QV9guujx43ITvfi12/QExE" crossorigin="anonymous"></script><script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.min.js" integrity="sha384-Y4oOpwW3duJdCWv5ly8SCFYWqFDsfob/3GkgExXKV4idmbt98QcxXYs9UoXAB7BZ" crossorigin="anonymous"></script></head><body>'
  text+='<nav class="navbar bg-primary"><div class="container-fluid"><span class="navbar-brand mb-0 h1 text-white">Witaj na stronie editRow</span></div></nav><div class="m-4">'
  const query = {
    text: `SELECT * FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '` + req.body.tableName + `'`,
  };
  pool.query(query)
    .then((result) => {
      const query1 = {
        text: 'SELECT * FROM public.' + req.body.tableName + ' WHERE ' + req.body.columnName + ' = ' + req.body.toEdit + ';',
      };
      pool.query(query1)
        .then((result1) => {
          text += '<form action="/sendQuery" method="POST">'
          var i = 0;
          console.log(result1);
          while (i < result.rows.length) {
            if (Object.values(result.rows[i])[7] == 'integer') {
              if (Object.values(result.rows[i])[5] != null) {
                text +='<h4 class="text-primary">'+ Object.values(result.rows[i])[3] + '</h4><input class="form-control rounded bg-light" style="max-width: 400px;" type="number" name="' + Object.values(result.rows[i])[3] + '" value="' + Object.values(result1.rows[0])[i] + '" readonly/><br><br>'
              }
              else {
                text +='<h4 class="text-primary">'+ Object.values(result.rows[i])[3] + '</h4><input class="form-control rounded bg-light" style="max-width: 400px;" type="number" name="' + Object.values(result.rows[i])[3] + '" value="' + Object.values(result1.rows[0])[i] + '" /><br><br>'
              }
            }
            else {
              text +='<h4 class="text-primary">'+ Object.values(result.rows[i])[3] + '</h4><input class="form-control rounded bg-light" style="max-width: 400px;" type="text" name="' + Object.values(result.rows[i])[3] + '" value="' + Object.values(result1.rows[0])[i] + '" /><br><br>'
            }
            i += 1;
          }
          text+='<input type="hidden" name="type" value="edit" /><button class="btn btn-primary" type="Submit" name="tableName" value="' + req.body.tableName + '">Zapisz</button></form>'
          res.send(text+"</div></body></html>")
        })
        .catch((error1) => {
          res.send("NIE udało się edytować" + error1);
        });
    })
    .catch((error) => {
      res.send("NIE udało się edytować" + error);
    });
  //res.send(req.body.toEdit+"<br>"+req.body.tableName);
});

module.exports = router;
//Pobranie danych o kolumnach oraz pobranie danych dla danego rekordu w edit