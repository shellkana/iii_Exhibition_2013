/**
 * @fileOverview
 * primitive.gl.enchant.js
 * @version 0.3.5
 * @require gl.enchant.js v0.3.5+
 * @author Ubiquitous Entertainment Inc.
 *
 * @description
 * Primitive objects for gl.enchant.js
 */

if (enchant.gl !== undefined) {( function() {
            enchant.gl.domino = {};
            enchant.gl.domino.Domino = enchant.Class.create(enchant.gl.Sprite3D, {
                initialize : function(width, height, depth) {
                    enchant.gl.Sprite3D.call(this);
                    this.mesh = enchant.gl.Mesh.createDomino(width, height, depth);
                }
            });
            var proto = Object.getPrototypeOf(enchant.gl.Mesh);
            proto.createDomino = function(sx, sz, sy) {
                if ( typeof sx === 'undefined') {
                    sx = 1;
                }
                if ( typeof sy === 'undefined') {
                    sy = 0.1;
                }
                if ( typeof sz === 'undefined') {
                    sz = 1.5;
                }
                var mesh = new enchant.gl.Mesh();
                var vertices = [0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5];
                for (var i = 0, l = vertices.length; i < l; i += 3) {
                    vertices[i] *= sx;
                    vertices[i + 1] *= sy;
                    vertices[i + 2] *= (vertices[i+2]>0)?sz*2:0;
                }
                mesh.vertices = vertices;

                mesh.colors = [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0];
                mesh.normals = [0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0];
                mesh.texCoords = [1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0];
                var a = [0, 1, 2, 2, 3, 0, 2, 1, 0, 0, 3, 2, 2, 1, 0, 0, 3, 2, 0, 1, 2, 2, 3, 0, 0, 1, 2, 2, 3, 0, 2, 1, 0, 0, 3, 2];
                for ( i = 0; i < 6 * 6; i++) {
                    a[i] += Math.floor(i / 6) * 4;
                }
                mesh.indices = a;
                return mesh;
            }
        }());
}
