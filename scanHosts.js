const util = require('util');
const nmap = require('libnmap');
const yargs = require('yargs');
const fs = require('fs');

// Parameter setup stuff
const argv = yargs
  .option('ip-file', {
    alias: 'i',
    description: 'Specifies file with IP address (1 per line)',
    type: 'string',
  })
  .option('cache-file', {
    alias: 'o',
    description: 'Specifies the JSON file to cache the data in',
    type: 'string',
  })
  .help()
  .alias('help', 'h')
  .argv;

const options = {};

// Parse Params & read in source files
if (argv["ip-file"]) {
  options.ipFile = argv["ip-file"];
  console.log(`Using IP list from : ${options.ipFile}`)
  try {
    let rawdata = fs.readFileSync(options.ipFile, 'utf8');
    options.ipList = rawdata.split('\n').filter(a => a != '');
    console.log(options.ipList)
  } catch (err) {
    console.log(err);
  }
} else {
    console.log('No hosts or addresses to scan')
    return;
}

if (argv["cache-file"]) {
  options.cacheFile = argv["cache-file"];
  console.log(`Using Cache file : ${options.cacheFile}`)
  try {
    const rawdata = fs.readFileSync(options.cacheFile);
    console.log(Object.keys(JSON.parse(rawdata)).length, ' addresses in cache')
    options.hostCache = (JSON.parse(rawdata));
  } catch (err){
    // console.log(err);
    console.log('cache file doesnt exist, will create it.');
    options.hostCache = {};
  }
} else {
  console.log('No cache file specified, outputting to console');
}



  // Now do the query
 (async () => {
     if (!options.ipList) {
         console.log('No hosts or addresses to scan')
         return;
     }

    const opts = {
        range: options.ipList
      };
       
    nmap.scan(opts, function(err, report) {
        if (err) throw new Error(err);
    
        for (let item in report) {
            options.hostCache[item] = report[item];
            console.log(JSON.stringify(report[item], null, 2));
        }
        fs.writeFileSync(options.cacheFile, JSON.stringify(options.hostCache, null, 2));
    });  
  })()