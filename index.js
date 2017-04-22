//////////////////////////////
///  yichen

class ArgumentError extends Error {
    constructor(argumentName, message = undefined) {
        super(message);
        this.argumentName = argumentName;
    }
}

class ObjectNormalizer {
    constructor(schema, defaultProperty) {

        if (typeof schema !== 'object')
            throw new ArgumentError('schema', `Argument 'schema' must be of Object type.`);

        if (typeof defaultProperty !== 'string'
            || ((defaultProperty = defaultProperty.trim()) && false)
            || defaultProperty.length == 0)
            throw new ArgumentError('defaultProperty', `Argument 'defaultProperty' must be of String type.`);

        this.schemaKeys = Object.keys(schema);
        this.schema = schema;
        this.defaultOperator = defaultProperty;
    }

    normalize(item) {
        if (typeof item !== 'object') {
            let i = {}; i[this.defaultOperator] = item;
            item = i;
        }
        let schema = this.schema;
        return this.schemaKeys.reduce(function (prev, current) {
            prev[current] = schema[current](item[current]);
            return prev;
        }, {});
    }
};

module.exports = ObjectNormalizer;

module.exports.ObjectNormalizer = ObjectNormalizer;
module.exports.ArgumentError = ArgumentError;
