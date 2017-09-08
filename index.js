const postcss = require('postcss');
const parseSides = require('parse-css-sides');
const { splitBySpaces } = require('css-list-helpers');
const joinSides = require('./lib/joinSides');
const getStack = require('./lib/slopeCalc');
const Tween = require('./lib/Tween');
const Unit = require('./lib/CSSUnit');

module.exports = postcss.plugin('slope_calc', (opts) => (
    css => {
        opts = opts || {};

        Object.assign(Tween.options, opts);
        Object.assign(Unit.options, opts);

        css.walkRules(rule => {
            let queryStack = {};

            rule.walkDecls(decl => {
                function evaluateDecl({ prop, value }) {
                    let baseVal = false;

                    getStack(value).forEach(({ value, minWidth }) => {
                        if (minWidth) {
                            if (!queryStack[minWidth]) {
                                queryStack[minWidth] = postcss.atRule({ name: 'media', params: `${opts.onlyScreen ? 'only screen and ' : ''}(min-width: ${minWidth})` });
                                queryStack[minWidth].append(postcss.rule({ selector: rule.selector }));
                            }
                            const atRule = queryStack[minWidth];
                            atRule.nodes[0].append(postcss.decl({ prop, value, important: decl.important }));
                        } else {
                            baseVal = value;
                        }
                    });

                    return baseVal;
                }

                if (decl.value.indexOf('slope-calc(') > -1) {
                    if (['margin', 'padding'].includes(decl.prop) && splitBySpaces(decl.value).length > 1) {
                        const values = parseSides(decl.value);
                        const v = {};

                        ['top', 'right', 'bottom', 'left'].forEach(side => {
                            v[side] = values[side];
                            if (values[side].indexOf('slope-calc(') > -1) {
                                v[side] = evaluateDecl({
                                    prop: `${decl.prop}-${side}`,
                                    value: values[side],
                                });
                            }
                        });

                        decl.value = joinSides(v);

                        if (!decl.value) {
                            ['top', 'right', 'bottom', 'left'].forEach(side => {
                                if (v[side]) {
                                    decl.after(postcss.decl({ prop: `${decl.prop}-${side}`, value: v[side], important: decl.important }));
                                }
                            });

                            decl.remove();
                        }
                    } else {
                        const value = evaluateDecl({
                            prop: decl.prop,
                            value: decl.value,
                        });

                        if (value) {
                            decl.value = decl.value.replace(decl.value.match(/(slope-calc\([^)]+\))/)[1], value);
                        } else {
                            decl.remove();
                        }
                    }
                }
            });

            Object.keys(queryStack).sort().reverse().forEach(key => {
                rule.after(queryStack[key]);
            });
        });
    }
));
