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
                let tableHTML = '<table>';
                tableHTML += '<tr>';
                Object.keys(result.rows[0]).forEach(key => {
                    tableHTML += `<th>${key}</th>`;
                });
                tableHTML+=`<th>edit</th>`
                tableHTML += '</tr>';
                result.rows.forEach(row => {
                    tableHTML += '<tr>';
                    Object.values(row).forEach(value => {
                        tableHTML += `<td>${value}</td>`;
                    });
                    tableHTML +=`<td><form method="POST" action="/editRow"><button type="submit" value="`+Object.values(row)[0]+`" name="toDelete">EDIT</button><input type="hidden" name="tableName" value="`+req.body.db+`" /><input type="hidden" name="columnName" value="`+Object.keys(result.rows[0])[0]+`" /></form></td>`
                    tableHTML +=`<td><form method="POST" action="/deleteRow"><button type="submit" value="`+Object.values(row)[0]+`" name="toDelete">DELETE</button><input type="hidden" name="tableName" value="`+req.body.db+`" /><input type="hidden" name="columnName" value="`+Object.keys(result.rows[0])[0]+`" /></form></td>`
                    tableHTML += '</tr>';
                });
                tableHTML += '</table>';
                text = tableHTML
                text +='<form method="GET" action="/"><button type="submit">Powrót do strony głównej</button></form>'
                text +='<form method="POST" action="/addRow"><button type="submit">Dodaj nowy wiersz</button></form>'
                res.send(text);
            })
            .catch((error) => {
                res.send("NIE dostałem1");
            });
    }
    else {
        res.send("BRAK DANYCH");
    }
});

module.exports = router;