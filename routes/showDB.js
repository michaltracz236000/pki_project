var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/', function (req, res, next) {
    if (req.body.db != undefined) {
        text = `<!DOCTYPE HTML>
        <html lang="pl">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Bootstrap demo</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous">
        <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.7/dist/umd/popper.min.js" integrity="sha384-zYPOMqeu1DAVkHiLqWBUTcbYfZ8osu1Nd6Z89ify25QV9guujx43ITvfi12/QExE" crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.min.js" integrity="sha384-Y4oOpwW3duJdCWv5ly8SCFYWqFDsfob/3GkgExXKV4idmbt98QcxXYs9UoXAB7BZ" crossorigin="anonymous"></script></head><body>`
                    text += `<nav class="navbar bg-primary">
        <div class="container-fluid">
        <span class="navbar-brand mb-0 h1 text-white">Witaj na stronie showDB</span>
        </div>
        </nav>
        <div class="m-4">`

        const query2 = {
            text: `SELECT * FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '` + req.body.db + `'`,
        };
        pool.query(query2)
            .then((result2) => {

                i = 0;
                var isToShow = false;
                textToShow = ''
                poles = result2.rows.map(row => row.column_name)
                data_type = result2.rows.map(row => row.data_type)
                while (i < poles.length) {
                    if (req.body[poles[i]]) {
                        if (data_type[i] == 'integer') {
                            isToShow = true;
                            textToShow += poles[i] + req.body[poles[i] + '_select'] + '' + req.body[poles[i]] + ', '
                        }
                        else {
                            isToShow = true;
                            textToShow += poles[i] + `='` + req.body[poles[i]] + `', `
                        }

                    }
                    i += 1;
                }
                if (isToShow) {
                    textToShow = " WHERE " + textToShow.slice(0, -2);
                }

                queryText = 'SELECT * FROM ' + req.body.db
                if (isToShow) {
                    queryText += textToShow
                }
                if (req.body.sortBy != undefined) {
                    queryText += ' ORDER BY ' + req.body.sortBy + ' ' + req.body.order
                }
                
                const query = {
                    text: queryText,
                };
                pool.query(query)
                    .then((result) => {
                        if (result.rows.length == 0) {
                            text = "BRAK DANYCH DO WYŚWIETLENIA"
                            text += '<form method="GET" action="/"><button type="submit">Powrót do strony głównej</button></form>'
                            res.send(text);
                        }
                        else {
                            let tableHTML = '<table class="table table-striped">';
                            tableHTML += '<tr>';
                            Object.keys(result.rows[0]).forEach(key => {
                                tableHTML += `<th scope="col">${key}</th>`;
                            });
                            tableHTML += `<th scope="col">edit</th>`
                            tableHTML += '</tr>';
                            result.rows.forEach(row => {
                                tableHTML += '<tr>';
                                Object.values(row).forEach(value => {
                                    tableHTML += `<td>${value}</td>`;
                                });
                                tableHTML += `<td><form method="POST" action="/editRow"><button type="submit" class="btn btn-primary" value="` + Object.values(row)[0] + `" name="toEdit">EDYTUJ</button><input type="hidden" name="tableName" value="` + req.body.db + `" /><input type="hidden" name="columnName" value="` + Object.keys(result.rows[0])[0] + `" /></form>`
                                tableHTML += `<form method="POST" action="/deleteRow"><button type="submit" class="btn btn-primary" value="` + Object.values(row)[0] + `" name="toDelete">USUŃ</button><input type="hidden" name="tableName" value="` + req.body.db + `" /><input type="hidden" name="columnName" value="` + Object.keys(result.rows[0])[0] + `" /></form></td>`
                                tableHTML += '</tr>';
                            });


                            const query1 = {
                                text: `SELECT * FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '` + req.body.db + `'`,
                            };
                            pool.query(query1)
                                .then((result1) => {
                                    tableHTML += '<tr><form method="POST" action="/showDB">'
                                    i = 0;
                                    while (i < result1.rows.length) {
                                        if ('integer' == Object.values(result1.rows[i])[7]) {
                                            tableHTML += `<td><input type="number" name="` + Object.values(result1.rows[i])[3] + `" class="form-control rounded"/><select name="` + Object.values(result1.rows[i])[3] + `_select" class="form-control rounded"><option value=">">></option><option value="<"><</option><option value="=">=</option></select></td>`
                                        }
                                        else {
                                            tableHTML += `<td><input type="text" name="` + Object.values(result1.rows[i])[3] + `" class="form-control rounded"/></td>`
                                        }

                                        i += 1;
                                    }

                                    tableHTML += '<td><button type="Submit" name="db" class="btn btn-info" value="' + req.body.db + '">Filtruj</button></td></form></tr>'
                                    tableHTML += '</table>';
                                    text += tableHTML
                                    text += '<form method="POST" action="/addRow"><input type="hidden" name="tableName" value="' + req.body.db + '" /><button type="submit" class="btn btn-primary">Dodaj nowy wiersz</button></form><br>'
                                    text += `<form action="/showDB" method="POST"><select class="form-control rounded" style="max-width: 400px;" id="sortBy" name="sortBy">`
                                    i = 0;
                                    while (i < result.rows.length) {
                                        if (req.body.sortBy == Object.values(result1.rows[i])[3]) {
                                            text += `<option value="` + Object.values(result1.rows[i])[3] + `" selected>` + Object.values(result1.rows[i])[3] + `</option>`
                                        }
                                        else {
                                            text += `<option value="` + Object.values(result1.rows[i])[3] + `">` + Object.values(result1.rows[i])[3] + `</option>`
                                        }

                                        i += 1;
                                    }
                                    text += '</select><select id="order" name="order" class="form-control rounded" style="max-width: 400px;"><option value="ASC">Rosnąco</option>'
                                    if (req.body.order == 'DESC') {
                                        text += '<option value="DESC" selected>Malejąco</option>'
                                    }
                                    else {
                                        text += '<option value="DESC">Malejąco</option>'
                                    }
                                    text += '</select><br><button class="btn btn-info" type="Submit" name="db" value="' + req.body.db + '">Sortuj</button></form><br>'
                                    text += '<form method="GET" action="/"><button type="submit" class="btn btn-secondary">Powrót do strony głównej</button></form>'
                                    res.send(text + '</div></body></html>');
                                })
                                .catch((error1) => {
                                    res.send("NIE dostałem3" + error1);
                                });
                        }
                    })
                    .catch((error) => {
                        res.send("NIE dostałem1 " + error);
                    });
            })
            .catch((error2) => {
                res.send("NIE dostałem2" + error2);
            });
    }
    else {
        res.send("BRAK DANYCH");
    }
});

module.exports = router;