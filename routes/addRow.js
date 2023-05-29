var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('addRow');
});

router.post('/', function(req, res, next) {
  text = ''
  const query = {
    text: `SELECT * FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '` + req.body.tableName+`'`,
  };
  pool.query(query)
    .then((result) => {
      text=''
      var i=0;
      while(i<result.rows.length)
      {
        if(Object.values(result.rows[i])[7]=='integer')
        {
          if(Object.values(result.rows[i])[5]==null)
          {
            text+=Object.values(result.rows[i])[3]+'<br><input type="number" name="'+Object.values(result.rows[i])[3]+'" /><br><br>'
          }
        }
        else
        {
          text+=Object.values(result.rows[i])[3]+'<br><input type="text" name="'+Object.values(result.rows[i])[3]+'" /><br><br>'
        }
        i+=1;
      }
      res.send(text)
    })
    .catch((error) => {
      res.send("NIE udało się usunąć" + error);
    });
  //res.send(req.body.toEdit+"<br>"+req.body.tableName);
});

module.exports = router;
