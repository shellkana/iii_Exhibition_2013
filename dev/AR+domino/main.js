enchant();
window.onload = function() {
    var game = new Core(960, 640);
    game.preload({
        key : "Mac.png",
        sound : "oto6.m4a"
    });
    game.onload = function() {
        var otos = [];
        for (var i = 0; i < 10; i++) {
            otos[i] = game.assets['sound'].clone();
        }
        var scene = new ARScene3D();
        var dstack = new DominoStack();
        //dstack.scale(0.9, 0.9, 0);
        dstack.x = -3;
        scene.base.addChild(dstack);
        var d = new Domino();
        d.onFallStart = function() {
            //d.mesh.setBaseColor([1, 0, 1, 1]);
            otos[9].play();
        }
        d.roll = Math.PI / 4;
        d.on('enterframe', function() {
            if (!d.isFalling && !scene.screen.flag) {
                d.pitch = 0.01;
                d._omega = 0.5;
                d.isFalling = true;
                d.mesh.setBaseColor([1, 0, 1, 1]);
            }
        });
        d.on('touchend', function() {
            if (d.pitch === 0) {
                d.pitch = 0.01;
                //d.mesh.setBaseColor([1, 0, 1, 1]);
            }
        });
        d.mesh.setBaseColor([0, 0, 1, 1]);
        dstack.pushDomino(d);
        var i = 0, l = 0;
        game.rootScene.on(Event.UP_BUTTON_DOWN, function() {
            var d2 = new Domino();
            d2.id = i;
            d2.mesh.setBaseColor([0, 0, 1, 1]);
            d2.onFallStart = function() {
                //this.mesh.setBaseColor(parseTempToColor(this.id + 1, i, 0));
                otos[this.id % 10].play();
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
            d2.mesh.setBaseColor([0, 0, 1, 1]);
            d2.roll = Math.PI / 12;
            d2.onFallStart = function() {
                //this.mesh.setBaseColor(parseTempToColor(this.id + 1, i, 0));
                otos[this.id % 10].play();
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
            d2.mesh.setBaseColor([0, 0, 1, 1]);
            d2.roll = -Math.PI / 12;
            d2.onFallStart = function() {
                //this.mesh.setBaseColor(parseTempToColor(this.id + 1, i, 0));
                otos[this.id % 10].play();
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
            scene.screen.flag = true;
            d.isFalling = false;
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
