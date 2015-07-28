var Limiter = $.soul.instance('limiter');
var Career = $.soul.instance('career');

Limiter.create('houseFilter', function(range, role) {
    var ret = [];
    var filter = role == 'r' ? [3, 4, 5, 12, 13, 14, 21, 22, 23] : [66, 67, 68, 75, 76, 77, 84, 85, 86];
    $.each(range, function(i, index) {
        $.inArray(filter, index) != -1 && ret.push(index);
    })
    return ret;
});

Limiter.create('wallFilter', function(range, role) {
    var ret = [];
    var filter = role == 'r' ? [2, 6, 18, 22, 26, 38, 44] : [47, 51, 63, 67, 71, 83, 87];
    $.each(range, function(i, index) {
        $.inArray(filter, index) != -1 && ret.push(index);
    })
    return ret;
});

Limiter.in('shuai', function(coord, range){
    return Limiter.houseFilter(range);
});

Limiter.in('shi', function(coord, range){
    return Limiter.houseFilter(range);
});

Limiter.in('xiang', function(coord, range){

        // pushRange([],[c_x-1,c_y-1]);
        // pushRange([],[c_x+1,c_y-1]);
        // pushRange([],[c_x-1,c_y+1]);
        // pushRange([],[c_x+1,c_y+1]);

    return Limiter.wallFilter(range);
});



Career.in('shuai', {
    range: function(coord) {
        var pawn = coord.data.pawn;
        var role = pawn.role;
        var range = [];
        var x = pawn.x;
        var y = pawn.y;

        range.push([x, y - 1]);
        range.push([x, y + 1]);
        range.push([x + 1, y]);
        range.push([x - 1, y]);

        return range;
    }
});
Career.in('shi', {
    range: function(coord) {
        var pawn = coord.data.pawn;
        var role = pawn.role;
        var range = [];
        var x = pawn.x;
        var y = pawn.y;

        range.push([x - 1, y - 1]);
        range.push([x + 1, y - 1]);
        range.push([x - 1, y + 1]);
        range.push([x + 1, y + 1]);

        return range;
    }
});

Career.in('xiang', {
    range: function(coord) {
        var pawn = coord.data.pawn;
        var role = pawn.role;
        var range = [];
        var x = pawn.x;
        var y = pawn.y;

        range.push([x-2,y-2]);
        range.push([x+2,y-2]);
        range.push([x-2,y+2]);
        range.push([x+2,y+2]);


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
            range.push([x - 1, y]);
            range.push([x + 1, y]);
        }

        return range;
    }
});
