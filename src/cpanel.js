'use strict';

const _ = require('lodash');
const qs = require('querystring');
const { URL } = require('url');
const axios = require('axios').default;

class cPanel {
    constructor(opts) {
        opts = opts || {};

        if (
            !opts.host ||
            !opts.username ||
            (!opts.accessKey && !opts.password)
        ) {
            throw 'Host, username and an accessKey or a password must be set';
        }

        let _whmAuth;

        if (opts.accessKey) {
            // WHM access hash authenticaion
            _whmAuth = `WHM ${opts.username}:${opts.accessKey}`;
        }

        // basic user authentication
        const _basicAuth = `Basic ${Buffer.from(
            `${opts.username}:${opts.password}`
        ).toString('base64')}`;

        _.assign(this, {
            host: opts.host,
            ignoreCertError: opts.ignoreCertError,
            _basicAuth,
            _whmAuth
        });
    }

    async callWhmUapi(mod, func, user, params = {}) {
        const res = await this.callWhm('cpanel', {
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

    async callWhm(action, args) {
        const res = await this._call({
            auth: this._whmAuth,
            path: ['json-api', action],
            args: {
                ...args,
                'api.version': 1
            },
            port: 2087
        });

        const { metadata, data } = res;

        if (metadata && metadata.result === 0) {
            const error = new Error(metadata.reason);

            if (metadata) {
                error.data = data;
            }

            throw error;
        }

        return data || res;
    }

    async callUapi(mod, func, args) {
        const res = await this._call({
            auth: this._basicAuth,
            path: ['execute', mod, func],
            args,
            port: 2083
        });

        return this._parseUapiResult(res);
    }

    _parseUapiResult(res) {
        if (res.errors && res.errors.length > 0) {
            // TODO: use result.errors
            const error = new Error(res.errors.join('\n'));
            error.data = res;
            throw error;
        }

        return res.data;
    }

    _buildUrl({ host, path, port, query, protocol, secure = true }) {
        if (!protocol) {
            protocol = secure ? 'https' : 'http';
        }

        let baseUrl = `${protocol}://${host}`;

        if (port) {
            baseUrl = `${baseUrl}:${port}`;
        }

        const url = new URL(baseUrl);

        let _qs = query;
        if (_.isPlainObject(query)) {
            _qs = qs.stringify(query);
        }

        if (_.isString(path)) {
            url.pathname = this._normalizePathPart(path);
        } else if (_.isArray(path)) {
            url.pathname = path.map(p => this._normalizePathPart(p)).join('');
        } else if (path) {
            throw new Error('path needs to be a string or an array');
        }

        if (_qs) {
            url.search = _qs;
        }

        return url.href;
    }

    _normalizePathPart(p) {
        if (_.isString(p) && p) {
            p = p.replace(/^\/?(.*?)\/?$/, '/$1');
        }

        return p;
    }

    async _call(opts) {
        const url = this._buildUrl({
            host: this.host,
            query: opts.args,
            ...opts
        });

        const { data } = await axios.get(url, {
            headers: {
                Authorization: opts.auth
            }
        });

        return data;
    }

    static createClient(opts) {
        return new this(opts);
    }
}

module.exports = cPanel;
