'use strict';

const { UAPI } = require('../src');
const creds = require('./creds');

async function uapiTest() {
    const uapi = new UAPI(creds.UAPI);

    try {
        const res = await uapi.api({
            module: 'Email',
            func: 'list_pops'
        });

        console.log(res);
    } catch (e) {
        console.dir(e);
    }
}

uapiTest();
