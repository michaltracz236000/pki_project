var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res, next) {
    if(req.body.db!= undefined)
    {
        res.send("BAZA: "+req.body.db);
    }
    else if(req.body.query!=undefined)
    {
        res.send("QUERY: "+req.body.query);
    }
    else
    {
        res.send("BRAK DANYCH");
    }
});

module.exports = router;