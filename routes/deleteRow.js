var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/', function (req, res, next) {
  // res.send(req.body.toDelete+"<br>"+req.body.tableName+"<br>"+req.body.columnName);
  text = ''
  const query = {
    text: 'DELETE FROM public.' + req.body.tableName + ' WHERE '+req.body.columnName+' = ' + req.body.toDelete+';',
  };
  pool.query(query)
    .then((result) => {
      res.send('Rekord został usunięty.<br><form action="/showDB" method="POST"><button type="Submit" name="db" value="' + req.body.tableName + '">Powrót</button></form>')
    })
    .catch((error) => {
      res.send("NIE udało się usunąć"+error);
    });


  
});

module.exports = router;
