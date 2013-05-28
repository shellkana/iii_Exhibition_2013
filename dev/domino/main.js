enchant();
window.onload = function() {
    var game = new Core(960, 640);
    game.preload('floor.png');
    game.onload = function() {
        var scene = new Scene3D();
        var theta = 0;
        //Math.PI / 2;
        scene.getCamera().x = 30 * Math.sin(theta);
        scene.getCamera().y = 30 * Math.cos(theta);
        scene.getCamera().z = 2;
        scene.getCamera().centerZ = -10;
        scene.getCamera().upVectorX = 0;
        scene.getCamera().upVectorY = 0;
        scene.getCamera().upVectorZ = 1;
        var phi = 0;
        var offsetX = 0;
        var offsetY = 0;
        var matrix = mat4.create();
        var parent = new Sprite3D();
        scene.addChild(parent);
        /*parent.addEventListener('touchstart', function(e) {
         offsetX = Math.floor(e.x);
         offsetY = Math.floor(e.y);
         });
         parent.addEventListener('touchmove', function(e) {
         theta -= (e.x - offsetX) / 160;
         offsetX = e.x;
         phi -= (e.y - offsetY) / 160;
         offsetY = e.y;
         mat4.identity(matrix);
         mat4.rotateY(matrix, -theta);
         mat4.rotateX(matrix, -phi);
         parent.rotation = matrix;
         });*/
        var phase = "one";
        var dst = new DominoStack();
        dst.x = 0.8 * Math.sin(Math.PI / 3);
        dst.y = 0.8 * Math.cos(Math.PI / 3);
        dst.z = -12;
        var domino1 = new Domino();
        domino1.roll = -Math.PI / 3 + Math.PI;
        dst.pushDomino(domino1);
        var domino2 = new Domino();
        dst.pushDomino(domino2);
        var domino3 = new Domino();
        dst.pushDomino(domino3);
        var domino4 = new Domino();
        dst.pushDomino(domino4);
        scene.addChild(dst);
        parent.on('enterframe', function() {
            if (phase === "two") {
                dst.z += (dst.z < -10) ? 0.02 : 0;
            }
            if (d.pitch !== 0 && d.pitch !== Math.PI / 2) {
                theta -= Math.PI / 155;
                scene.getCamera().x = 30 * Math.sin(theta);
                scene.getCamera().y = 30 * Math.cos(theta);
            } else if (d.pitch === Math.PI / 2) {
                scene.getCamera().x /= (scene.getCamera().x < 0.01) ? 1.1 : 1;
                scene.getCamera().y /= (scene.getCamera().y < 0.01) ? 1.1 : 1;
                scene.getCamera().z *= (scene.getCamera().z < 30) ? 1.1 : 1;
                if (phase === "two" && scene.getCamera().z > 30) {
                    if (dst.z > -10) {
                        domino1.pitch = 0.01;
                        phase = "three";
                    }
                }
            }
        });
        var floor = new PlaneXY();
        floor.z = -10;
        floor.scale(50, 50, 1);
        floor.mesh.texture = new Texture(game.assets["floor.png"]);
        parent.addChild(floor);
        var sky = new Sphere(250);
        sky.mesh.reverse();
        sky.mesh.setBaseColor('#00ffff');
        sky.mesh.texture.ambient = [1.0, 1.0, 1.0, 1.0];
        sky.mesh.texture.diffuse = [0.0, 0.0, 0.0, 1.0];
        sky.mesh.texture.specular = [0.0, 0.0, 0.0, 1.0];
        scene.addChild(sky);
        var dstack = new DominoStack();
        dstack.x = 3.5;
        dstack.y = 0.5;
        dstack.z = -10;
        parent.addChild(dstack);
        var d = new Domino();
        d.onFallStart = function() {
            d.mesh.setBaseColor([1, 0, 1, 1]);
        }
        //d.roll = Math.PI / 4;
        game.rootScene.on('touchend', function() {
            if (d.pitch === 0) {
                d.pitch = 0.01;
                d.mesh.setBaseColor([1, 0, 1, 1]);
                phase = "two";
            }
        });
        dstack.pushDomino(d);
        for (var i = 0; i < 24; i++) {
            var d2 = new Domino();
            d2.roll = -Math.PI / 15;
            d2.id = i;
            d2.onFallStart = function() {
                this.mesh.setBaseColor(parseTempToColor(this.id + 1, 24, 0));
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
