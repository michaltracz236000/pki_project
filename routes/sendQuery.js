var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/', function (req, res, next) {
  text = ''
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
        var text = `INSERT INTO public.` + req.body.tableName + `(`
        i = 0;
        while (i < values1.length) {
          if (values1[i] == 'integer') {
            if (i + 4 == values1.length) {
              if (values1[i + 3] == null) {
                text += values1[i + 1] + ''
              }
            }
            else {
              if (values1[i + 3] == null) {
                text += values1[i + 1] + ', '
              }
            }
          }
          else {
            if (i + 4 == values1.length)
            {
              text += values1[i + 1] + ' '
            }
            else
            {
              text += values1[i + 1] + ', '
            }
          }
          i += 4;
        }
        text += `) VALUES (`;
        i = 0;
        while (i < values1.length) {
          if (values1[i] == 'integer') {
            if (i + 4 == values1.length) {
              if (values1[i + 3] == null) {
                text += values1[i + 2] + ''
              }
            }
            else {
              if (values1[i + 3] == null) {
                text += values1[i + 2] + ', '
              }
            }
          }
          else {
            if (i + 4 == values1.length)
            {
              text += `'`+values1[i + 2] + `' `
            }
            else
            {
              text += `'`+values1[i + 2] + `', `
            }
          }
          i += 4;
        }
        text += `);`;
        const query1 = {
          text: text,
        };
        pool.query(query1)
          .then((result1) => {

            res.send('UDAŁO SIĘ<br><form action="/showDB" method="POST"><button type="Submit" name="db" value="' + req.body.tableName + '">Powrót</button></form>')
          })
          .catch((error1) => {
            res.send("NIE udało się edytować 2 " + error1);
          });
      }
      else {
        var text = `UPDATE public.` + req.body.tableName + ` SET `
        i = 0;
        while (i < values1.length) {
          if (values1[i] == 'integer') {
            if (i + 4 == values1.length) {
              text += values1[i + 1] + `=` + values1[i + 2] + ` `
            }
            else {
              text += values1[i + 1] + `=` + values1[i + 2] + `, `
            }
          }
          else {
            if (i + 4 == values1.length) {
              text += values1[i + 1] + `='` + values1[i + 2] + `' `
            }
            else {
              text += values1[i + 1] + `='` + values1[i + 2] + `', `
            }
          }
          i += 4;
        }
        text += `WHERE ` + values1[1] + `=` + values1[2] + `;`;
        const query1 = {
          text: text,
        };
        pool.query(query1)
          .then((result1) => {

            res.send('UDAŁO SIĘ<br><form action="/showDB" method="POST"><button type="Submit" name="db" value="' + req.body.tableName + '">Powrót</button></form>')
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
