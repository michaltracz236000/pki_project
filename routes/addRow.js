var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('addRow');
});

router.post('/', function(req, res, next) {
  text = ''
  text='<!DOCTYPE HTML><html lang="pl"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Bootstrap demo</title><link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous"><script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.7/dist/umd/popper.min.js" integrity="sha384-zYPOMqeu1DAVkHiLqWBUTcbYfZ8osu1Nd6Z89ify25QV9guujx43ITvfi12/QExE" crossorigin="anonymous"></script><script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.min.js" integrity="sha384-Y4oOpwW3duJdCWv5ly8SCFYWqFDsfob/3GkgExXKV4idmbt98QcxXYs9UoXAB7BZ" crossorigin="anonymous"></script></head><body>'
  text+='<nav class="navbar bg-primary"><div class="container-fluid"><span class="navbar-brand mb-0 h1 text-white">Witaj na stronie addRow</span></div></nav><div class="m-4">'
  const query = {
    text: `SELECT * FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '` + req.body.tableName+`'`,
  };
  pool.query(query)
    .then((result) => {
      text += '<form action="/sendQuery" method="POST">'
      var i=0;
      while(i<result.rows.length)
      {
        if(Object.values(result.rows[i])[7]=='integer')
        {
          if(Object.values(result.rows[i])[5]==null)
          {
            text+='<h4 class="text-primary">'+Object.values(result.rows[i])[3]+'</h4><input type="number" class="form-control rounded bg-light" style="max-width: 400px;" name="'+Object.values(result.rows[i])[3]+'" /><br><br>'
          }
        }
        else
        {
          text+='<h4 class="text-primary">'+Object.values(result.rows[i])[3]+'</h4><input type="text" class="form-control rounded bg-light" style="max-width: 400px;" name="'+Object.values(result.rows[i])[3]+'" /><br><br>'
        }
        i+=1;
      }
      text+='<input type="hidden" name="type" value="add" /><button type="Submit" name="tableName" class="btn btn-primary" value="' + req.body.tableName + '">Zapisz</button></form>'
      res.send(text+"</div></body></html>")
    })
    .catch((error) => {
      res.send("NIE udało się usunąć" + error);
    });
  //res.send(req.body.toEdit+"<br>"+req.body.tableName);
});

module.exports = router;
