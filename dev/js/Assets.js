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

			const [canvas, ctx] = js13k.Renderer.getOffscreenCanvas( w, h, key );
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
		const cnvWall = js13k.Renderer.getOffscreenCanvas( 200, 300, 'wall' )[0];
		// HTMLCanvas, H, S, L, variation, width, height
		pxtex( cnvWall, 0, 0, 20, 3, 200, 300 );
		this.textures.wall = cnvWall;

		const cnvCeiling = js13k.Renderer.getOffscreenCanvas( 100, 100, 'ceil' )[0];
		pxtex( cnvCeiling, 0, 0, 100, 3, 100, 100 );
		this.textures.ceil = cnvCeiling;

		const cnvFloor = js13k.Renderer.getOffscreenCanvas( 100, 100, 'floor' )[0];
		pxtex( cnvFloor, 0, 0, 10, 1, 100, 100 );
		this.textures.floor = cnvFloor;

		const cnvFrontSide = js13k.Renderer.getOffscreenCanvas( 40, 300, 'fs' )[0];
		pxtex( cnvFrontSide, 0, 0, 20, 3, 40, 300 );
		this.textures.fs = cnvFrontSide;

		const cnvFrontTop = js13k.Renderer.getOffscreenCanvas( 200, 75, 'ft' )[0];
		pxtex( cnvFrontTop, 0, 0, 20, 3, 200, 75 );
		this.textures.ft = cnvFrontTop;
	},


	/**
	 *
	 * @private
	 */
	_createTitle() {
		const w = 600;
		const h = w * 0.2;

		const [cnv, ctx] = js13k.Renderer.getOffscreenCanvas( w, h, 'title' );
		ctx.fillStyle = '#f00';
		ctx.font = '600 64px ' + js13k.FONT_SANS;
		ctx.textAlign = 'center';
		ctx.fillText( js13k.TITLE, w / 2, h / 2 );

		this.textures.title = cnv;
	},


	/**
	 *
	 * @param {function} cb
	 */
	loadAll( cb ) {
		this._createTitle();
		this._createButtonLabels();
		this._createSurfaces();
		cb();
	},


};