enchant();
window.onload = function() {
    var game = new Core(960, 640);
    game.preload('floor.png');
    game.onload = function() {
        var scene = new Scene3D();
        scene.getCamera().x = 26;
        scene.getCamera().y = 18;
        scene.getCamera().z = 2;
        scene.getCamera().centerX = 5;
        scene.getCamera().centerY = -5;
        scene.getCamera().centerZ = -10;
        scene.getCamera().upVectorX = 0;
        scene.getCamera().upVectorY = 0;
        scene.getCamera().upVectorZ = 1;
        var theta = 0;
        var phi = 0;
        var offsetX = 0;
        var offsetY = 0;
        var matrix = mat4.create();
        var parent = new Sprite3D();
        scene.addChild(parent);
        parent.addEventListener('touchstart', function(e) {
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
        });
        var floor = new PlaneXY();
        floor.z = -10;
        floor.scale(250, 250, 1);
        floor.mesh.texture = new Texture("floor.png");
        parent.addChild(floor);
        var sky = new Sphere(250);
        sky.mesh.reverse();
        sky.mesh.setBaseColor('#00ffff');
        sky.mesh.texture.ambient = [1.0, 1.0, 1.0, 1.0];
        sky.mesh.texture.diffuse = [0.0, 0.0, 0.0, 1.0];
        sky.mesh.texture.specular = [0.0, 0.0, 0.0, 1.0];
        scene.addChild(sky);
        var dstack = new DominoStack();
        dstack.z = -10;
        parent.addChild(dstack);
        var d = new Domino();
        //d.roll = Math.PI / 4;
        d.pitch = 0.01;
        dstack.pushDomino(d);
        var d3 = new Domino();
        d3.roll = Math.PI / 12;
        dstack.pushDomino(d3);
        for (var i = 0; i < 20; i++) {
            var d2 = new Domino();
            d2.roll = Math.PI / 24;
            dstack.pushDomino(d2);
        }
        var d4 = new Domino();
        dstack.pushDomino(d4, 1.0);
    };
    game.start();
};
