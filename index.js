"use strict";

var loaderUtils = require("loader-utils");
var css = require("css");

var privateMath = {
    add: function(num1, num2) {
        var r1, r2, m;
        try {
            r1 = num1.toString().split('.')[1].length;
        } catch (e) {
            r1 = 0;
        }
        try {
            r2 = num2.toString().split(".")[1].length;
        } catch (e) {
            r2 = 0;
        }
        m = Math.pow(10, Math.max(r1, r2));
        return Math.round(num1 * m + num2 * m) / m;
    },

    sub: function(num1, num2) {
        var r1, r2, m, n;
        try {
            r1 = num1.toString().split('.')[1].length;
        } catch (e) {
            r1 = 0;
        }
        try {
            r2 = num2.toString().split(".")[1].length;
        } catch (e) {
            r2 = 0;
        }
        m = Math.pow(10, Math.max(r1, r2));
        n = (r1 >= r2) ? r1 : r2;
        return parseFloat((Math.round(num1 * m - num2 * m) / m).toFixed(n));
    },



    mul: function(num1, num2) {
        var m = 0,
            s1 = num1.toString(),
            s2 = num2.toString();
        try {
            m += s1.split(".")[1].length
        } catch (e) {}
        try {
            m += s2.split(".")[1].length
        } catch (e) {}
        return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
    },
    div: function(num1, num2) {
        var t1, t2, r1, r2;
        try {
            t1 = num1.toString().split('.')[1].length;
        } catch (e) {
            t1 = 0;
        }
        try {
            t2 = num2.toString().split(".")[1].length;
        } catch (e) {
            t2 = 0;
        }
        r1 = Number(num1.toString().replace(".", ""));
        r2 = Number(num2.toString().replace(".", ""));
        return (r1 / r2) * Math.pow(10, t2 - t1);
    }
};

module.exports = function(content, map) {
    if (this.cacheable) {
        this.cacheable();
    }

    //  解析css变成AST对象
    var contentAST = css.parse(content);

    //  使用loader时的queryString(相关参数)
    var query = loaderUtils.parseQuery(this.query);

    var minSize = query.minSize || 1;
    var base = query.base || 37.5;
    var ignore = query.ignore.length ? query.ignore.split("|") : [];
    var scale = query.scale || 1;
    var pxUnitReg = /\d+[\.{1}\d+]?px/gi;
    var tmp;

    //  遍历样式树
    contentAST.stylesheet.rules.forEach(function(rule) {
        //  遍历样式表
        rule.declarations.forEach(function(style) {
            if (ignore.indexOf(style.property) < 0) {
                style.value = style.value.replace(pxUnitReg, function(match) {
                    tmp = parseFloat(match);
                    if(tmp > minSize) {
                        return privateMath.div(tmp, privateMath.mul(base, scale)) + "rem";
                    }
                });
            }
        });
    });

    content = css.stringify(contentAST);

    this.callback(null, content, map);
};
