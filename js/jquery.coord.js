(function($) {
    function Coord(option) {
        var that = this;
        that.cube = $.cube.instance();
        $.extend(that, option);

        var c_row = -1,
            len = that.row * that.col,
            i, coord, dot;

        for (i = 0; i < len; i++) {
            coord = {};
            dot = i % that.row;
            dot == 0 && c_row++;
            coord.x = dot + 1;
            coord.y = c_row + 1;
            coord.left = dot * that.width + that.offset;
            coord.top = c_row * that.height + that.offset;
            coord.index = i;
            coord.data = {};
            coord.data.isEmpty = true; 
            that.cube.in(coord.index, coord);
        }

        that.box.on('click', onClick);

        function onClick(e) {
            var x = e.pageX;
            var y = e.pageY;
            var index = that.getIndexsByPage(x, y);
            var item = that.getItemByIndex(index);
            console.log(index);
            that.onClick && that.onClick(item);
        }
    }

    $.extend(Coord.prototype, {
        getItems: function(indexs, checkType, checkFunc) {
            var that = this;
            var ret = [];
            $.each(indexs, function(i, index){
                var item = that.getItemByIndex(index);
                if (!checkType || 
                    (checkType == 'empty' && item.data.isEmpty) || 
                    (checkType == 'unempty' && !item.data.isEmpty)){
                    ret.push(index);
                }else if(checkType == 'func' && checkFunc(item)){
                    ret.push(index);
                }
            });
            return ret;
        },
        isEmpty: function(index) {
            var pos = this.getItemByIndex(index);
            if (pos && pos.data.isEmpty) {
                return true;
            }
            return false;
        },
        getItem: function(row, col) {
            return this.getItemByIndex(this.getIndexByCoord(row, col));
        },
        getItemByIndex: function(index) {
            return this.cube.get(index);
        },
        getIndexsByCoordList: function(range){
            var that = this;
            var indexRange = [];
            $.each(range, function(i, item){
                var index = that.getIndexByCoord(item[0], item[1]);
                index != -1 && indexRange.push(index);
            });
            return indexRange;

        },
        getIndexByCoord: function(row, col) {
            var that = this;
            if (row < 1 || row > that.row || col < 1 || col > that.col) {
                return -1;
            }
            return (row - 1) + (col - 1) * that.row;
        },
        getIndexsByPage: function(x, y) {
            var that = this;
            var boxpos = that.box.offset()
            x = x - boxpos.left;
            y = y - boxpos.top;
            var row = Math.ceil((x - that.offset) / that.width);
            var col = Math.ceil((y - that.offset) / that.height);
            return this.getIndexByCoord(row, col);
        },
        getRange: function(center, x, y, size, checkType){
            //all, clash, before, after
            var that = this;
            var range = [];
            var isX = false;
            if(!x){
                isX = true;
            }
            for (var i = 1; i <= size; i++) {
                if(isX){
                    x = i;
                }else{
                    y = i;
                }
                if (checkType != 'all') {
                    var item = that.getItem(x, y);
                    if(item.data.isEmpty){
                        range.push([x, y]);
                        continue;
                    }
                    if (i < center) {
                        range = [];
                        range.push([x, y]);
                    } else if (i > center){
                        range.push([x, y]);
                        break;
                    } else {
                        if(checkType == "before"){
                            break;
                        }else if (checkType == "after"){
                            range = [];
                        }
                    }
                }else{
                    range.push([x, y]);
                } 
            }  
            return range;
        },
        getHVRange: function(x, y, checkType) {
            var that = this;
            var ret = [];
            var xRange = that.getRange(x, null, y, that.row, checkType);
            var yRange = that.getRange(y, x, null, that.col, checkType);

            console.log(JSON.stringify(xRange));
            console.log(JSON.stringify(yRange));

            ret = ret.concat(xRange);
            ret = ret.concat(yRange);

            
            return ret;
        }
    });

    $.coord = {};
    $.coord.instance = function(option) {
        var defaultOpt = {
            row: 10,
            col: 9,
            width: 104,
            height: 100,
            offset: -35
        }
        return new Coord($.extend(defaultOpt, option));
    }

}(jQuery));
