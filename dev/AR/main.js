enchant();
window.onload = function() {
    var game = new Core(960, 640);
    game.onload = function() {
        var scene = new ARScene3D();
        var cube = new Cube();
        scene.base.addChild(cube);
    };
    game.start();
};
