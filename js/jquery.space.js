(function($) {
    
    function go(key, data){
        var toolbar = $('#'+key).find('.box');
        var evname = !toolbar.length ? key + '_init' : key + '_update';
        $($.space).trigger(evname, [data]);
    }
    function on(key, evname, fn){
        $($.space).on(key+'_'+evname, fn);
    }
    function fire(key, data){
        var el = $('<div>');
        if($.builder[key]){
            el = $.tmpl($.builder[key],data);
        }
        return el;
    }
    function init(key, fn){
        fn && fn(key);
    }
    
    $.space = {
        go:go,
        on:on,
        // fire:fire,
        init: init
    };

}(jQuery));