## ObjectNormalizer

object normalizer.


## Install

```sh
$ npm install object-normalizer
```

## Usage

### Normal

```js

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

let nor = new ObjectNormalizer(schema, defaultPropertyName);
let r = nor.normalize(function () { });

console.log(r);
// { prop1: 1, prop2: [Function] }


```



### Multiple

```js

const schema = {
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
};

const defaultPropertyName = 'parent2';

let nor = new ObjectNormalizer(schema, defaultPropertyName);
let r = nor.normalize(function () { return 'hello!'; });

console.log(r);
// { parent1: 'parent1', parent2: { prop1: 1, prop2: [Function] } }

console.log(r.parent2.prop2());
// hello!

```


### License

[MIT](LICENSE)