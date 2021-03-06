(function(){
	var Actor = $.soul.instance('actor');
	var crowd = {
		"0":{"role":"r","career":"che"},
		"1":{"role":"r","career":"ma"},
		"2":{"role":"r","career":"xiang"},
		"3":{"role":"r","career":"shi"},
		"4":{"role":"r","career":"shuai"},
		"5":{"role":"r","career":"shi"},
		"6":{"role":"r","career":"xiang"},
		"7":{"role":"r","career":"ma"},
		"8":{"role":"r","career":"che"},
		"19":{"role":"r","career":"pao"},
		"25":{"role":"r","career":"pao"},
		"27":{"role":"r","career":"zu"},
		"29":{"role":"r","career":"zu"},
		"31":{"role":"r","career":"zu"},
		"33":{"role":"r","career":"zu"},
		"35":{"role":"r","career":"zu"},
		"54":{"role":"b","career":"zu"},
		"56":{"role":"b","career":"zu"},
		"58":{"role":"b","career":"zu"},
		"60":{"role":"b","career":"zu"},
		"62":{"role":"b","career":"zu"},
		"64":{"role":"b","career":"pao"},
		"70":{"role":"b","career":"pao"},
		"81":{"role":"b","career":"che"},
		"82":{"role":"b","career":"ma"},
		"83":{"role":"b","career":"xiang"},
		"84":{"role":"b","career":"shi"},
		"85":{"role":"b","career":"shuai"},
		"86":{"role":"b","career":"shi"},
		"87":{"role":"b","career":"xiang"},
		"88":{"role":"b","career":"ma"},
		"89":{"role":"b","career":"che"}
	};
	Actor.fill(crowd);

	var coordManager = $.coord.instance({
        box: $('#qizi_area'),
		row:9,
        col:10,
        width:56,
        height:56,
        offset:0,//-40
        onClick:onCoordClick
    });
    coordManager.cube.run(function(item, index){
    	if(item.index > 45){
    		item.data.belong = 'b';
    	}else{
    		item.data.belong = 'r';
    	}
    	var el = $('<li>');
        el.attr({
            'class':'item empty',
            'index':item.index
        }).css({
            'top':item.top,
            'left':item.left
        });
        item.data.el = el;
        coordManager.box.append(el);
    });

    Actor.run(function(pawn, key){
        var coord = coordManager.getItemByIndex(key);
        coord.data.el.attr('class', 'item ' + pawn.role+'-'+pawn.career);
        coord.data.pawn = pawn;
        coord.data.isEmpty = false; 
    });
    
    function move(startCoord, endCoord){
        var pawn = startCoord.data.pawn;

		endCoord.data.isEmpty = false;
        endCoord.data.pawn = pawn;
		endCoord.data.el.attr('class', 'item ' + pawn.role+'-'+pawn.career); 

		startCoord.data.isEmpty = true;
        startCoord.data.pawn = null;
		startCoord.data.el.attr('class', 'item empty'); 
    }

	function hover(el, is_hover){
        is_hover ? el.addClass('hover') : el.removeClass('hover');
    }

	function rangeHover(range, isOn){
		range.forEach(function(index){
			var coord = coordManager.getItemByIndex(index);
			isOn ? hover(coord.data.el, true) : hover(coord.data.el, false);
		})
	}
	var game = {
		round: 0,
		actor:{
			role: 'r',
			status: 0,
			coord:null,
			range:null
		},
		status: 'doing'
	};

	function onCoordClick(coord){
		var pawn = coord.data.pawn;
		var actor = game.actor;

		if(game.status != 'doing'){
			return false;
		}

		if(actor.status == 0){
			if(!pawn){
				return false;
			}
			if(pawn && actor.role != pawn.role){
				return false;
			}
			actor.status = 1;
			actor.coord = coord;
			actor.range = getCareerRange(coord);
			// hover(pawn.el, true);
			rangeHover(actor.range, true);
		}else{
			var is_range = $.inArray(coord.index, actor.range) != -1;
			if(is_range){
				move(actor.coord, coord);
				actor.role = actor.role == 'r' ? 'b' : 'r';
			}
			// hover(actor.pawn, false);
			rangeHover(actor.range, false);
			actor.status = 0;
			actor.coord = null;
			actor.range = null;
		}
	}

	function getCareerRange(coord){
		var ret = [];
		var range = Career.getActRange(coord, coordManager);
		return range;
	}
})();