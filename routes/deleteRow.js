var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/', function (req, res, next) {
  text = ''
  text+=`<!DOCTYPE HTML>
    <html lang="pl">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Bootstrap demo</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.7/dist/umd/popper.min.js" integrity="sha384-zYPOMqeu1DAVkHiLqWBUTcbYfZ8osu1Nd6Z89ify25QV9guujx43ITvfi12/QExE" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.min.js" integrity="sha384-Y4oOpwW3duJdCWv5ly8SCFYWqFDsfob/3GkgExXKV4idmbt98QcxXYs9UoXAB7BZ" crossorigin="anonymous"></script></head><body>`
    text+=`<nav class="navbar bg-primary">
    <div class="container-fluid">
    <span class="navbar-brand mb-0 h1 text-white">Witaj na stronie deleteRow</span>
    </div>
    </nav>
    <div class="m-4">`
  const query = {
    text: 'DELETE FROM public.' + req.body.tableName + ' WHERE ' + req.body.columnName + ' = ' + req.body.toDelete + ';',
  };
  pool.query(query)
    .then((result) => {
  
      res.send(text+`<h3 class="text-primary">Rekord został usunięty.</h3>
      <form action="/showDB" method="POST">
      <button type="Submit" class="btn btn-secondary" name="db" value="` + req.body.tableName + `">Powrót</button>
      </form>
      </div>
      </body>
      </html>`)
    })
    .catch((error) => {
      res.send(text+"NIE udało się usunąć" + error+"</div></body></html>");
    });
});

module.exports = router;
