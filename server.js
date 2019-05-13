
var express = require("express");
var bodyParser = require('body-parser');
// var mysql = require('mysql');
var { Client } = require("pg");
var app = express();
var forQuote, forAthName, forEditDate, forRef, forTest;

app.use( bodyParser.json() );
app.set('view engine', 'ejs');
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: false}));


var port = process.env.PORT || 8080


// var connection = mysql.createConnection({
//   host: "localhost",
//   user: "didi",
//   password: "",
//   database:"sampledb"
// });

// connection.connect(function(error) {
//   if(!!error) {
//     console.log('Error');
//   } else {
//     console.log('Connected')
//   }
// })

var client = new Client({
    host: 'ec2-23-23-92-204.compute-1.amazonaws.com',
    user: 'xvelocehkskyyb',
    password: '7551d44d8fbd95569508d646c24ae88cb2673229c91e404f66c420c1530f7c1a',
    database: 'd3qubtir22t6uq',
    port: 5432,
    ssl: true
  });



// Routes

app.get("/", function(req, resp){
    resp.sendFile(__dirname + '/index.html'); 
});


app.post("/", function(req, resp){
  resp.sendFile(__dirname + '/index.html'); 
});




app.post("/begin", function(req, resp) {

  client.connect((err, client, done) => {
  var squery = "SELECT quote_id FROM quote_table";
  var secSql = "SELECT quote, auth_name FROM  quote_table WHERE quote_id=$1";
  client.query(squery, function (err, resultat) {
    if (err) throw err;

    for(var i=0; i<resultat.rows.length; i++) {
      var len = resultat.rows.length;
        var nombre = Math.floor(Math.random() * Math.floor(len));
    };

    client.query(secSql, [nombre], function(err, tableau) {

      // console.log(tableau.rows);
      var obj = JSON.parse(JSON.stringify(tableau.rows));
      resp.render('beginningpage', {
          obj: obj,
          title:'beginningpage',
      });
      // console.log(obj[0].quote);
    });

  });
});

});



app.post("/add", function(req, resp) {
    resp.render('addquote');
});



app.post("/result", function(req, resp) {

    // connection.connect((err, client, done) => {
        forQuote = req.body.quote;
        forAthName = req.body.author_name;
        forEditDate = req.body.editing_date;
        forTop = req.body.topic;

    // console.log(forQuote);

    var sql = "INSERT INTO quote_table (quote, auth_name, edit_date, topics) VALUES ( $1, $2, $3, $4)";

    client.query(sql, [forQuote, forAthName, forEditDate, forTop], function (err, result, fields) {
        if (!!err) {
            console.log('error');
        } else {
          // console.log(result);
          resp.render('savedpage');
          // console.log(result);
        }      
      });
    // });
});







app.post('/check', function(req, resp) {
  
  // client.connect((err, client, done) => {
    var sql = "SELECT * FROM quote_table";
    client.query(sql, function (err, result) {
        if (err) {
            console.log('error');
        } else {
          var obj = JSON.parse(JSON.stringify(result.rows));

          // console.log(result)
            resp.render('checkquote', {
              obj: obj,
              title:'checkquote',
            });
          };
      });
    // });
    
});




app.get('/quote/:getId', function(req, resp) {
  var forId = req.params.getId;
  forTest = 6;
  client.connect((err, client, done) => {
    // console.log(forId);
  var thirdSql = "SELECT quote, auth_name, edit_date, topics FROM quote_table WHERE quote_id=$1";
  client.query(thirdSql, [forId],function (err, result) {
      // console.log(forTest)
      if (err) throw err;
      resp.send(result.rows);
      // console.log(result);  
    });
  });
});







app.get('/quotes/:get', function(req, resp) {
    var numb = parseInt(req.params.get, 10);

    client.connect((err, client, done) => {
    var sql = "SELECT * FROM quote_table LIMIT $1";
    client.query(sql, [numb], function (err, result) {
      if (err) throw err;
      resp.send(result.rows);
      // console.log("successfull");
    });
  });
});








app.get('/rand/:no', function(req, resp) {
  var numero = parseInt(req.params.no, 10);
  var tabl = [];

  client.connect((err, client, done) => {
  var sql = "SELECT quote_id FROM quote_table";
  var secSql = "SELECT quote, auth_name, edit_date, topic FROM  quote_table WHERE quote_id=$1";
  client.query(sql, function (err, result) {
    if (err) throw err;

    for(var i=0; i<result.length; i++) {
      tabl.push(result[i].quote_id);
      if(tabl.includes(numero) == false) {
        var nombre = Math.floor(Math.random() * Math.floor(tabl.length));
      };
    };

    client.query(secSql, [nombre], function(err, tableau) {
      resp.send(tableau);
    });

  });
});
});








// Server

app.listen(port, function() {
    console.log("Server is running !!")
})