enchant();
window.onload = function() {
    var game = new Core(960, 640);
    game.onload = function() {
        var scene = new Scene3D();
        box = new Cube();
        scene.addChild(cube);
    };
}; 