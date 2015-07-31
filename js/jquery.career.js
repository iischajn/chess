var Career = $.soul.instance('career');

Career.create('getActRange', function(coord, coordManager) {
    var careerName = coord.data.pawn.career;
    var career = Career.get(careerName);
    var range = career.range(coord, coordManager);
    range = coordManager.getIndexsByCoordList(range);
    
    if(career.filter){
        range = career.filter(coord, range, coordManager);
    }
    range = coordManager.getItems(range, 'func', function(item){
        if(item.data.pawn && item.data.pawn.role == coord.data.pawn.role){
            return false;
        }
        return true;
    });


    return range;
});

Career.create('white', function(range, filter) {
    var ret = [];
    $.each(range, function(i, index) {
        $.inArray(index, filter) != -1 && ret.push(index);
    })
    return ret;
});

Career.create('house', function(range, role) {
    var filter = role == 'r' ? [3, 4, 5, 12, 13, 14, 21, 22, 23] : [66, 67, 68, 75, 76, 77, 84, 85, 86];
    return Career.white(range, filter);
});

Career.create('wall', function(range, role) {
    var filter = role == 'r' ? [2, 6, 18, 22, 26, 38, 42] : [47, 51, 63, 67, 71, 83, 87];
    return Career.white(range, filter);
});

Career.in('shuai', {
    filter: function(coord, range){
        var role = coord.data.pawn.role;
        return Career.house(range, role);
    },
    range: function(coord) {
        var range = [];
        var x = coord.x;
        var y = coord.y;
        range = range.concat([
            [x, y - 1],
            [x, y + 1],
            [x + 1, y],
            [x - 1, y]
        ]);
        return range;
    }
});
Career.in('shi', {
    filter: function(coord, range){
        var role = coord.data.pawn.role;
        return Career.house(range, role);
    },
    range: function(coord) {
        var range = [];
        var x = coord.x;
        var y = coord.y;
        range = range.concat([
            [x - 1, y - 1],
            [x + 1, y - 1],
            [x - 1, y + 1],
            [x + 1, y + 1]
        ]);
        return range;
    }
});

Career.in('xiang', {
    filter: function(coord, range, coordManager){
        var role = coord.data.pawn.role;
        var x = coord.x;
        var y = coord.y;
        
        var range = Career.wall(range, role);
        var ret = [];

        $.each(range, function(i, item){
            var min = Math.min(coord.index, item);
            var max = Math.max(coord.index, item);
            var index = min + (max - min)/2;
            if(coordManager.isEmpty(index)){
                ret.push(item);
            }
        });

        return ret;
    },
    range: function(coord) {
        var range = [];
        var x = coord.x;
        var y = coord.y;

        range = range.concat([
            [x-2,y-2],
            [x+2,y-2],
            [x-2,y+2],
            [x+2,y+2]
        ]);

        return range;
    }
});

Career.in('ma', {
    filter: function(coord, range, coordManager){
        var x = coord.x;
        var y = coord.y;

        var ret = [];
        for(var i=0,len=range.length;i<len;i++){
            var item = coordManager.getItemByIndex(range[i]);
            var xnum = (item.x + x)/2;
            var ynum = (item.y + y)/2;
            var index = null;
            if(parseInt(xnum) == xnum){
                index = coordManager.getIndexByCoord(xnum, y);
            }else{
                index = coordManager.getIndexByCoord(x, ynum);
            }

            if(coordManager.isEmpty(index)){
                ret.push(range[i]);
            }
        }
        
        return ret;
    },
    range: function(coord) {
        var range = [];
        var x = coord.x;
        var y = coord.y;

        range = range.concat([
            [x-1,y-2],[x+1,y-2], 
            [x+2,y-1],[x+2,y+1], 
            [x-1,y+2],[x+1,y+2], 
            [x-2,y-1],[x-2,y+1]
        ]);

        return range;
    }
});
Career.in('che', {
    range: function(coord, coordManager) {
        var range = [];
        var x = coord.x;
        var y = coord.y;
        range = coordManager.getHVRange(x, y, 'clash');
        return range;
    }
});

