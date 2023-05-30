var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/', function (req, res, next) {
    if (req.body.db != undefined) {
        queryText='SELECT * FROM ' + req.body.db
        if(req.body.sortBy!=undefined)
        {
            queryText+=' ORDER BY '+req.body.sortBy+' '+req.body.order
        }
        text = ''
        const query = {
            text: queryText,
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
                    tableHTML +=`<td><form method="POST" action="/editRow"><button type="submit" value="`+Object.values(row)[0]+`" name="toEdit">EDIT</button><input type="hidden" name="tableName" value="`+req.body.db+`" /><input type="hidden" name="columnName" value="`+Object.keys(result.rows[0])[0]+`" /></form></td>`
                    tableHTML +=`<td><form method="POST" action="/deleteRow"><button type="submit" value="`+Object.values(row)[0]+`" name="toDelete">DELETE</button><input type="hidden" name="tableName" value="`+req.body.db+`" /><input type="hidden" name="columnName" value="`+Object.keys(result.rows[0])[0]+`" /></form></td>`
                    tableHTML += '</tr>';
                });
                tableHTML += '</table>';
                text = tableHTML
                text +='<form method="POST" action="/addRow"><input type="hidden" name="tableName" value="'+req.body.db+'" /><button type="submit">Dodaj nowy wiersz</button></form>'
                const query1 = {
                    text: `SELECT * FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '` + req.body.db + `'`,
                  };
                  pool.query(query1)
                    .then((result1) => {
                        text +=`<form action="/showDB" method="POST"><select id="sortBy" name="sortBy">`
                        i=0;
                        while(i<result.rows.length)
                        {
                            if(req.body.sortBy==Object.values(result1.rows[i])[3])
                            {
                                text+=`<option value="`+Object.values(result1.rows[i])[3]+`" selected>`+Object.values(result1.rows[i])[3]+`</option>`
                            }
                            else
                            {
                                text+=`<option value="`+Object.values(result1.rows[i])[3]+`">`+Object.values(result1.rows[i])[3]+`</option>`
                            }
                            
                            i+=1;
                        }

                        text+='</select><select id="order" name="order"><option value="ASC">Rosnąco</option>'
                        if(req.body.order=='DESC')
                        {
                            text+='<option value="DESC" selected>Malejąco</option>'
                        }
                        else
                        {
                            text+='<option value="DESC">Malejąco</option>'
                        }
                        text+='</select><button type="Submit" name="db" value="'+req.body.db+'">Sortuj</button></form><br>'
                        text +='<form method="GET" action="/"><button type="submit">Powrót do strony głównej</button></form>'
                        res.send(text);
                    })
                    .catch((error1) => {
                      res.send("NIE dostałem2" + error1);
                    });

                
                //res.send(text);
            })
            .catch((error) => {
                res.send("NIE dostałem1 "+error);
            });
    }
    else {
        res.send("BRAK DANYCH");
    }
});

module.exports = router;

//DODANIE Domyślego wyboru