/*
 * 
 * 
 *
 * Copyright (c) 2016 
 * Licensed under the MIT license.
 */
(function ($) {

  var cache = [],
        signBegin = "<%",
        signEnd = "%>",
        filters = []

    var formatFilter = function(value,filterName){
        if (!filterName) {
            return ""
        }
        var funcs = filterName.trim().split(":")
        var func = funcs[0].trim() 
        funcs[0] = value
        console.error(func,funcs)
        if(filters[func] && typeof filters[func] == "function"){
            return filters[func].apply(this,funcs)
        }
        return ""

    }

    var tmpl = (function (cache, $) { 
    return function (str, data) { 
        var endRegx = new RegExp("((^|"+signEnd+")[^\\t]*)'","g")
        var varRegx = new RegExp("\\t=(.*?)"+signEnd,"g")
        var filterRegx = new RegExp("\\t(.*?)\\|(.*?)"+signEnd,"g")
        var fn = !/\s/.test(str) 
        ? cache[str] = cache[str] 
        || tmpl(document.getElementById(str).innerHTML) 
        : function (data) { 
            var i, variable = [$], value = [[]]; 
            for (i in data) { 
                variable.push(i); 
                value.push(data[i]); 
            }; 
            variable.push("$filters")
            value.push(formatFilter)
            return (new Function(variable, fn.$)) 
            .apply(data, value).join(""); 
        }; 
        fn.$ = fn.$ || $ + ".push('" 
        + str.replace(/\\/g, "\\\\") 
        .replace(/[\r\t\n]/g, " ") 
        .split(signBegin).join("\t") 
        .replace(endRegx, "$1\r") 
        // .replace(/((^|%>)[^\t]*)'/g, "$1\r")
        .replace(filterRegx,"',$$filters($1,\"$2\"),'")
        .replace(varRegx, "',$1,'") 
        // .replace(/\t=(.*?)%>/g, "',$1,'") 
        .split("\t").join("');") 
        .split(signEnd).join($ + ".push('") 
        .split("\r")
        .join("\\'") 
        + "');return " + $; 

        // fn.$ = _formatFilters(data,fn.$)

        console.log(fn.$)

        return data ? fn(data) : fn; 
    }})({}, '$' + (+ new Date));


    tmpl.setSign = function(beginOn,endOn) {
        signBegin = beginOn
        signEnd = endOn
    }

    tmpl.addFilter = function(name,filter){
        filters[name] = filter
    }

    tmpl.removeFilter = function(name){
        filters[name] = undefined
        delete filters[name]
    }

    $.SimpleTmpl = tmpl

    function toDoubleDigit(n) {
        return n < 10 ? '0' + n : n
    }

    function formatDateTime(format,timestamp){
        if (timestamp <= 0) {
            return ""
        }
        var d = new Date(timestamp * 1000)

        var tars = format.match(/%\w/g)
        var result = format
        for(var i in tars){
            switch(tars[i]){
                case "%Y":
                    result = result.replace(/%Y/g,d.getFullYear())
                    break
                case "%m":
                    result = result.replace(/%m/g,toDoubleDigit(d.getMonth() + 1))
                    break
                case "%d":
                    result = result.replace(/%d/g,toDoubleDigit(d.getDate() + 1))
                    break
                case "%H":
                    result = result.replace(/%H/g,toDoubleDigit(d.getHours()))
                    break
                case "%i":
                    result = result.replace(/%i/g,toDoubleDigit(d.getMinutes()))
                    break
                case "%s":
                    result = result.replace(/%s/g,toDoubleDigit(d.getSeconds()))
                    break
            }
        }
        return result
    }

    $.SimpleTmpl.addFilter("date",function(value){
        return formatDateTime("%Y-%m-%d",value)
    })
    $.SimpleTmpl.addFilter("date_format",function(value,format){
        return formatDateTime(format,value)
    })

}(jQuery));
