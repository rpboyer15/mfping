if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

var express = require('express');
var router = express.Router();
var rp = require('request-promise');
var ping = require('ping');

var site = process.env.SITE_ID;
var mfpConfigBody = "";
var hosts = [];

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

var updateSiteInfo = () => {
  var jwtToken = process.env.jwtToken;
  var options = {
    url: `https://grm.6river.org/v1/MfpConfigs?filter=%7B%22where%22%3A%7B%22siteId%22%3A%22${site}%22%7D%7D`,
    headers : {
      'authorization': `Bearer ${jwtToken}` 
    },
    method: 'GET'
  };
  rp(options, (e, r, body) => {
    console.log('Getting Sites from GRM:');
    console.log('error:', e);
    console.log('statusCode:', r && r.statusCode);
    mfpConfigBody = JSON.parse(body);

    var hostnames = [];
    var ztips = [];
    for (var i = 0; i < mfpConfigBody.length; i++) {
      hostnames.push(mfpConfigBody[i].name);
      var interfaces = mfpConfigBody[i].systemInfo.network;
      var ztInterface = interfaces[Object.keys(interfaces).find((interfaceName) => interfaceName.startsWith('zt'))];
      try {
        ztips.push(ztInterface[0].address);
      } catch (err) {
        ztips.push(undefined);
      }
    }
    var hostsSwp = [];
    for (var i = 0; i < hostnames.length; i++) {
      var obj = new Object;
      obj['hostname'] = hostnames[i];
      obj['zt'] = ztips[i];
      hostsSwp.push(obj);
    }
    hosts = hostsSwp;
    var f = pingMfps();
    console.log(f);
  });
}

var pingMfps = () => {
  var alive = 0;
  var dead = 0;
  hosts.forEach(function(host){
    ping.sys.probe(host.zt, function(isAlive){
      var msg = isAlive ? alive++ : dead++;
      //var msg = isAlive ? 'host ' + host.hostname + ' is alive' : 'host ' + host.hostname + ' is dead';
      //console.log(msg);
    });
  });
}


// var pingMfps = () => {
//   var alive = 0;
//   var dead = 0;
//   hosts.forEach(function(host){
//     ping.sys.probe(host.zt, function(isAlive){
//       var msg = isAlive ? alive++ : dead++;
//       //var msg = isAlive ? 'host ' + host.hostname + ' is alive' : 'host ' + host.hostname + ' is dead';
//       //console.log(msg);
//     });
//   });
// }

updateSiteInfo();
//var requestLoopPing = setInterval(pingMfps, 10000);
var requestLoopSite = setInterval(updateSiteInfo, 600000);


module.exports = router;
