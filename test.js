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

    it('normalize (array)', function () {

        let nor = new ObjectNormalizer({
            'prop1': [function (value) {
                if (value == undefined) value = 1;
                return value;
            }],
            'prop2': function (value) {
                if (typeof value !== 'function')
                    throw new Error(`'prop2' must be of Function type.`);
                return value;
            }
        }, 'prop2');

        let r = nor.normalize(function () { return 'hello!'; });

        assert(r.prop1);
        assert(Array.isArray(r.prop1));
        assert(r.prop1.length == 0);
        assert(typeof r.prop2 === 'function');


    });

    it('normalize (root array)', function () {

        let nor = new ObjectNormalizer([{
            'prop1': [function (value) {
                if (value == undefined) value = 1;
                return value;
            }],
            'prop2': function (value) {
                if (typeof value !== 'function')
                    throw new Error(`'prop2' must be of Function type.`);
                return value;
            }
        }], 'prop2');

        let r = nor.normalize([function () { return 'hello!'; }]);

        assert(r);
        assert(Array.isArray(r));
        assert(r.length == 1);
        assert(r[0].prop1);
        assert(Array.isArray(r[0].prop1));
        assert(r[0].prop1.length == 0);
        assert(typeof r[0].prop2 === 'function');


    });

    it('normalize (empty array)', function () {

        let nor = new ObjectNormalizer({
            'prop1': [],
            'prop2': function (value) {
                return value || 'hello!';
            }
        }, 'prop2');

        let { prop1, prop2 } = nor.normalize({ prop1: [function () { return 'item 0'; }, 1] });

        assert(prop1);
        assert(Array.isArray(prop1));
        assert(prop1.length == 2);
        assert(prop1[0]() == 'item 0');
        assert(prop1[1] == 1);
        assert(prop2 === 'hello!');


    });

    it('normalize (deep)', function () {

        let nor = new ObjectNormalizer({
            parent1: function (value) {
                if (value == undefined) value = 'parent1';
                return value;
            },
            parent2: {
                schema: {
                    'prop1': function (value) {
                        if (value == undefined) value = 1;
                        return value;
                    },
                    'prop2': function (value) {
                        if (typeof value !== 'function')
                            throw new Error(`'prop2' must be of Function type.`);
                        return value;
                    }
                },
                defaultProperty: 'prop2'
            }
        }, 'parent2');

        let r = nor.normalize(function () { return 'hello!'; });

        assert(r.parent1 == 'parent1');
        assert(r.parent2.prop1 == 1);
        assert(typeof r.parent2.prop2 === 'function');


    });
});