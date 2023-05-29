var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/', function(req, res, next) {
  if (req.body.query != undefined) {
    pool.query(req.body.query)
        .then((result) => {
            console.log(req.body.query);
            let tableHTML = '<table>';
            tableHTML += '<tr>';
            Object.keys(result.rows[0]).forEach(key => {
                tableHTML += `<th>${key}</th>`;
            });
            
            tableHTML += '</tr>';
            result.rows.forEach(row => {
                tableHTML += '<tr>';
                Object.values(row).forEach(value => {
                    tableHTML += `<td>${value}</td>`;
                });
                tableHTML += '</tr>';
            });
            tableHTML += '</table>';
            text = tableHTML
            text += '<form method="GET" action="/"><button type="submit" name="query" value="' + req.body.query + '">Powrót do strony głównej</button></form>'
            res.send(text);
        })
        .catch((error) => {
            text = ""
            text += error + '<form method="GET" action="/"><button type="submit" name="query" value="' + req.body.query + '">Powrót do strony głównej</button></form>'
            res.send(text);
        });
}
else
{
  res.send("BRAK DANYCH");
}
});

module.exports = router;
