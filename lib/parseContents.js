const Vertex = require('./Vertex');

module.exports = function parseContents(contents) {
    let slopes = [];
    let args = new Set();

    contents
        .replace(/\s+/g, ' ')
        .replace(/\s?,\s?/g, ',')
        .replace(/^[\s,]+|[\s,]+$/g, '')
        .split(',')
        .forEach(part => {
            const pieces = part.split(' ');
            // if it is a number, add it to the slopes
            if (Vertex.isVertex(pieces)) {
                slopes.push(new Vertex(pieces));
            } else {
                args = new Set(pieces);
            }
        });

    slopes = slopes.sort((a, b) => {
        if (a.breakpoint.value === b.breakpoint.value) {
            return 0;
        }
        if (a.breakpoint > b.breakpoint) {
            return 1;
        }
        return -1;
    });

    return { slopes, args };
};
