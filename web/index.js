/**
 * Created by mingzhang on 11/8/17.
 */
'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();
app.use('/', express.static('http'));

app.listen('8000', () => {
  console.log('Listening on port 8000');
});


if (typeof module !== 'undefined' && module.parent) {
  //module.exports =
} else {

} 