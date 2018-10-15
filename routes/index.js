var express = require('express');
var router = express.Router();
var rp = require('request-promise');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// var updateSiteInfo = () => {
//   var jwtToken = process.env.jwtToken;
//   var options = {
//     url: 'https://grm.6river.org/v1/Sites',
//     headers : {
//       'authorization': `Bearer ${jwtToken}` 
//     },
//     method: 'GET'
//   };
//   var options2 = {
//     url: 'https://grm.6river.org/v1/MfpConfigs',
//     headers : {
//       'authorization': `Bearer ${jwtToken}` 
//     },
//     method: 'GET'
//   };
//   rp(options, (e, r, body) => {
//     console.log('Getting Sites from GRM:');
//     console.log('error:', e);
//     console.log('statusCode:', r && r.statusCode);
//     globalSites = parseSites(body);
//   }).then(rp(options2, (e, r, body) => {
//     console.log('Getting MFPs from GRM:');
//     console.log('error:', e);
//     console.log('statusCode:', r && r.statusCode);
//     sortedChucks = parseChucks(body);
//   }));
// }

// updateSiteInfo();
// var requestLoop = setInterval(updateSiteInfo, 600000);


module.exports = router;
