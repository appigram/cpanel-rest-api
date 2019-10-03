Node.js library for the cPanel/WHM API
=====

## Instalation
    $ npm install cpanel-rest-api

## WHM Usage
```js
var { WHM } = require('cpanel-rest-api');

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

// or
whm
    .api({ action: 'listaccts' })
    .then(res => {
        console.log('Result: %j', res);
    });

whm
    .uapi('user')
    .api({ module: 'Email', func: 'list_pops' })
    .then(emails => {
        console.log(emails);
    });
```
