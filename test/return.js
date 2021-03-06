var test = require('tape');
var unpack = require('../');
var pack = require('browser-pack');
var concat = require('concat-stream');
var vm = require('vm');

var fs = require('fs');
var src = fs.readFileSync(__dirname + '/files/return.js', 'utf8');

test('return', function (t) {
    t.plan(1);
    
    var p = pack({ raw: true });
    p.pipe(concat(function (body) {
        var log = function (msg) {
            t.equal(msg, 'whatever');
        };
        var c = { console: { log: log } };
        vm.runInNewContext(body.toString('utf8'), c);
    }));
    
    var rows = unpack(src);
    rows.forEach(function (row) { p.write(row) });
    p.end();
});
