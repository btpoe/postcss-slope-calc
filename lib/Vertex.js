const Unit = require('./CSSUnit');

class Vertex {
    constructor(parts) {
        this.size = parts[0];
        this.breakpoint = parts[1];
    }

    get size() {
        return this[0];
    }

    set size(value) {
        this[0] = new Unit(value);
    }

    get breakpoint() {
        return this[1];
    }

    set breakpoint(value) {
        this[1] = new Unit(value);
    }
}

Vertex.isVertex = arr => !Number.isNaN(new Unit(arr[0]) + 1) && !Number.isNaN(new Unit(arr[1]) + 1);

module.exports = Vertex;
