[![build status](https://secure.travis-ci.org/vially/cpanel-lib.png)](http://travis-ci.org/vially/cpanel-lib)
Node.js library for the cPanel/WHM API
=====

## Instalation
    $ npm install cpanel-lib

## Usage
```js
var { WHM } = require('cpanel-lib');

const whm = new WHM({
    host: 'whm.example.com',
    username: 'WHM_USERNAME',
    accessKey: 'YOUR_ACCESS_KEY'
});

whm
    .api('version')
    .then(({ version }) => {
        console.log('WHM Version: %j', version);
    });

whm
    .api('listaccts')
    .then(res => {
        console.log('Result: %j', res);
    });

whm
    .uapi
    .api('Email', 'list_forwarders', 'user')
    .then(forwarders => {
        console.log(forwarders);
    });
```
