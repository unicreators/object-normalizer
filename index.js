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
    isString = function (value) { return typeof value === 'string'; },
    isArray = function (value) { return Array.isArray(value); };

const wrapArray = function (fn = undefined) {
    return function (value) {
        value = value || [];
        if (isArray(value) == false) value = [value];
        return fn ? value.map(function (item) { return fn(item); }) : value;
    };
}

class ObjectNormalizer {
    constructor(schema, defaultProperty) {

        if (isArray(schema)) {
            if (schema.length == 0)
                throw new ArgumentError('schema', `Argument 'schema' must be of Object/[Object] type.`);
            this.rootArray = true;
            schema = schema[0];
        }

        if (isObject(schema) == false)
            throw new ArgumentError('schema', `Argument 'schema' must be of Object/[Object] type.`);

        if (isString(defaultProperty) == false
            || ((defaultProperty = defaultProperty.trim()) && false)
            || defaultProperty.length == 0)
            throw new ArgumentError('defaultProperty', `Argument 'defaultProperty' must be of String type.`);


        this.schema = Object.keys(schema).reduce(function (prev, current) {
            let prop = schema[current], _array = isArray(prop);

            if (_array) {
                if (prop.length == 0) {
                    prev[current] = wrapArray();
                    return prev;
                }
                prop = prop[0];
            }

            if (isFunction(prop)) {
                prev[current] = _array ? wrapArray(prop) : prop;
                return prev;
            }

            if (isObject(prop)) {
                let sub = new ObjectNormalizer(prop.schema, prop.defaultProperty);
                prev[current] = _array ? wrapArray(sub.normalize.bind(sub)) : function (value) { return sub.normalize(value); }
                return prev;
            }

            throw new ArgumentError(current, `Property '${current}' must be of Function/[Function] or Object/[Object] type.`);

        }, {});

        this.schemaKeys = Object.keys(schema);
        this.defaultOperator = defaultProperty;
    }

    normalize(item) {
        return (isArray(item) || this.rootArray) ?
            wrapArray(this._.bind(this))(item) : this._(item);
    }

    _(item) {
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
