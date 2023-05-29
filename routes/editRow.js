var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('editRow');
});

router.post('/', function (req, res, next) {
  text = ''
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
          text = ''
          var i = 0;
          console.log(result1);
          while (i < result.rows.length) {
            if (Object.values(result.rows[i])[7] == 'integer') {
              if (Object.values(result.rows[i])[5] != null) {
                text += Object.values(result.rows[i])[3] + '<br><input type="number" name="' + Object.values(result.rows[i])[3] + '" value="' + Object.values(result1.rows[0])[i] + '" readonly/><br><br>'
              }
              else {
                text += Object.values(result.rows[i])[3] + '<br><input type="number" name="' + Object.values(result.rows[i])[3] + '" value="' + Object.values(result1.rows[0])[i] + '" /><br><br>'
              }
            }
            else {
              text += Object.values(result.rows[i])[3] + '<br><input type="text" name="' + Object.values(result.rows[i])[3] + '" value="' + Object.values(result1.rows[0])[i] + '" /><br><br>'
            }
            i += 1;
          }
          res.send(text)
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