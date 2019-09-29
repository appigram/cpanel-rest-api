'use strict';

const BaseRequest = require('./BaseRequest');
const UapiWhm = require('./UapiWhm');

class WHM extends BaseRequest {
    constructor(opts) {
        super({ port: 2087, auth: getWhmAuth(opts), ...opts });

        this._uapi = new UapiWhm(this);
    }

    get uapi() {
        return this._uapi;
    }

    async api(action, params, opts) {
        const res = await this._request({
            ...opts,
            path: ['json-api', action],
            params: {
                ...params,
                'api.version': 1
            }
        });

        const { metadata, data } = res;

        if (metadata && +metadata.result === 0) {
            const error = new Error(metadata.reason);

            if (metadata) {
                error.data = data;
            }

            throw error;
        }

        return data || res;
    }
}

function getWhmAuth(creds) {
    if (creds.accessKey) {
        // WHM access hash authenticaion
        return `WHM ${creds.username}:${creds.accessKey}`;
    }
}

module.exports = WHM;
