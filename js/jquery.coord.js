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
            pos.data = {};
            that.cube.in(pos.index, pos);
        }

        that.box.on('click', onClick); 

        function onClick(e){
            var x = e.pageX;
            var y = e.pageY;
            var index = that.getIndexsByPage(x, y);
            var item = that.getItemByIndex(index);
            console.log(index);
            that.onClick && that.onClick(item);
        }
    }

    $.extend(Coord.prototype, {
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
        getIndexsByPage: function(x, y) {
            var that = this;
            var boxpos = that.box.offset()
            x = x - boxpos.left;
            y = y - boxpos.top;
            var row = Math.ceil((x-that.offset)/that.width);
            var col = Math.ceil((y-that.offset)/that.height);
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