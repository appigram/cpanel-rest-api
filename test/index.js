'use strict';

const cPanel = require('../src');
const creds = require('./creds');

async function test() {
    const cPanelApi = new cPanel({
        ...creds
        // username: 'user',
        // password: 'pass'
    });

    console.log(
        await cPanelApi.callWhmUapi('Email', 'list_forwarders', 'user')
    );

    // console.log(await cPanelApi.callUapi('Email', 'list_forwarders'));
}

test().catch(e => {
    console.error(e.message);
});
