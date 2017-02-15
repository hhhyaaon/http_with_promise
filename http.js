import code from './code.js';

function http(userConf) {
    if (typeof Zepto != 'function') {
        throw new Error('Zepto is not defined');
    }
    const $ = Zepto;
    const _conf = $.extend(true, {
        url: '',
        method: 'get',
        dataType: 'json',
        beforeSend: () => { },
        success: () => { },
        error: () => { }
    }, userConf);

    return new Promise((res, rej) => {
        // beforeSend
        _conf.beforeSend = function () {
            triggerFn.call(this, userConf.beforeSend, arguments);
        };

        // success
        _conf.success = function (resp) {
            const args = Array.prototype.slice.call(arguments);
            triggerFn.call(this, userConf.success, args);
            if (resp.code === code.success.code) {
                res.apply(this, args);
            } else {
                rej.apply(this, args);
            }
        };

        // error
        _conf.error = function () {
            triggerFn.call(this, userConf.error, arguments);
        };

        function triggerFn() {
            const args = Array.prototype.slice.call(arguments);
            let fn = args[0];
            let _args = args[1];
            if (typeof fn === 'function') {
                return fn.apply(this, _args);
            }
        }
        $.ajax(_conf);
    });
}

export default http;
