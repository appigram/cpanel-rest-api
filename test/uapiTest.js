'use strict';

const { UAPI } = require('../src');
const creds = require('./creds');

async function uapiTest() {
    const uapi = new UAPI(creds.UAPI);
    const res = await uapi.api('Email', 'list_forwarders');
    console.log(res);
}

uapiTest();
