## ObjectNormalizer




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


## Install

```sh
$ npm install object-normalizer
```




### License

[MIT](LICENSE)