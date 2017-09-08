const hasAllSides = sides => sides.top && sides.bottom && sides.left && sides.right;

module.exports = function joinSides(sides) {
    if (hasAllSides(sides)) {
        const values = [sides.top];

        if (sides.top !== sides.bottom) {
            values[2] = sides.bottom;
        }
        if (sides.left !== sides.right) {
            values[2] = sides.bottom;
            values[3] = sides.left;
        }
        if (sides.right !== sides.top) {
            values[1] = sides.right;
        }

        return values.join(' ');
    }
    return false;
};

