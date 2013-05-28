enchant();
window.onload = function() {
    var game = new Core(960, 640);
    game.preload('floor.png');
    game.onload = function() {
        var scene = new Scene3D();
        scene.getCamera().x = 20;
        scene.getCamera().y = 10;
        scene.getCamera().z = 2;
        scene.getCamera().centerY = -3
        scene.getCamera().upVectorX = 0;
        scene.getCamera().upVectorY = 0;
        scene.getCamera().upVectorZ = 1;
        var sky = new Sphere(250);
        var floor = new PlaneXY();
        floor.z = 0;
        floor.scale(250, 250, 1);
        floor.mesh.texture = new Texture("floor.png");
        scene.addChild(floor);
        sky.mesh.reverse();
        sky.mesh.setBaseColor('#00ffff');
        sky.mesh.texture.ambient = [1.0, 1.0, 1.0, 1.0];
        sky.mesh.texture.diffuse = [0.0, 0.0, 0.0, 1.0];
        sky.mesh.texture.specular = [0.0, 0.0, 0.0, 1.0];
        scene.addChild(sky);
        var dstack = new DominoStack();
        scene.addChild(dstack);
        var d = new Domino();
        //d.roll = Math.PI / 4;
        d.pitch = 0.01;
        dstack.pushDomino(d);
        var d3 = new Domino();
        d3.roll = Math.PI / 6;
        dstack.pushDomino(d3);
        for (var i = 0; i < 10; i++) {
            var d2 = new Domino();
            d2.roll = Math.PI / 24;
            dstack.pushDomino(d2);
        }
    };
    game.start();
};
