
const
    CFG = require( 'ast-flow-graph' ),
    fs = require( 'fs' ),
    //./test/node_modules/shelljs/src/common.js
    //./test/node_modules/sizzle/dist/sizzle.js
    srcName = 'directpath'
    src = fs.readFileSync( './test/' + srcName + '.js', 'utf8' ),
    cfg = new CFG( src, {
        parser:    {
            loc:          true,
            range:        true,
            comment:      true,
            tokens:       true,
            ecmaVersion:  9,
            sourceType:   'module',
            ecmaFeatures: {
                impliedStrict: true,
                experimentalObjectRestSpread: true
            }
        }
    } );
cfg.generate();
console.log(cfg.toTable());
//console.log(cfg);
//console.log(cfg.cfgs[0].toTable());
//console.log(cfg.create_dot(cfg.cfgs[6]))


fs.writeFile('./dot_graphs/' + srcName + '.txt', cfg.create_dot(cfg.cfgs[4]), function (err) {
  if (err) throw err;
  console.log('Saved!');
});
