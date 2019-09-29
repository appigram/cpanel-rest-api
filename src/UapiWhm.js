'use strict';

const UAPI = require('./UAPI');

class UapiWhm extends UAPI {
    constructor(whm) {
        super({});

        this._whm = whm;
    }

    async api(mod, func, user, params = {}) {
        // https://documentation.cpanel.net/display/DD/Use+WHM+API+to+Call+cPanel+API+and+UAPI
        const res = await this._whm.api('cpanel', {
            ...params,
            cpanel_jsonapi_module: mod,
            cpanel_jsonapi_func: func,
            cpanel_jsonapi_user: user,
            // uapi
            cpanel_jsonapi_apiversion: 3
        });

        const { result } = res;

        if (+result === 0) {
            throw new Error(res.reason);
        }

        return this._parseUapiResult(result);
    }
}

module.exports = UapiWhm;
