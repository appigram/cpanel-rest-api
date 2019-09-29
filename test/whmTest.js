'use strict';

const { WHM } = require('../src');
const creds = require('./creds');

async function whmTest() {
    const whm = new WHM(creds.WHM);

    console.log(await whm.api('version'));

    const accts = (await whm.api('listaccts')).acct;

    if (accts.length > 0) {
        const forwarders = await whm.uapi.api(
            'Email',
            'list_forwarders',
            accts[0].user
        );

        console.log(forwarders);
    }
}

whmTest();
