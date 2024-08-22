'use strict';


/**
 * @namespace js13k.Assets
 */
js13k.Assets = {


	textures: {},


	/**
	 *
	 * @private
	 */
	_createButtonLabels() {
		const w = 50;
		const h = 35;

		for( let i = 0; i < 14; i++ ) {
			const key = 's_lbl_btn' + i;

			const [canvas, ctx] = js13k.Renderer.getOffscreenCanvas( w, h );
			canvas.id = key;
			ctx.font = '600 18px ' + js13k.FONT_SANS;
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillText( String( i + 1 ).padStart( 2, '0' ), w / 2, h / 2 + 2 );

			this.textures[key] = canvas;
		}
	},


	/**
	 *
	 * @private
	 */
	_createSurfaces() {
		const [canvas, _] = js13k.Renderer.getOffscreenCanvas( 20, 30 );
		canvas.id = 'wall';
		// HTMLCanvas, H, S, L, variation, width, height
		pxtex( canvas, 0, 0, 87, 5, 20, 30 );

		this.textures.wall = canvas;
	},


	/**
	 *
	 * @param {function} cb
	 */
	loadAll( cb ) {
		this._createButtonLabels();
		this._createSurfaces();
		cb();
	},


};