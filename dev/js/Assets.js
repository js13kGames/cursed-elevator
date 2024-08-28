'use strict';


/**
 * @namespace js13k.Assets
 */
js13k.Assets = {


	texts: {
		's_note1': `I'm leaving this note for whoever gets lost\nhere as well. You are now stuck in a cursed\nelevator. But if I'm not in here (and neither\nmy dead body), I must've made it out!\n\nDon't worry, I'm going to leave you some\ntips as I figure this situation out!`,
	},


	textures: {},


	/**
	 *
	 * @private
	 */
	_createButtonLabels() {
		const w = 100;
		const h = 70;

		for( let i = 1; i <= 14; i++ ) {
			const key = 's_lbl_btn' + i;

			const [canvas, ctx] = js13k.Renderer.getOffscreenCanvas( w, h, key );
			ctx.font = '600 32px ' + js13k.FONT_SANS;
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillText( String( i ).padStart( 2, '0' ), w / 2, h / 2 + 2 );

			this.textures[key] = canvas;
		}
	},


	/**
	 *
	 * @private
	 */
	_createItems() {
		// Ratio is close to DIN A4 (210 / 297)
		const w = 50;
		const h = Math.round( w * 1.414 );

		const cnvPaper = js13k.Renderer.getOffscreenCanvas( w, h, 'paper' )[0];
		pxtex( cnvPaper, 0, 0, 95, 3, w, h );
		this.textures.paper = cnvPaper;
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
		const h = Math.round( w * 0.2 );

		const [cnv, ctx] = js13k.Renderer.getOffscreenCanvas( w, h, 'title' );
		ctx.fillStyle = '#f00';
		ctx.font = '600 64px ' + js13k.FONT_SANS;
		ctx.textAlign = 'center';
		ctx.fillText( js13k.TITLE, w / 2, h / 2 );

		this.textures.title = cnv;
	},


	/**
	 *
	 * @param {number|string} text
	 * @returns {HTMLCanvasElement}
	 */
	getDisplayTexture( text ) {
		const w = 200;
		const h = Math.round( w / 2 );

		const [cnv, ctx] = js13k.Renderer.getOffscreenCanvas( w, h, 'dis:' + text );
		ctx.fillStyle = '#f00';
		ctx.fillRect( 0, 0, w, h );
		ctx.fillStyle = '#fff';
		ctx.font = '600 64px ' + js13k.FONT_MONO;
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText( String( text ), w / 2, h / 2 + 6 );

		return cnv;
	},


	/**
	 *
	 * @param {function} cb
	 */
	loadAll( cb ) {
		this._createTitle();
		this._createButtonLabels();
		this._createSurfaces();
		this._createItems();
		cb();
	},


};