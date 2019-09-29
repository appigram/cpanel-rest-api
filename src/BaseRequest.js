'use strict';

const _ = require('lodash');
const axios = require('axios').default;
const { buildUrl } = require('builder-url');

class BaseRequest {
    constructor(opts) {
        opts = opts || {};

        this._auth = opts.auth;
        this._host = opts.host;
        this._port = opts.port;
        this._secure = opts.secure;
    }

    get host() {
        return this._host;
    }

    get port() {
        return this._port;
    }

    async _request(opts) {
        const { args } = opts;

        for (const [key, value] of _.toPairs(args)) {
            if (_.isBoolean(value)) {
                args[key] = value ? 1 : 0;
            }
        }

        const url = buildUrl({
            host: this.host,
            port: this.port,
            secure: this._secure,
            query: opts.params,
            ...opts
        });

        const { data } = await axios.get(url, {
            headers: {
                Authorization: opts.auth || this._auth
            }
        });

        return data;
    }
}

module.exports = BaseRequest;
