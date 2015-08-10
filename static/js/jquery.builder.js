(function($) {
    var builder_tmpls = {}; 
    
    function init(url){
        $.get(url,{ver:$.now()}).done(function (data) {
            $(data).appendTo('body');
            $('script[type="text/x-jquery-tmpl-builder"]').each(function(){
                builder_tmpls[$(this).attr('data-id')] = $(this).text().trim();
            });
        });
    }
    $.builder = function(box_id){
        var box = $('#'+box_id);
        if(!box.length){
            box = $('<div id="'+box_id+'">');
        }
        this.box = box;
        this.nodeList = {};
    }

    $.extend($.builder.prototype, {
        create: function(key, data) {
            if(builder_tmpls[data.type]){
                var node = $.tmpl(builder_tmpls[data.type],data);
            }
            if(!data.pos){
                this.box.append(node);
            }else if(data.pos == 'header'){
                this.box.find('.box-header').append(node);
            }else{
                this.box.find('.box-body').append(node);
            }
            this.nodeList[key] = {
                node:node,
                data:data
            };
        },
        update: function(key, data){
            var nodeObj = this.nodeList[key];
            if(!nodeObj){
                return false;
            }
            var node = $.tmpl(builder_tmpls[nodeObj.data.type], data);
            this.replace(nodeObj.node, node);
            nodeObj.node = node;
        },
        replace: function(source, target){
            $(target).replaceAll(this.box.find(source));
        }
    });

    $.builder.init = init;
}(jQuery));
