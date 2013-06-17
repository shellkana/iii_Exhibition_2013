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
                this._hasBaseId = false;
                var mkSize = (markerSize) ? markerSize : 20;
                var core = enchant.Core.instance;
                this.posit = new POS.Posit(mkSize, core.width);
                this.base = base;
                this.video = document.getElementById("video");
                this.detector = null;
                this.onDetect = [];
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
                this.on('enterframe', function() {
                    if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
                        this.snapshot();
                        var markers = this.detector.detect(this.imageData);
                        if (this._hasBaseId) {
                            for (var i = 0; i < markers.length; i++) {
                                if (markers[i].id === parseInt(this._baseId)) {
                                    this.applyMarker2Sprite3D(markers[i], this.base);
                                } else if (this.onDetect[markers[i].ids]) {
                                    this.onDetect[makers[i].ids](makers[i]);
                                }
                            }
                        } else if (markers.length > 0) {
                            this.applyMarker2Sprite3D(markers[0], this.base);
                        }
                        //drawCorners(markers);
                        //drawId(markers);
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
            applyMarker2Sprite3D : function(marker, obj) {
                var corners = marker.corners;
                for (var i = 0; i < corners.length; ++i) {
                    var corner = corners[i];
                    corner.x = corner.x - (core.width / 2);
                    corner.y = (core.height / 2) - corner.y;
                }
                var pose = this.posit.pose(corners);
                obj.x = pose.bestTranslation[0] / 17;
                obj.y = pose.bestTranslation[1] / 17;
                obj.z = -pose.bestTranslation[2] / 9;
                var b = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1];
                // @formatter:off
                var mat = [
                    pose.bestRotation[0][0], pose.bestRotation[1][0], pose.bestRotation[2][0], 0,
                    pose.bestRotation[0][1], pose.bestRotation[1][1], pose.bestRotation[2][1], 0,
                    pose.bestRotation[0][2], pose.bestRotation[1][2], pose.bestRotation[2][2], 0,
                    0, 0, 0, 1
                ];
                // @formatter:on
                obj.rotation = mat4.multiply(mat4.multiply(b, mat, mat4.create()), b);

            },
            baseId : {
                set : function(value) {
                    this._hasBaseId = true;
                    this._baseId = value;
                },
                get : function(value) {
                    return this._baseId;
                }
            },
            snapshot : function() {
                var core = enchant.Core.instance;
                this.context.drawImage(this.video, 0, 0, core.width, core.height);
                this.imageData = this.context.getImageData(0, 0, core.width, core.height);
            }
        });
    }());
}
