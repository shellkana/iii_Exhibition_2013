enchant();
var Dammy = Class.create(Sprite3D, {
    initialize : function(width, height, depth) {
        Sprite3D.call(this);
        this.mesh = enchant.gl.Mesh.createDomino(width, height, depth);
        this._pitch = 0;
    },
    pitch : {
        set : function(rad) {
            this.rotatePitch(rad - this._pitch);
            this._pitch = rad;
        },
        get : function() {
            return this._pitch;
        }
    }
});
window.onload = function() {
    var game = new Core(960, 640);
    game.onload = function() {
        var scene = new ARScene3D();
        var dstacks = new DominoStack();
        dstacks.scale(0.3, 0.3, 0.3);
        dstacks.x = -1;
        dstacks.y = 5;
        scene.base.addChild(dstacks);
        var parent = new Sprite3D();
        parent.x = -1;
        parent.y = 5;
        parent.scale(0.3, 0.3, 0.3);
        scene.base.addChild(parent);
        var dominos = [];
        for (var i = 0; i < 40; i++) {
            dominos[i] = [];
            dominos[i][0] = new Domino();
            dominos[i][0].group = dominos[i];
            dominos[i][0].onPitchChange = function(rad) {
                for (var ii = 1; ii < 40; ii++) {
                    this.group[ii].pitch = rad;
                }
            };
            dstacks.pushDomino(dominos[i][0]);
            for (var j = 1; j < 40; j++) {
                dominos[i][j] = new Dammy();
                dominos[i][j].x = j *1.1;
                dominos[i][j].y = -i * 0.75;
                parent.addChild(dominos[i][j]);
            }
        }

        game.rootScene.on('touchend', function() {
            dominos[0][0].pitch = 0.01;
        });
    };
    game.start();
};
function loadJS(src) {
    var script = document.createElement('script');
    script.src = src;
    console.log(src);
    document.head.appendChild(script);
}
loadJS('http://localhost:8888/domino/jsonp.php?callback=twitter&image_url=' + document.URL.split("?")[1]);