const reduce = (fn, initial, list) => {
    var ret = initial;

    for (var i = 0, len = list.length; i < len; i += 1) {
        ret = fn(ret, list[i], i, list);
    }
    return ret;
};

const isArray = (arr) => {
    return Array.isArray(arr);
};

const get = (obj, path) => {
    var keys = path.split(".").map(item => {
        return (m = item.match(/\w+/g)).length === 1 ? m[0] : m;
    });
    return reduce((prev, cur, idx, list) => {
        if(idx === list.length - 1) {
            if(isArray(cur)) {
                return reduce((p, c) => {
                    return p[c];
                }, prev[cur[0]], cur.slice(1));
            }
            return prev[cur];
        }

        return isArray(cur) ?
            reduce((p, c) => {
                return p[c];
            }, prev[cur[0]], cur.slice(1)) :
            prev[cur];

    }, obj, keys);
};

const set = (obj, path, val) => {
    var keys = path.split(".").map(item => {
        return (m = item.match(/\w+/g)).length === 1 ? m[0] : m;
    });
    reduce((prev, cur, idx, list) => {
        if(idx === list.length - 1) {
            if(isArray(cur)) {
                var ret = reduce((p, c) => {
                    return p[c];
                }, prev[cur[0]], cur.slice(1, -1));
                ret[cur.slice(-1)] = val;
            }
            prev[cur] = val;
        }

        return isArray(cur) ?
            reduce((p, c) => {
                return p[c];
            }, prev[cur[0]], cur.slice(1)) :
            prev[cur];

    }, obj, keys);
};

const partial = function (fn) {
    var len  = fn.length,
        arbitary = function (get_args, left_arg_len) {
            return function () {
                var cur_args = [].slice.call(arguments);
                if(cur_args.length >= left_arg_len) return fn.apply(null, get_args.concat(cur_args));
                return arbitary(get_args.concat(cur_args), left_arg_len - cur_args.length)
            }
        };
    return arbitary([], len);
};

const sprintf = function (str, keys) {
    return reduce((p, c) => {
        return p.replace(new RegExp("\\$\\{" + c + "\\}", "g"), keys[c]);
    }, str, Object.keys(keys));
};

console.log(sprintf("my name is ${name}, i'm ${age}, i'm living ${city}", {
    name: "qiaoyixuan",
    age: "23",
    city: "beijing"
}));
