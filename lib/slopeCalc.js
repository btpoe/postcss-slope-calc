const parseContents = require('./parseContents');
const Tween = require('./Tween');
const Vertex = require('./Vertex');

function slopeCalc(slopes, args, stack = []) {
    let smallest = slopes[0];
    let secondSmallest = slopes[1];
    slopes.shift();

    let viewPortType = 'vw';
    if (args.has('vh')) {
        viewPortType = 'vh'
    } else if (args.has('vmin')) {
        viewPortType = 'vmin';
    } else if (args.has('vmax')) {
        viewPortType = 'vmax';
    }

    const tween = new Tween(smallest, secondSmallest, viewPortType);

    if (!args.has('media-query') || tween.minWidth === '0') {
        args.add('media-query');
        tween.minWidth = 0;
    }

    stack.push(tween);

    if (slopes.length > 1) {
        return slopeCalc(slopes, args, stack);
    }
    else if (args.has('clip')) {
        const clipSlope = new Vertex(slopes[0]);
        clipSlope.breakpoint += 1;
        args.delete('clip');
        return slopeCalc([slopes[0], clipSlope], args, stack);
    }

    return stack;
}

module.exports = function getStack(contents) {
    const { slopes, args } = parseContents(contents.match(/slope-calc\(([^)]+)\)/)[1]);
    return slopeCalc(slopes, args);
};
