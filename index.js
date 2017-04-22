//////////////////////////////
///  yichen

class ArgumentError extends Error {
    constructor(argumentName, message = undefined) {
        super(message);
        this.argumentName = argumentName;
    }
}

const isObject = function (value) { return typeof value === 'object'; },
    isFunction = function (value) { return typeof value === 'function'; },
    isString = function (value) { return typeof value === 'string'; };

class ObjectNormalizer {
    constructor(schema, defaultProperty) {

        if (isObject(schema) == false)
            throw new ArgumentError('schema', `Argument 'schema' must be of Object type.`);

        if (isString(defaultProperty) == false
            || ((defaultProperty = defaultProperty.trim()) && false)
            || defaultProperty.length == 0)
            throw new ArgumentError('defaultProperty', `Argument 'defaultProperty' must be of String type.`);

        
        this.schema = Object.keys(schema).reduce(function (prev, current) {
            let prop = schema[current];

            if (isObject(prop)) {
                let sub = new ObjectNormalizer(prop.schema, prop.defaultProperty);
                prev[current] = function (value) { return sub.normalize(value); }
                return prev;
            }

            if (isFunction(prop)) {
                prev[current] = prop;
                return prev;
            }

            throw new ArgumentError(current, `Property '${current}' must be of Function or Object type.`);

        }, {});

        this.schemaKeys = Object.keys(schema);
        this.defaultOperator = defaultProperty;
    }

    normalize(item) {
        if (isObject(item) == false) {
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
