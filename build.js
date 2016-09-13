var NwBuilder = require('nw-builder');
var Package = require('./package.json');

var nw = new NwBuilder({
    files: './app.nw/**/**', // use the glob format
    platforms: ['linux64', 'win64'],
    appName: Package.name,
    zip: false
});

//Log stuff you want

nw.on('log',  console.log);

// Build returns a promise
nw.build().then(function () {
   console.log('all done!');
}).catch(function (error) {
    console.error(error);
});
