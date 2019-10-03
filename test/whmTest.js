'use strict';

const { WHM } = require('../src');
const creds = require('./creds');

async function whmTest() {
    const whm = new WHM(creds.WHM);

    console.log(await whm.api('version'));

    const accts = (await whm.api('listaccts')).acct;

    if (accts.length > 0) {
        const uapi = whm.uapi(accts[0].user);
        const emails = await uapi.api({
            module: 'Email',
            func: 'list_pops'
        });

        console.log(emails);
    }
}

whmTest().catch(console.error);
