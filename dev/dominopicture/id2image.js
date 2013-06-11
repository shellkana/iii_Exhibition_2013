enchant();
var url;
var game;
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
    game = new Core(960, 640);
    game.onload = function() {
        var inputScene = new Scene();
        var textarea = new InputTextBox();
        inputScene.addChild(textarea);
        var button = new Button("ok");
        button.x = textarea.width;
        inputScene.addChild(button);
        game.pushScene(inputScene);
        button.on('touchend', function() {
            loadJS('https://api.twitter.com/1/users/show.json?screen_name=' + textarea.value + '&include_entities=true&callback=draw');
            game.popScene();
        });
    };
    game.start();
};
function loadJS(src) {
    var script = document.createElement('script');
    script.src = src;
    document.head.appendChild(script);
};

function draw(data) {
    loadJS('http://localhost:8888/domino/jsonp.php?callback=twitter&image_url=' + data.profile_image_url);
    url = data.profile_image_url;
};

function twitter(data) {
    console.log(data);
    var canvas = document.getElementById("c");
    var ctx = canvas.getContext("2d");
    var image = new Image();
    var base64 = "data:image/" + url.split(".")[1] + ";base64," + data;
    image.src = base64;
    image.onload = function() {
        ctx.drawImage(image, 0, 0, 40, 40);
        var imgData2 = ctx.getImageData(0, 0, 40, 40);
        var colorData = imgData2.data;
        console.log(colorData);
        var scene = new ARScene3D();
        var dstacks = new DominoStack();
        dstacks.scale(0.25, 0.25, 0.25);
        dstacks.x = -3;
        dstacks.y = 3.5;
        scene.base.addChild(dstacks);
        var parent = new Sprite3D();
        parent.x = -3;
        parent.y = 3.5;
        parent.scale(0.25, 0.25, 0.25);
        scene.base.addChild(parent);
        var dominos = [];
        for (var i = 0; i < 40; i++) {
            dominos[i] = [];
            dominos[i][0] = new Domino();
            dominos[i][0].mesh.setBaseColor([colorData[(40 * 39 + i) * 4] / 255, colorData[(40 * 39 + i) * 4 + 1] / 255, colorData[(40 * 39 + i) * 4 + 2] / 255, 1]);
            console.log([colorData[i * 4] / 255, colorData[i * 4 + 1] / 255, colorData[i * 4 + 2] / 255, 1]);
            dominos[i][0].group = dominos[i];
            dominos[i][0].onPitchChange = function(rad) {
                for (var ii = 1; ii < 40; ii++) {
                    this.group[ii].pitch = rad;
                }
            };
            dstacks.pushDomino(dominos[i][0]);
            for (var j = 1; j < 40; j++) {
                dominos[i][j] = new Dammy();
                dominos[i][j].x = j * 1.1;
                dominos[i][j].y = -i * 0.75;
                dominos[i][j].mesh.setBaseColor([colorData[((39 - j ) * 40 + i) * 4] / 255, colorData[((39 - j) * 40 + i) * 4 + 1] / 255, colorData[((39 - j) * 40 + i) * 4 + 2] / 255, 1]);
                parent.addChild(dominos[i][j]);
            }
        }
        game.rootScene.on('touchend', function() {
            dominos[0][0].pitch = 0.01;
        });
    }
};
