const postcss = require('postcss');

function sortByKey(key) {
    return (a, b) => {
        if (a[key] > b[key]) {
            return 1;
        }
        if (a[key] < b[key]) {
            return -1;
        }
        return 0;
    }
}

class QueryStack {
    constructor(rule) {
        this.rule = rule;
        this.queries = [];
        this.keys = {};
    }

    add(viewPortType, minWidth, decl) {
        if (typeof this.keys[minWidth + viewPortType] === 'undefined') {
            let params = [];

            switch (viewPortType) {
                case 'vw':
                    params.push(`(min-width: ${minWidth})`);
                    break;
                case 'vh':
                    params.push(`(min-height: ${minWidth})`);
                    break;
                case 'vmin':
                    params.push(`(min-width: ${minWidth}) and (min-height: ${minWidth})`);
                    break;
                case 'vmax':
                    params.push(`(min-width: ${minWidth})`, `(min-height: ${minWidth})`);
                    break;
            }

            if (QueryStack.options.onlyScreen) {
                params = params.map(param => `only screen and ${param}`);
            }

            const query = postcss.atRule({ name: 'media', params: params.join(', ') });
            query.append(postcss.rule({ selector: this.rule.selector }));

            const nextSmallerQuery = this.queries.sort(sortByKey('minWidth')).reverse().find(comp => comp.minWidth < minWidth);

            if (nextSmallerQuery) {
                nextSmallerQuery.query.after(query);
            } else {
                this.rule.after(query);
            }

            this.keys[minWidth + viewPortType] = this.queries.push({ query, minWidth }) - 1;
        }

        const atRule = this.queries[this.keys[minWidth + viewPortType]].query;
        atRule.nodes[0].append(decl);
    }
}

QueryStack.options = {
    onlyScreen: false
};

module.exports = QueryStack;
