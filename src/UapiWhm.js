'use strict';

const _ = require('lodash');
const UAPI = require('./UAPI');

class UapiWhm extends UAPI {
    constructor(whm, user) {
        super({});

        this._whm = whm;
        this._user = user;
    }

    /**
     *
     * @param {object} opts
     * @param {string} opts.module
     * @param {string} opts.func
     * @param {string} opts.user
     * @param {{ [key: string]: string; }} opts.params
     */
    async api(opts) {
        if (!_.isPlainObject(opts)) {
            throw new Error('opts needs to be an object');
        }

        const { module, func, user = this._user, params = {} } = opts;

        // https://documentation.cpanel.net/display/DD/Use+WHM+API+to+Call+cPanel+API+and+UAPI
        const res = await this._whm.api({
            action: 'cpanel',
            params: {
                ...params,
                cpanel_jsonapi_module: module,
                cpanel_jsonapi_func: func,
                cpanel_jsonapi_user: user,
                // uapi
                cpanel_jsonapi_apiversion: 3
            }
        });

        const { result } = res;

        if (+result === 0) {
            throw new Error(res.reason);
        }

        return this._parseUapiResult(result);
    }
}

module.exports = UapiWhm;
