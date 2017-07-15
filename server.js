'use strict';

var fs = require('fs');
var express = require('express');
var app = express();

if (!process.env.DISABLE_XORIGIN) {
  app.use(function(req, res, next) {
    var allowedOrigins = ['https://narrow-plane.gomix.me', 'https://www.freecodecamp.com'];
    var origin = req.headers.origin || '*';
    if (!process.env.XORIG_RESTRICT || allowedOrigins.indexOf(origin) > -1) {
      console.log(origin);
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    }
    next();
  });
}

app.use('/public', express.static(process.cwd() + '/public'));

app.route('/').get(function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
})

app.route('/:date').get(function(req, res) {
  let unix = "";
  let natural = "";

  console.log(req.params.date);
  if (/\d{10}/.test(req.params.date)) {
    var newDate = new Date(req.params.date * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = newDate.getFullYear();
    var month = months[newDate.getMonth()];
    var date = newDate.getDate();
    var hour = newDate.getHours();
    var min = newDate.getMinutes();
    var sec = newDate.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;

    unix = req.params.date
    natural = time
  } else if (/\w{3,9} \d{1,2},? \d{2,4}/.test(req.params.date)) {

    let dateParamsSplit = req.params.date.split(" ")
    let year = dateParamsSplit[2]
    let month = dateParamsSplit[1]
    let day =dateParamsSplit[0]
console.log(year, month, day);
    var newDate = new Date(`${year}.${month}.${day}`).getTime() / 1000

    unix = newDate
    natural = req.params.date
  }

  res.send({
    unix: unix,
    natural: natural
  })
  
});
// Respond not found to all the wrong routes
app.use(function(req, res, next) {
  res.status(404);
  res.type('txt').send('Not found');
});

// Error Middleware
app.use(function(err, req, res, next) {
  if (err) {
    res.status(err.status || 500).type('txt').send(err.message || 'SERVER ERROR');
  }
})

app.listen(process.env.PORT || 3000, function() {
  console.log('Node.js listening ...');
});
