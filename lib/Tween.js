const Unit = require('./CSSUnit');

class Tween {
    constructor(from, to) {
        if (from.breakpoint > to.breakpoint) {
            [to, from] = [from, to];
        }

        this.value = from.size[Tween.options.unit];
        this.minWidth = from.breakpoint[Tween.options.mediaQueryUnit];

        if (from.size.value !== to.size.value && to.breakpoint.value !== from.breakpoint + 1) {
            const slope = new Unit((to.size - from.size) / (to.breakpoint - from.breakpoint));
            let yIntercept = new Unit(from.size - (from.breakpoint * slope));

            if (slope.value && yIntercept.value) {
                let operator = '+';
                if (yIntercept < 0) {
                    operator = '-';
                    yIntercept = new Unit(yIntercept * -1);
                }
                this.value = `calc(${slope.vw} ${operator} ${yIntercept[Tween.options.unit]})`;
            } else if (slope.value) {
                this.value = slope.vw;
            } else if (yIntercept.value) {
                this.value = yIntercept[Tween.options.unit];
            }
        }
    }
}

Tween.options = {
    unit: 'rem',
    mediaQueryUnit: 'em'
};

module.exports = Tween;
