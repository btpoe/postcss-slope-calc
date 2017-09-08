const fs = require('fs');
const postcss = require('postcss');

fs.readFile(__dirname + '/test-in.css', (err, css) => {
    postcss([ require('../index') ])
        .process(css, { from: 'test-in.css', to: 'test-out.css' })
        .then(result => {
            fs.writeFile(__dirname + '/test-out.css', result.css, () => {
                console.log('file written');
            });
        });
});
