/**
 * @fileOverview
 * primitive.gl.enchant.js
 * @version 0.3.5
 * @require gl.enchant.js v0.3.5+
 * @author shellkana.
 *
 * @description
 * Domino objects for gl.enchant.js
 */

if (enchant.gl !== undefined) {( function() {
        enchant.gl.domino = {};
        enchant.gl.domino.DominoStack = enchant.Class.create(enchant.gl.Sprite3D, {
            initialize : function(distance) {
                enchant.gl.Sprite3D.call(this);
                if ( typeof distance === 'undefined') {
                    this._distance = 0.75;
                } else {
                    this._distance = distance;
                }
                this.lastDomino = null;
            },
            pushDomino : function(domino, distance) {
                if ( typeof distance === 'undefined') {
                    distance = this._distance;
                }
                this.addChild(domino);
                if (this.lastDomino !== null) {
                    this.lastDomino.nextDomino = domino;
                    this.lastDomino._distance = distance;
                    domino.roll += this.lastDomino.roll;
                    domino.x = this.lastDomino.x - Math.sin(-this.lastDomino.roll) * distance;
                    domino.y = this.lastDomino.y - Math.cos(-this.lastDomino.roll) * distance;
                }
                this.lastDomino = domino;
            },
            popDomino : function() {
                if (this.childNodes.length === 1)
                    return;
                this.removeChild(this.lastDomino);
                this.lastDomino = this.childNodes[this.childNodes.length - 1];
                this.lastDomino.nextDomino = null;
            },
            initDominos : function() {
                for (var i = 0, l = this.childNodes.length; i < l; i++) {
                    this.childNodes[i].pitch = 0;
                    this.childNodes[i]._omega = 0;
                    this.childNodes[i]._alpha = 0;
                    this.childNodes[i]._isFalling = false;
                }
            }
        });
        enchant.gl.domino.Domino = enchant.Class.create(enchant.gl.Sprite3D, {
            initialize : function(width, height, depth) {
                enchant.gl.Sprite3D.call(this);
                this.mesh = enchant.gl.Mesh.createDomino(width, height, depth);
                this._roll = 0;
                this._pitch = 0;
                this._omega = 0;
                this._alpha = 0;
                this._distance = 0;
                this.nextDomino = null;
                this._isFalling = false;
                this.onFallStart = null;
                this.on("enterframe", function() {
                    this._alpha = (this.pitch >= Math.PI / 2) ? 0 : 0.05 * Math.sin(this.pitch);
                    this._omega += this._alpha;
                    this.pitch += this._omega;
                    if (this.nextDomino !== null) {
                        if (this.pitch > Math.asin(this._distance / this.mesh._height)) {
                            if (!this.nextDomino._isFalling) {
                                this.nextDomino._omega = this._omega * 0.98;
                                this.nextDomino._isFalling = true;
                                if (this.nextDomino.onFallStart) {
                                    this.nextDomino.onFallStart();
                                }
                            }
                            if (this.nextDomino.pitch < Math.PI / 2) {
                                this.pitch = this.calculatePitch(this.nextDomino.pitch);
                            }
                        }
                    }
                    if (this.pitch > Math.PI / 2) {
                        this._omega = 0;
                        this.pitch = Math.PI / 2;
                    }
                });
            },
            calculatePitch : function(nextPitch) {
                var answer = 0;
                var x = Math.PI / 2 - nextPitch;
                var A = Math.pow(this.mesh._height / Math.sin(x), 2);
                var B = this.mesh._height * this._distance;
                var C = this._distance * this._distance + this.mesh._height * this.mesh._height - A;
                if (x != 0) {
                    answer = Math.acos((B + Math.sqrt(B * B - A * C)) / A);
                }
                if (isNaN(answer)) {
                    answer = 0;
                }
                return Math.PI / 2 - answer;
            },
            pitch : {
                set : function(rad) {
                    this.rotatePitch(rad - this._pitch);
                    this._pitch = rad;
                },
                get : function() {
                    return this._pitch;
                }
            },
            roll : {
                set : function(rad) {
                    this.rotateRoll(rad - this._roll);
                    this._roll = rad;
                },
                get : function() {
                    return this._roll;
                }
            }
        });
        var proto = Object.getPrototypeOf(enchant.gl.Mesh);
        proto.createDomino = function(sx, sz, sy) {
            if ( typeof sx === 'undefined') {
                sx = 1;
            }
            if ( typeof sy === 'undefined') {
                sy = 0.2;
            }
            if ( typeof sz === 'undefined') {
                sz = 1.5;
            }
            var mesh = new enchant.gl.Mesh();
            mesh._height = sz;
            // @formatter:off
            var vertices = [
                0.5, 0.5, 0.5,
                -0.5, 0.5, 0.5,
                -0.5, -0.5, 0.5,
                0.5, -0.5, 0.5,

                0.5, 0.5, -0.5,
                -0.5, 0.5, -0.5,
                -0.5, -0.5, -0.5,
                0.5, -0.5, -0.5,

                0.5, 0.5, 0.5,
                -0.5, 0.5, 0.5,
                -0.5, 0.5, -0.5,
                0.5, 0.5, -0.5,

                0.5, -0.5, 0.5,
                -0.5, -0.5, 0.5,
                -0.5, -0.5, -0.5,
                0.5, -0.5, -0.5,

                0.5, 0.5, 0.5,
                0.5, -0.5, 0.5,
                0.5, -0.5, -0.5,
                0.5, 0.5, -0.5,

                -0.5, 0.5, 0.5,
                -0.5, -0.5, 0.5,
                -0.5, -0.5, -0.5,
                -0.5, 0.5, -0.5
            ];
            // @formatter:on
            for (var i = 0, l = vertices.length; i < l; i += 3) {
                vertices[i] *= sx;
                vertices[i + 1] *= sy;
                vertices[i + 2] *= (vertices[i + 2] > 0) ? sz * 2 : 0;
            }
            mesh.vertices = vertices;

            // @formatter:off
            mesh.colors = [
                1.0, 1.0, 1.0, 1.0,
                1.0, 1.0, 1.0, 1.0,
                1.0, 1.0, 1.0, 1.0,
                1.0, 1.0, 1.0, 1.0,

                1.0, 1.0, 1.0, 1.0,
                1.0, 1.0, 1.0, 1.0,
                1.0, 1.0, 1.0, 1.0,
                1.0, 1.0, 1.0, 1.0,

                1.0, 1.0, 1.0, 1.0,
                1.0, 1.0, 1.0, 1.0,
                1.0, 1.0, 1.0, 1.0,
                1.0, 1.0, 1.0, 1.0,

                1.0, 1.0, 1.0, 1.0,
                1.0, 1.0, 1.0, 1.0,
                1.0, 1.0, 1.0, 1.0,
                1.0, 1.0, 1.0, 1.0,

                1.0, 1.0, 1.0, 1.0,
                1.0, 1.0, 1.0, 1.0,
                1.0, 1.0, 1.0, 1.0,
                1.0, 1.0, 1.0, 1.0,

                1.0, 1.0, 1.0, 1.0,
                1.0, 1.0, 1.0, 1.0,
                1.0, 1.0, 1.0, 1.0,
                1.0, 1.0, 1.0, 1.0
            ];
            mesh.normals = [
                0.0, 0.0, 1.0,
                0.0, 0.0, 1.0,
                0.0, 0.0, 1.0,
                0.0, 0.0, 1.0,
                0.0, 0.0, -1.0,
                0.0, 0.0, -1.0,
                0.0, 0.0, -1.0,
                0.0, 0.0, -1.0,
                0.0, 1.0, 0.0,
                0.0, 1.0, 0.0,
                0.0, 1.0, 0.0,
                0.0, 1.0, 0.0,
                0.0, -1.0, 0.0,
                0.0, -1.0, 0.0,
                0.0, -1.0, 0.0,
                0.0, -1.0, 0.0,
                1.0, 0.0, 0.0,
                1.0, 0.0, 0.0,
                1.0, 0.0, 0.0,
                1.0, 0.0, 0.0,
                -1.0, 0.0, 0.0,
                -1.0, 0.0, 0.0,
                -1.0, 0.0, 0.0,
                -1.0, 0.0, 0.0
            ];
            mesh.texCoords = [
                1.0, 0.0,
                0.0, 0.0,
                0.0, 1.0,
                1.0, 1.0,

                1.0, 0.0,
                0.0, 0.0,
                0.0, 1.0,
                1.0, 1.0,

                1.0, 0.0,
                0.0, 0.0,
                0.0, 1.0,
                1.0, 1.0,

                1.0, 0.0,
                0.0, 0.0,
                0.0, 1.0,
                1.0, 1.0,

                1.0, 0.0,
                0.0, 0.0,
                0.0, 1.0,
                1.0, 1.0,

                1.0, 0.0,
                0.0, 0.0,
                0.0, 1.0,
                1.0, 1.0
            ];
            var a = [
                0, 1, 2,
                2, 3, 0,

                2, 1, 0,
                0, 3, 2,

                2, 1, 0,
                0, 3, 2,

                0, 1, 2,
                2, 3, 0,

                0, 1, 2,
                2, 3, 0,

                2, 1, 0,
                0, 3, 2
            ];
            // @formatter:on
            for ( i = 0; i < 6 * 6; i++) {
                a[i] += Math.floor(i / 6) * 4;
            }
            mesh.indices = a;
            return mesh;
        }
    }());
}
