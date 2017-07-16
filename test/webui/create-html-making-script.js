var fs = require('fs');
var basePath = '';//'../../';
var scriptdir = basePath + 'build/test/webui/';
var scriptname = scriptdir + 'makeHTML.js';
var srcname = basePath + 'webui/playground.html';
var cheerio = require('cheerio');
var mkdirp = require('mkdirp');
mkdirp.sync(scriptdir);

var $ = cheerio.load(fs.readFileSync(srcname, 'utf8'));
var body = $('body');
var escapedBody = body.html().replace(/'/g,"\\'").replace(/\n/g,"\\n");
fs.writeFileSync(
    scriptname,
    "document.body.innerHTML='"
        + escapedBody +
    "'",
    'utf8'
);
//console.log(escapedBody);
