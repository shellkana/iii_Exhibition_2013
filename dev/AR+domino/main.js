enchant();
window.onload = function() {
    var game = new Core(960, 640);
    game.preload({
        key : "Mac.png"
    });
    game.onload = function() {
        //ヒントシーン
        var cursor = new Sprite(game.assets["key"].width, game.assets["key"].height);
        cursor.image = game.assets["key"];
        cursor.x = (-cursor.width + 800) / 2;
        cursor.y = (-cursor.height + 600) / 2;
        var alertScene = new AlertScene('操作方法');
        alertScene.childNodes[1].addChild(cursor);
        var hintButton = new Button('ヒント');
        game.rootScene.addChild(hintButton);
        hintButton.on('touchend', function() {
            game.pushScene(alertScene);
        });
        //ここから3Dシーン
        var scene = new ARScene3D();
        var dstack = new DominoStack();
        dstack.scale(0.7, 0.7, 0.7);
        scene.base.addChild(dstack);
        var d = new Domino();
        d.onFallStart = function() {
            d.mesh.setBaseColor([1, 0, 1, 1]);
        }
        d.roll = Math.PI / 4;
        d.on('touchend', function() {
            if (d.pitch === 0) {
                d.pitch = 0.01;
                d.mesh.setBaseColor([1, 0, 1, 1]);
            }
        });
        dstack.pushDomino(d);
        var i = 0, l = 0;
        game.rootScene.on(Event.UP_BUTTON_DOWN, function() {
            var d2 = new Domino();
            d2.id = i;
            d2.onFallStart = function() {
                this.mesh.setBaseColor(parseTempToColor(this.id + 1, i, 0));
            };
            d2.on('touchend', function() {
                if (this.pitch === 0) {
                    this.pitch = 0.01;
                }
            });
            dstack.pushDomino(d2);
            i++;
        });
        game.rootScene.on(Event.LEFT_BUTTON_DOWN, function() {
            var d2 = new Domino();
            d2.id = i;
            d2.roll = Math.PI / 12;
            d2.onFallStart = function() {
                this.mesh.setBaseColor(parseTempToColor(this.id + 1, i, 0));
            };
            d2.on('touchend', function() {
                if (this.pitch === 0) {
                    this.pitch = 0.01;
                }
            });
            dstack.pushDomino(d2);
            i++;
        });
        game.rootScene.on(Event.RIGHT_BUTTON_DOWN, function() {
            var d2 = new Domino();
            d2.id = i;
            d2.roll = -Math.PI / 12;
            d2.onFallStart = function() {
                this.mesh.setBaseColor(parseTempToColor(this.id + 1, i, 0));
            };
            d2.on('touchend', function() {
                if (this.pitch === 0) {
                    this.pitch = 0.01;
                }
            });
            dstack.pushDomino(d2);
            i++;
        });
        game.rootScene.on(Event.DOWN_BUTTON_DOWN, function() {
            dstack.initDominos();
            dstack.popDomino();
            i--;
        });
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
