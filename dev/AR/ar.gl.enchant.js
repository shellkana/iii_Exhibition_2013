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

if (enchant.gl !== undefined) {( function() {
        enchant.gl.ar = {};
        enchant.gl.ar.ARScene3D = enchant.Class.create(enchant.gl.Scene3D, {
            initialize : function() {
                enchant.gl.Scene3D.call(this);
            }
        });
    }());
}
