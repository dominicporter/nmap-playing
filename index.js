const nmap = require('libnmap');
const opts = {
  range: [
    'scanme.nmap.org',
  ]
};
 
nmap.scan(opts, function(err, report) {
  if (err) throw new Error(err);
 
  for (let item in report) {
    console.log(JSON.stringify(report[item], null, 2));
  }
});