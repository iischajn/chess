(function($) {
    function Coord(option){
        var that = this;
        that.cube = $.cube.instance();
        $.extend(that, option);

        var c_row = -1, len = that.row*that.col, i, pos, dot;         
        
        for(i=0;i<len;i++){
            pos = {};
            dot = i%that.row;
            dot == 0 && c_row++;
            pos.x = dot+1;
            pos.y = c_row+1;
            pos.left = dot*that.width+that.offset;
            pos.top = c_row*that.height+that.offset;
            pos.index = i;
            pos.data = null;
            that.cube.in(pos.index, pos);
        }

        that.box.on('click', onClick); 

        function onClick(e){
            console.log(e);
            var x = e.offsetX;
            var y = e.offsetY;
            var index = that.getIndexsByOffset(x, y);
            console.log(index);
            var item = that.getItemByIndex(index);
            that.onClick && that.onClick(item);
        }
        // opt.manual && build(opt.manual);     
    }

    $.extend(Coord.prototype, {
        buildAll: function(manual){
            for(var i=0, len=manual.length;i<len;i++){
                var item = manual[i];
                var pos = this.getItem(item.x, item.y);
                var el = createItemEl(item.role+'-'+item.career, pos.left, pos.top, pos.index);
                pos.data = {
                    el:el,
                    param: item
                }
            }
        },
        build: function(manual){
            for(var i=0, len=manual.length;i<len;i++){
                var item = manual[i];
                var pos = this.getItem(item.x, item.y);
                var el = createItemEl(item.role+'-'+item.career, pos.left, pos.top, pos.index);
                pos.data = {
                    el:el,
                    param: item
                }
            }
        },
        isEmpty: function(row, col) {
            var pos = this.getItem(x, y);
            if(pos && pos.data){
                return true;
            }
            return false;
        },
        getItem: function(row, col){
            return this.getItemByIndex(this.getIndexByCoord(row, col));
        },
        getItemByIndex: function(index) {
            return this.cube.get(index);
        },
        getIndexByCoord: function(row, col) {
            var that = this;
            if(row<1 || row>that.row || col<1 || col>that.col){
                return -1;
            }
            return (row-1)+(col-1)*that.row;
        },
        getIndexsByOffset: function(x, y) {
            var that = this;

            console.log(x,y);
            var row = Math.ceil((x-that.offset)/that.width);
            var col = Math.ceil((y-that.offset)/that.height);
            console.log(row,col);

            return this.getIndexByCoord(row, col);
        },
    });

    $.coord = {};
    $.coord.instance = function(option){
        var defaultOpt = {
            row:10,
            col:9,
            width:104,
            height:100,
            offset:-35
        }
        return new Coord($.extend(defaultOpt,option));
    }
    
}(jQuery));