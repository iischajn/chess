var Career = $.soul.instance('career');

Career.create('getActRange', function(coord, coordManager) {
    var careerName = coord.data.pawn.career;
    var career = Career.get(careerName);
    var range = career.range(coord, coordManager);

    range = coordManager.getIndexsByCoordList(range);

    if(career.filter){
        range = career.filter(coord, range, coordManager);
    } 

    return range;
});

Career.create('white', function(range, filter) {
    var ret = [];
    $.each(range, function(i, index) {
        $.inArray(filter, index) != -1 && ret.push(index);
    })
    return ret;
});

Career.create('house', function(range, role) {
    var ret = [];
    var filter = role == 'r' ? [3, 4, 5, 12, 13, 14, 21, 22, 23] : [66, 67, 68, 75, 76, 77, 84, 85, 86];
    Career.white(range, filter);
    return ret;
});

Career.create('wall', function(range, role) {
    var ret = [];
    var filter = role == 'r' ? [2, 6, 18, 22, 26, 38, 44] : [47, 51, 63, 67, 71, 83, 87];
    Career.white(range, filter);
    return ret;
});

Career.in('shuai', {
    filter: function(coord, range){
        var role = coord.data.pawn.role;
        return Career.house(range, role);
    },
    range: function(coord) {
        var pawn = coord.data.pawn;
        var range = [];
        var x = pawn.x;
        var y = pawn.y;
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
        var pawn = coord.data.pawn;
        var range = [];
        var x = pawn.x;
        var y = pawn.y;
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
        var pawn = coord.data.pawn;
        var x = pawn.x;
        var y = pawn.y;
        var pindex = pawn.index;
        
        var range = Career.wall(range, role);
        var ret = [];

        $.each(range, function(i, item){
            var min = Math.min(pindex, item);
            var max = Math.max(pindex, item);
            var index = min + (max - min)/2;
            if(coordManager.isEmpty(index)){
                ret.push(item);
            }
        });

        return ret;
    },
    range: function(coord) {
        var pawn = coord.data.pawn;
        var range = [];
        var x = pawn.x;
        var y = pawn.y;

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
        var role = coord.data.pawn.role;
        var pawn = coord.data.pawn;
        var x = pawn.x;
        var y = pawn.y;
        var pindex = pawn.index;

        var ret = [];
        for(var i=0,len=range.length;i<len;i=i+2){
            var num = (range[i] + range[i+1])/2;
            var min = Math.min(pindex, num);
            var max = Math.max(pindex, num);
            var index = min + (max - min)/2;
            if(coordManager.isEmpty(index)){
                ret.push(range[i]);
                ret.push(range[i+1]);
            }
        }
        
        return ret;
    },
    range: function(coord) {
        var pawn = coord.data.pawn;
        var range = [];
        var x = pawn.x;
        var y = pawn.y;

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
        var pawn = coord.data.pawn;
        var range = [];
        var x = pawn.x;
        var y = pawn.y;
        range = coordManager.getHVRange(x, y, 'all');
        return range;
    }
});

Career.in('pao', {
    range: function(coord, coordManager) {
        var pawn = coord.data.pawn;
        var range = [];
        var x = pawn.x;
        var y = pawn.y;

        range = coordManager.getHVRange(x, y, 'all');

        var aimRange = [];

        $.each(range, function(i, pos){
            var item = coordManager.getItem(pos[0], pos[1]);
            if(!item.data.isEmpty){
                var cpawn = item.data.pawn;
                var type = cpawn.index < pawn.index ? 'before' : 'after';
                aimRange = coordManager.getRange(cpawn.x, cpawn.y, 'before');
                aimRange = coordManager.notEmpty(aimRange);
            }
        });
        range.concat(aimRange);

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
        var pawn = coord.data.pawn;
        var role = pawn.role;
        var range = [];
        var x = pawn.x;
        var y = pawn.y;
        var num = role == "r" ? 1 : -1;

        range.push([x, y + num]);

        if (belong != role) {
            range = range.concat([x - 1, y], [x + 1, y]);
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