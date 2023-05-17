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
    text+='DB: '+ result.rows[0].current_database +"<br>"
    const query1 = {
      text: `SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE'`,
    };
    pool.query(query1)
    .then((result1) => {
      console.log(result1.rows);
      for (let row of result1.rows) {
        text+="Table: "+row.table_name+"<br>"
      }
      res.send(text);
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
