const assert = require('assert');
const ObjectNormalizer = require('./index');


describe('test.js', function () {

    const schema = {
        'prop1': function (value) {
            if (value == undefined)
                value = 1;
            return value;
        },
        'prop2': function (value) {
            if (typeof value !== 'function')
                throw new Error(`'prop2' must be of Function type.`);
            return value;
        }
    };

    const defaultPropertyName = 'prop2';

    it('constructor', function () {

        assert(new ObjectNormalizer(schema, defaultPropertyName));

    });

    it('constructor (schema undefined)', function () {

        assert.throws(function () { new ObjectNormalizer(undefined, defaultPropertyName) }, Error);

    });

    it('constructor (defaultPropertyName undefined)', function () {

        assert.throws(function () { new ObjectNormalizer(schema, undefined) }, Error);

    });

    it('normalize', function () {

        let nor = new ObjectNormalizer(schema, defaultPropertyName);
        let { prop1, prop2 } = nor.normalize({ prop1: 3, prop2: function () { } });

        assert(prop1 == 3);
        assert(typeof prop2 === 'function');

    });

    it('normalize (to default)', function () {

        let nor = new ObjectNormalizer(schema, defaultPropertyName);
        let r = nor.normalize(function () { });
    
        assert(r.prop1 == 1);
        assert(typeof r.prop2 === 'function');

    });


    it('normalize (value error)', function () {

        let nor = new ObjectNormalizer(schema, defaultPropertyName);

        assert.throws(function () { nor.normalize({ prop1: 3, prop2: 'aa' }); }, Error);

    });
});