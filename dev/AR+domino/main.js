enchant();
window.onload = function() {
    var game = new Core(960, 640);
    game.onload = function() {
        var scene = new ARScene3D();
        var dstack = new DominoStack();

        // dstack.x = 3.5;
        // dstack.y = 0.5;
        // dstack.z = -10;

        scene.base.addChild(dstack);
        var d = new Domino();
        d.onFallStart = function() {
            d.mesh.setBaseColor([1, 0, 1, 1]);
        }
        //d.roll = Math.PI / 4;
        game.rootScene.on('touchend', function() {
            if (d.pitch === 0) {
                d.pitch = 0.01;
                d.mesh.setBaseColor([1, 0, 1, 1]);
            }
        });
        dstack.pushDomino(d);
        for (var i = 0, l = 24; i < l; i++) {
            var d2 = new Domino();
            d2.roll = (Math.floor(i / 24) % 2 === 0) ? -Math.PI / 15 : Math.PI / 15;
            d2.id = i;
            d2.onFallStart = function() {
                this.mesh.setBaseColor(parseTempToColor(this.id + 1, l, 0));
            };
            dstack.pushDomino(d2);
        }
    };
    game.start();
};
var parseTempToColor = function(temp, maxTemp, minTemp) {
    qtTemp = (maxTemp - minTemp) / 5;
    if (temp < minTemp) {
        temp = minTemp;
    } else if (temp > maxTemp) {
        temp = maxTemp;
    }
    if (temp < (minTemp + qtTemp)) {
        color = [1 - (temp - minTemp) / qtTemp, 0, 1, 1];
    } else if (temp < (minTemp + qtTemp * 2)) {
        color = [0, (temp - minTemp - qtTemp) / qtTemp, 1, 1];
    } else if (temp < (minTemp + 3 * qtTemp)) {
        color = [0, 1, (3 - (temp - minTemp) / qtTemp), 1];
    } else if (temp < (minTemp + 4 * qtTemp)) {
        color = [(temp - minTemp) / qtTemp - 3, 1, 0, 1];
    } else {
        color = [1, ((maxTemp - temp) / qtTemp), 0, 1];
    }
    return color;
};