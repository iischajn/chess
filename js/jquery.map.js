(function($) {
    function Map(option){
        this.posCube = $.cube.instance();
        $.extand(this, option);
        var c_row = -1, len = this.row*this.col, i, pos, dot;         
        for(i=0;i<len;i++){
            pos = {};
            dot = i%this.row;
            dot == 0 && c_row++;
            pos.x = dot+1;
            pos.y = c_row+1;
            pos.left = dot*this.width+this.offset;
            pos.top = c_row*this.height+this.offset;
            pos.index = i;
            pos.data = null;
            this.posCube.in(pos.index, pos);
        }
        // opt.manual && build(opt.manual);     
    }

    $.extend(Map.prototype, {
        isEmpty: function(x, y) {
            var pos = this.getItem(x, y);
            if(pos && pos.data){
                return true;
            }
            return false;
        },
        getItem: function(x, y){
            return this.getItemByIndex(this.getIndexByXY(x, y));
        },
        getItemByIndex: function(index) {
            return this.posCube.get(index);
        },
        getIndexByXY: function(x, y) {
            if(x<1 || x>this.row || y<1 || y>this.col){
                return -1;
            }
            return (x-1)+(y-1)*row;
        }
    });

    $.map = {};
    $.map.instance = function(option){
        var defaultOpt = {
            row:10,
            col:9,
            width:104,
            height:100,
            offset:-35
        }
        return new Map($.extend(defaultOpt,option));
    }
    
}(jQuery));


var map_contorl = (function(){
        var area = $('#qizi_area');
        var map = $.map.instance();

        function build(manual){
            for(var i=0, len=manual.length;i<len;i++){
                var item = manual[i];
                var pos = map.getItem(item.x, item.y);
                var el = createItemEl(item.role+'-'+item.career, pos.left, pos.top, pos.index);
                pos.data = {
                    el:el,
                    param: item;
                }
            }


            
            // pos.el = createItemEl('empty', pos.left, pos.top, i);
            // if(i>44){
            //     pos.belong = 'b';
            // }else{
            //     pos.belong = 'r';
            // }
        }
        
        function getWall(role){
            return role == 'r' ? [2,6,18,22,26,38,44] : [47,51,63,67,71,83,87];
        }
        function getHouse(role){
            return role == 'r' ? [3,4,5,12,13,14,21,22,23] : [66,67,68,75,76,77,84,85,86];
        }
        
        function createItemEl(cn, left, top, index){
            var el = $('<li>');
            el.attr({
                'class':'item '+cn,
                'index':index
            }).setStyle({
                'top':top,
                'left':left
            });
            area.append(el);
            return el;
        }
        function hoverOn(pos){
            pos.el.addClass('hover');
        }
        function hoverOff(pos){
            pos.el.removeClass('hover');
        }
        function move(c_pos, pos){
            var s_cn = pos.role ? pos.role+'-'+pos.career : 'empty';
            pos.el.classList.remove(s_cn);

            var c_cn = c_pos.role+'-'+c_pos.career;
            pos.el.classList.add(c_cn);
            pos.role = c_pos.role;
            pos.career = c_pos.career;              

            c_pos.el.classList.remove(c_cn);
            c_pos.el.classList.add('empty');
            c_pos.role = null;
            c_pos.career = null;
        }
        function onAreaClick(e){
            var el = e.target;
            if(el.tagName == 'LI'){
                var index = el.getAttribute('index');
                var pos = getPosByIndex(index);
                opt.onClick && opt.onClick(pos);
            }
        }
        area.on('click',onAreaClick,false); 

        return {
            build:build,
            move:move,
            hoverOn:hoverOn,
            hoverOff:hoverOff,
            getHouse:getHouse,
            getWall:getWall
        };
    })();