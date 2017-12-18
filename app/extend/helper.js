"use strict";

const statusMap = {
    400: '请求参数错误',
    401: '抱歉，你没有足够的权限',
    403: '拒绝执行',
    404: '访问接口或请求数据不存在',
    405: '请求方法不能用于请求该资源',
    500: '请求失败请稍后再试',
    502: '请求失败请稍后再试'
};

/**
 * transform string to camel case
 * @param str
 */
function toCamelCase(str) {
    return str.replace(/_([a-z])/g, (all, s) => s.toUpperCase());
}

/**
 * transform letter to lodash case
 * @param str
 * @return {string}
 */
function toLodashCase(str) {
    return str.replace(/([A-Z])/g, "_$1").toLowerCase();
}

/**
 * transform letter
 * @param type
 * @param obj
 * @return {{}}
 */
function letterTrans(type, obj) {
    const data = {};
    const handler = {
        lodash: toLodashCase,
        camel: toCamelCase
    }[type];

    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    Object.keys(obj).forEach((key) => {
        if (Array.isArray(obj[key])) {
            data[handler(key)] = obj[key].map(item => letterTrans(type, item));
        } else if (obj[key] && typeof obj[key] === 'object' && !(obj[key] instanceof Date)) {
            data[handler(key)] = letterTrans(type, obj[key]);
        } else {
            data[handler(key)] = obj[key];
        }
    });

    return data;
}

/**
 * transform handler
 * @param type
 * @param obj
 * @return {*}
 */
function transform(type, obj) {
    if (!obj) {
        return obj;
    }
    if (typeof obj === 'string') {
        return {
            lodash: toLodashCase,
            camel: toCamelCase
        }[type](obj);
    }
    if (typeof obj === 'number') {
        return obj;
    }
    const res = [];
    if (Array.isArray(obj)) {
        obj.forEach(item =>
            res.push(transform(type, item))
        );
        return res;
    }
    return letterTrans(type, obj);
}

module.exports = {
    errorObj: (status = 400, msg = '') => ({
        status,
        text: statusMap[String(status)],
        msg
    }),
    errorMsg: (status = 400) => statusMap[String(status)],

    /**
     * transform lodash case object keys to camel case
     * @param obj
     * @return {*}
     */
    mapKeyToCamelCase: obj => transform('camel', obj),

    /**
     * transform camel case object keys to lodash case
     * @param obj
     * @return {*}
     */
    mapKeyToLodashCase: obj => transform('lodash', obj),

    resWrap(data = {}, err = null, withoutPag = false) {
        let _withoutPag = typeof err === 'boolean' ? err : withoutPag;
        let _err = typeof err === 'boolean' ? null : err;
        _err = typeof _err === 'number' ? this.errorObj(_err) : _err;
        const pagination = {
            page: 1,
            count: 1,
            limit: 20,
            total: 1,
            isLastPage: true
        };
        let isLastPage = false;

        if (data && typeof data === 'object') {
            if (data.count && data.page) {
                isLastPage = data.page >= data.total;
            }
        } else if (!data && !_err) {
            _err = this.errorObj(400);
        }
        if (Array.isArray(data) && !data.length) {
            isLastPage = true;
        }
        const page = data ? data.page : 1;
        const total = data ? data.total : 1;
        const limit = data ? data.num : 1;
        const count = data ? data.count : 1;
        const _data = data && data.data ? data.data : data;

        _withoutPag = (_err && _err.status) || _withoutPag || !Array.isArray(_data);
        return Object.assign({
            data: this.mapKeyToCamelCase(_data),
            success: !(_err && _err.status),
            err: _err
        }, _withoutPag ? {} : {
            pagination: Object.assign(pagination, {
                page,
                count,
                limit,
                total,
                isLastPage,
            })
        });
    }
};
