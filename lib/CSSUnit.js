const roundNumber = (num, dec) => Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);

class CSSUnit extends Number {
    constructor(value) {
        if (!(typeof value === 'number' || value instanceof Number) && value.match(/\d/)) {
            const [_, parsedValue, unit] = value.match(/(-?[\d.]+)(\D*)/);
            switch (unit) {
                case '':
                case 'px':
                    value = parsedValue;
                    break;
                case 'em':
                case 'rem':
                case 'pc':
                    value = parsedValue * 16;
                    break;
                case 'in':
                    value = parsedValue * 96;
                    break;
                case 'pt':
                    value = parsedValue * (96/72);
                    break;
                case 'cm':
                    value = parsedValue * 37.795;
                    break;
                case 'mm':
                    value = parsedValue * 3.7795;
                    break;
                default:
                    throw new Error('Slope Calc Error: Unit type not supported.');
                    break;
            }
        }
        super(value);
        this.value = Number(this);
    }

    get px() {
        return this.value ? Math.round(this.value) + 'px' : '0';
    }

    get em() {
        return this.value ? roundNumber(this.value / 16, CSSUnit.options.maxDecimalPlaces) + 'em' : '0';
    }

    get rem() {
        return this.value ? roundNumber(this.value / CSSUnit.options.rootPx, CSSUnit.options.maxDecimalPlaces) + 'rem' : '0';
    }

    get vw() {
        return this.value ? roundNumber(this.value * 100, CSSUnit.options.maxDecimalPlaces) + 'vw' : '0';
    }
}

CSSUnit.options = {
    rootPx: 16,
    maxDecimalPlaces: 4
};

module.exports = CSSUnit;
