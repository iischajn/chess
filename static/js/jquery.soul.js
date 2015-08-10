/*
放置能量的空间
in 存放能量，key无效则自动生成id，并将key加入映射列表
out 取出则视为删除
get 获取
sort 按传入方法进行映射排序
run 遍历运行能量，如果能量为方法，则以传入参数为自变量，否则以传入参数为处理方法运行，并返回处理结果。
exist 该能量是否存在
fill 一次性填入能量池
drain 抽取能量池
*/ 

(function($) {    
    function Cube(){
        this.memory= {};
        this.map = [];
    }

    $.extend(Cube.prototype, {
        in: function(key, energy) {
            if(key == null){
                key = Math.round((new Date()).getTime() * Math.random());
            }
            this.memory[key] = energy;
            if(this.map.indexOf(key) == -1) {
                this.map.push(key);
            }
            return key;
        },
        out: function(key) {
            var energy = this.memory[key];
            delete this.memory[key];
            return energy;
        },
        get: function(key) {
            var energy = this.memory[key];
            return energy;
        },
        sort: function(fn) {
            this.map.sort(function(a, b) {
                return fn(a, b);
            });
        },
        run: function(of) {
            var raw = [], i, len, energy, item, key;
            var is_continue = true;
            for(i = 0, len = this.map.length; i < len; i++) {
                key = this.map[i];
                energy = this.memory[key];
                if(typeof energy == 'function') {
                    item = energy(of,key);
                } else if(typeof of == 'function') {
                    item = of(energy,key);
                } else {
                    item = energy;
                }
                if(item){
                    raw.push(item);
                }
            }
            return raw;
        },
        exist: function(key) {
            return this.memory[key] ? true : false;
        },
        fill: function(energies) {
            this.map = [];
            this.memory = energies;
            for(var i in energies){
                this.map.push(i);
            }
        },
        drain: function(key) {
            var raw = this.memory;
            this.memory = {};
            this.map = [];
            return raw;
        }
    });

    $.cube = {};
    $.cube.instance = function(){
        return new Cube();
    }
    
}(jQuery));


/*
进化
grow 成长 可注册多级命名 is_keep指是否保持
create 直接命名注册
activate 多级方法执行
*/ 
(function($) {    
    function Egg(){}

    $.extend(Egg.prototype, {
        deep:function(ns, success, fail){
            var NSList = ns.split('.'),
                step = this,
                k = null;
            k = NSList.shift();
            while(k) {
                if(NSList.length) {
                    if(step[k] === undefined) {
                       var off = fail(step, k);
                       if(off){
                           return;
                       }
                    }
                    step = step[k];
                } else {
                    success(step, k);
                }
                k = NSList.shift();
            }
            return 
        },
        grow: function(ns, fn, is_keep) {
            var that = this;
            this.deep(ns, function(deepObj, name){
                deepObj[name] = is_keep ? fn : fn(that);
            },function(deepObj, name){
                deepObj[name] = {};
            });
        },
        create: function(ns, fn) {
            var k;
            if(this[ns] !== undefined) {
                throw '[' + ns + '] : short : has been register';
            } else if(typeof ns == 'string') {
                this[ns] = fn;
            } else if(typeof ns == 'object') {
                for(k in ns) {
                    this.create(k, ns[k]);
                }
            }
        },
        activate: function(ns){
            this.deep(ns, function(deepObj, name){
                deepObj[name] && deepObj[name]();
            },function(){
                return true;
            });
        }
    });

    $.egg = {};
    $.egg.instance = function(){
        return new Egg();
    }
}(jQuery));

//灵魂 赋予能量为源，赋予空间为力，以创新生
(function($) {    
    function Soul(ns){
        this.create('id', ns);
    }
    $.extend(Soul.prototype, $.cube.instance(), $.egg.instance());

    $.soul = {};
    $.soul.instance = function(ns){
        return new Soul(ns);
    }
}(jQuery));