enchant();
window.onload = function() {
    var game = new Core(960, 640);
    game.preload({
        key : "Mac.png"
    });
    game.onload = function() {
        //変数
        var offsetX = 0;
        //変数ラベル
        var rot = new Label();
        rot.font = '100px serif';
        rot.width = getElementMetrics("145度", '100px serif').width;
        rot.text = "45度";
        rot.x = 800 / 2 - rot.width / 2;
        rot.y = 600 / 4 - 20;

        //ヒントシーン
        var cursor = new Sprite(game.assets["key"].width, game.assets["key"].height);
        cursor.image = game.assets["key"];
        cursor.x = (-cursor.width + 800) / 2;
        cursor.y = (-cursor.height + 600) / 2 - 20;
        var hintScene = new AlertScene();
        hintScene.childNodes[1].addChild(cursor);

        //回転シーン
        var rPlusButton = new enchant.widget.Button('+');
        rPlusButton.x = 800 * 3 / 4 - rPlusButton.width / 2 + 120;
        rPlusButton.y = 600 / 2;

        var rMinusButton = new enchant.widget.Button('-');
        rMinusButton.x = 800 * 1 / 4 - rPlusButton.width / 2 - 120;
        rMinusButton.y = 600 / 2;
        var rToggle = new enchant.widget.Button('');
        rToggle.height *= 2;
        rToggle.width /= 2;
        rToggle.x = 800 * 1 / 2 - rPlusButton.width / 2;
        rToggle.y = 600 / 2 - rToggle.height / 4;
        rToggle.on('touchstart', function(e) {
            offsetX = e.x;
        });
        rToggle.on('touchmove', function(e) {
            this.x -= offsetX - e.x;
            var max = rPlusButton.x - rToggle.width;
            var min = rMinusButton.x + rMinusButton.width;
            this.x = Math.max(min, this.x);
            this.x = Math.min(max, this.x);
            var pre = parseInt(rot.text.split('度')[0]);
            rot.text = (this.x - min) / (max - min) * 360 | 0;
            dstack.rotateRoll((pre - rot.text) / 180 * Math.PI);
            rot.text += "度";
            offsetX = Math.max(min, Math.min(max, e.x));
        });
        var rotateScene = new AlertScene();
        rotateScene.childNodes[1].addChild(rMinusButton);
        rotateScene.childNodes[1].addChild(rPlusButton);
        rotateScene.childNodes[1].addChild(rToggle);
        rotateScene.childNodes[1].addChild(rot);

        //ボタン群
        var hintButton = new Button('ヒント');
        hintButton.x = 0;
        hintButton.y = 0;
        game.rootScene.addChild(hintButton);
        hintButton.on('touchend', function() {
            game.pushScene(hintScene);
        });
        var rotateButton = new Button('回転');
        rotateButton.x = 200;
        rotateButton.y = 0;
        game.rootScene.addChild(rotateButton);
        rotateButton.on('touchend', function() {
            game.pushScene(rotateScene);
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
var getElementMetrics = function(string, font) {
    var e = document.createElement('div');
    var cvs = document.createElement('canvas');
    var ctx = cvs.getContext('2d');
    var arr, str, w;
    var width = 0;
    var height = 0;
    if (!font) {
        font = enchant.widget._env.font;
    }
    ctx.font = font;
    e.style.font = font;
    string = string || '';
    string = string.replace(/<(br|BR) ?\/?>/g, '<br>');
    arr = string.split('<br>');
    for (var i = 0, l = arr.length; i < l; i++) {
        str = arr[i];
        w = ctx.measureText(str).width;
        if (width < w) {
            width = w;
        }
    }

    e.innerHTML = string;

    if (document.body) {
        document.body.appendChild(e);
        height = parseInt(getComputedStyle(e).height, 10);
        e.style.position = 'absolute';
        width = parseInt(getComputedStyle(e).width, 10);
        document.body.removeChild(e);
    } else {
        height = 14 * arr.length;
    }

    return {
        width : width + 1,
        height : height + 1
    };
};