Career.in('pao', {
    filter: function(coord, range, coordManager){        
        var aimRange = [];

        $.each(range, function(i, index){
            var item = coordManager.getItemByIndex(index);
            if(!item.data.isEmpty){
                var type = item.index < coord.index ? 'before' : 'after';
                aimRange = coordManager.getRange(item.x, item.y, 'before');
                aimRange = coordManager.getIndexsByCoordList(aimRange);
                aimRange = coordManager.getItems(aimRange, 'unempty');
            }
        });

        return range.concat(aimRange);
    },
    range: function(coord, coordManager) {
        var range = [];
        var x = coord.x;
        var y = coord.y;

        range = coordManager.getHVRange(x, y, 'all');

        // var x_range = getHVRange('h', 9, c_y);
        // var y_range = getHVRange('v', 10, c_x);

        // x_range = pao_RangeFilter('h', x_range, c_index, c_role);
        // x_range.push(aim.getIndex());
        // aim.clear();
        // y_range = pao_RangeFilter('v', y_range, c_index, c_role);
        // y_range.push(aim.getIndex());
        // aim.clear();
        // range = x_range.concat(y_range);


        return range;
    }
});

Career.in('zu', {
    range: function(coord) {
        var belong = coord.data.belong;
        var role = coord.data.pawn.role;
        var range = [];
        var x = coord.x;
        var y = coord.y;
        var num = role == "r" ? 1 : -1;

        range.push([x, y + num]);

        if (belong != role) {
            range = range.concat([[x - 1, y], [x + 1, y]]);
        }

        return range;
    }
});



// function pao_RangeFilter(type, o_range, c_index, c_role){
//  var range = [];
//  o_range.every(function(i_pos){
//      var index = i_pos.index;
//      var role = i_pos.role;
//      if(index == c_index){
//          range.push(aim.getIndex());
//          aim.clear();
//      }else if(index > c_index){
//          if(role){
//              range = [];
//              aim.setBigAim(i_pos);
//          }else{
//              if(!aim.hasLean() || aim.mensLean(type, i_pos)){
//                  range.push(index);
//              }
//          }
//      }else{
//          if(role){
//              aim.setSmallAim(i_pos);
//              if(aim.getIndex() != -1){
//                  return false;
//              }
//          }else{
//              if(!aim.hasLean()){
//                  range.push(index);
//              }
//          }
//      }
//      return true;
//  });
//  return range;
// }


// var aim = (function(){
//  var aim_pos = null;
//  var lean_pos = null;
//  function getIndex(c_role){
//      if(lean_pos && aim_pos){
//          if(c_role != aim_pos.role){
//              return aim_pos.index;
//          }
//      }
//      return -1;
//  }
//  function setSmallAim(pos){
//      if(lean_pos){
//          aim_pos = pos;
//      }else{          
//          lean_pos = pos;
//      }
//  }
//  function setBigAim(pos){
//      if(lean_pos){
//          aim_pos = lean_pos;
//          lean_pos = pos;
//      }else if(aim_pos){
//          lean_pos = pos;
//      }else{
//          aim_pos = pos;
//      }
//  }
//  function mensLean(type, pos){
//      if(type == 'h' ? pos.x < lean_pos.x : pos.y < lean_pos.y){
//          return true;
//      }
//      return false;
//  }
//  function hasLean(){
//      return lean_pos ? true : false;
//  }
//  function clear(){
//      aim_pos = null;
//      lean_pos = null;
//  }
//  return {
//      mensLean:mensLean,
//      hasLean:hasLean,
//      setSmallAim:setSmallAim,
//      setBigAim:setBigAim,
//      getIndex:getIndex,
//      clear:clear
//  };
// })();