var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res, next) {
    if(req.body.db!= undefined)
    {
        text=''
  const query = {
    text: 'SELECT * FROM '+req.body.db,
  };
  pool.query(query)
  .then((result) => {
    console.log(result.rows);
    res.send(result.rows);
  })
  .catch((error) => {
    res.send("NIE dostałem1");
  });
    }
    else if(req.body.query!=undefined)
    {
        console.log(req.body.query);
        pool.query(req.body.query)
  .then((result) => {
    
    console.log(result);
    res.send(result);
  })
  .catch((error) => {
    res.send(error);
  });
    }
    else
    {
        res.send("BRAK DANYCH");
    }
});

module.exports = router;