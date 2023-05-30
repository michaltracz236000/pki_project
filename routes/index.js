var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  text=''
  const query = {
    text: 'SELECT current_database()',
  };
  pool.query(query)
  .then((result) => {
    text+='<!DOCTYPE HTML><html lang="pl"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Bootstrap demo</title><link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous"><script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.7/dist/umd/popper.min.js" integrity="sha384-zYPOMqeu1DAVkHiLqWBUTcbYfZ8osu1Nd6Z89ify25QV9guujx43ITvfi12/QExE" crossorigin="anonymous"></script><script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.min.js" integrity="sha384-Y4oOpwW3duJdCWv5ly8SCFYWqFDsfob/3GkgExXKV4idmbt98QcxXYs9UoXAB7BZ" crossorigin="anonymous"></script></head><body>'
    text+='<nav class="navbar bg-primary"><div class="container-fluid"><span class="navbar-brand mb-0 h1 text-white">Witaj na stronie index</span></div></nav><div class="m-4"><h3>Baza danych: </h3><h3 class="text-primary">'+ result.rows[0].current_database +"</h3><br>"
    const query1 = {
      text: `SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE'`,
    };
    pool.query(query1)
    .then((result1) => {
      for (let row of result1.rows) {
        text+='<h4>Tabela: </h4><h4 class="text-primary">'+row.table_name+'</h4><form action="/showDB" method="POST"><button class="btn btn-primary" type="Submit" name="db" value="'+row.table_name+'">Pokaż zawartość tabeli</button></form><br>'
      }
      var query = "";
      if(req.query.query!=undefined)
        query=req.query.query;
      text+='<h4> Input do zapytań SQL</h4><form action="/query" method="POST"><input type="textarea" name="query" value="'+query+'"/><br><br><button class="btn btn-primary" type="Submit">Wyślij</button></form>';
      
      res.send(text+'</div></body></html>');
    })
    .catch((error2) => {
      res.send("NIE dostałem2");
    });
    //res.send(result.rows[0].current_database);
  })
  .catch((error) => {
    res.send("NIE dostałem1");
  });
});

module.exports = router;
