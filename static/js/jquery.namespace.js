jQuery.namespace = function(sSpace, root) {
    var arr = sSpace.split('.'),
        i = 0,
        nameI;
    if (sSpace.indexOf('.') == 0) {
        i = 1;
        root = root || jQuery;
    }
    root = root || window;
    for (; nameI = arr[i++];) {
        if (!root[nameI]) {
            root[nameI] = {};
        }
        root = root[nameI];
    }
    return root;
};