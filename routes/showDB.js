var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/', function (req, res, next) {
    if (req.body.db != undefined) {
        text = ''
        const query = {
            text: 'SELECT * FROM ' + req.body.db,
        };
        pool.query(query)
            .then((result) => {
                console.log(result.rows);
                text = ""
                text += result.rows + '<form method="GET" action="/"><button type="submit">Powrót do strony głównej</button></form>'
                res.send(text);
            })
            .catch((error) => {
                res.send("NIE dostałem1");
            });
    }
    else if (req.body.query != undefined) {
        pool.query(req.body.query)
            .then((result) => {
                console.log(req.body.query);
                text = ""
                text += result.rows + '<form method="GET" action="/"><button type="submit" name="query" value="' + req.body.query + '">Powrót do strony głównej</button></form>'
                console.log(result);
                res.send(text);
            })
            .catch((error) => {
                text = ""
                text += error + '<form method="GET" action="/"><button type="submit" name="query" value="' + req.body.query + '">Powrót do strony głównej</button></form>'
                res.send(text);
            });
    }
    else {
        res.send("BRAK DANYCH");
    }
});

module.exports = router;