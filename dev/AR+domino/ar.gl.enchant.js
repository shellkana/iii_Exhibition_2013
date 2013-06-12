/**
 * @fileOverview
 * ar.gl.enchant.js
 * @version 0.0.1
 * @require gl.enchant.js v0.3.5+
 * @author shellkana.
 *
 * @description
 * Augmented Reality objects for gl.enchant.js
 */
if ( typeof AR === 'undefined') {
    throw new Error('ar.gl.enchant.js must be loaded after aruco.js');
}
if (enchant.gl !== undefined) {( function() {
        enchant.gl.ar = {};
        enchant.gl.ar.ARScene3D = enchant.Class.create(enchant.gl.Scene3D, {
            initialize : function(markerSize) {
                enchant.gl.Scene3D.call(this);
                this.getCamera().z = 0;
                this.getCamera().centerZ = -1;
                this.base = new enchant.gl.primitive.PlaneXY();
                this.addChild(this.base);
                this.screen = new enchant.gl.ar.VideoTexturePlaneXY(markerSize, this.base);
                this.addChild(this.screen);
                optimizeSprite3dForTextureScene(this.screen);
            }
        });
        enchant.gl.ar.VideoTexturePlaneXY = enchant.Class.create(enchant.gl.primitive.PlaneXY, {
            initialize : function(markerSize, base) {
                enchant.gl.primitive.PlaneXY.call(this, 8.5);
                var core = enchant.Core.instance;
                this.z = -49;
                this.scaleX = core.width / core.height;

                var mkSize = (markerSize) ? markerSize : 20;
                var core = enchant.Core.instance;
                this.posit = new POS.Posit(mkSize, core.width);
                this.base = base;
                this.video = document.getElementById("video");
                this.detector = null;
                navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
                if (navigator.getUserMedia) {
                    navigator.getUserMedia({
                        video : true
                    }, successCallback, errorCallback);

                    function successCallback(stream) {
                        if (window.webkitURL) {
                            this.video.src = window.webkitURL.createObjectURL(stream);
                        } else {
                            this.video.src = stream;
                        }
                    }

                    function errorCallback(error) {
                    }


                    this.detector = new AR.Detector();
                }
                this.flag = true;
                this.on('enterframe', function() {
                    if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
                        this.snapshot();
                        var markers = this.detector.detect(this.imageData);
                        for (var i = 0, l = markers.length; i < l; i++) {
                            if (markers[i].id === 1001) {
                                var corners = markers[0].corners;
                                for (var i = 0; i < corners.length; ++i) {
                                    var corner = corners[i];
                                    corner.x = corner.x - (core.width / 2);
                                    corner.y = (core.height / 2) - corner.y;
                                }
                                var pose = this.posit.pose(corners);
                                this.base.x = pose.bestTranslation[0] / 17;
                                this.base.y = pose.bestTranslation[1] / 17;
                                this.base.z = -pose.bestTranslation[2] / 9;
                                var b = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1];
                                // @formatter:off
                                var mat = [
                                    pose.bestRotation[0][0], pose.bestRotation[1][0], pose.bestRotation[2][0], 0,
                                    pose.bestRotation[0][1], pose.bestRotation[1][1], pose.bestRotation[2][1], 0,
                                    pose.bestRotation[0][2], pose.bestRotation[1][2], pose.bestRotation[2][2], 0,
                                    0, 0, 0, 1
                                ];
                                // @formatter:on
                                this.base.rotation = mat4.multiply(mat4.multiply(b, mat, mat4.create()), b);
                            } else if (this.flag) {
                                console.log(markers[i].id);
                                this.flag = false;
                                console.log("fall");
                            }
                            //drawCorners(markers);
                            //drawId(markers);
                        }
                    }
                });
                var sceneTexture = new SceneTexture();
                var textureSprite = new enchant.Sprite(core.width, core.height);
                var surface = new enchant.Surface(core.width, core.height);
                this.context = surface.context;
                textureSprite.image = surface;
                sceneTexture.addChild(textureSprite);
                this.mesh.texture.src = sceneTexture._element;
            },
            snapshot : function() {
                var core = enchant.Core.instance;
                this.context.drawImage(this.video, 0, 0, core.width, core.height);
                this.imageData = this.context.getImageData(0, 0, core.width, core.height);
            }
        });
    }());
}
