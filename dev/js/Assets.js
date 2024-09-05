'use strict';


/**
 * @namespace js13k.Assets
 */
js13k.Assets = {


	texts: {
		's_note1': `I'm leaving this note for whoever gets lost\nhere as well. You are now stuck in a cursed\nelevator. But if I'm not in here (and neither\nmy dead body), I must've made it out!\n\nDon't worry, I'm going to leave you some\ntips as I figure this situation out!`,
		's_note2': 'Everything went black and now I am on 1 again. My note is also gone.\nThere is a fellow on floor 3, seems harmless.',
		's_note3': 'Back again, last note gone again. Floor 7 is new.',
		's_note4': 'Guess this is from that Note-Writter. Found a note book with torn pages. Feeling like keeping up the tradition.',
		's_note5a': 'NO MORE REPEATS',
		's_note5b': 'SICK OF PAIN',
		's_note5c': 'WHERE IS THE BUTTON',
		's_note6': 'Lost note book. Is 1 the way out? Got hope.',
		'blue1': 'Please go. Leave me alone.',
		'blue2': "Go! Don't let it find me.",
		'blue3': 'not...alone',
		'blue4': "It won't find me here, right? Why come back? Oh, it smells rotten... Please go. Leave me alone.",
		'pink1': 'Join us? Safe together. Step out the elevator. Let us huddle together.',
		'pink2': 'Offer still stands. Always welcome.',
	},


	textures: {},


	/**
	 *
	 * @private
	 */
	_createButtonLabels() {
		const w = 100;
		const h = 70;

		for( let i = 0; i < 14; i++ ) {
			const key = 's_lbl_btn' + i;
			const text = i == 0 ? '><' : String( i ).padStart( 2, '0' );

			const [canvas, ctx] = js13k.Renderer.getOffscreenCanvas( w, h, key );
			ctx.font = '600 32px ' + js13k.FONT_SANS;
			ctx.textBaseline = 'middle';
			ctx.fillText( text, w / 2, h / 2 + 2 );

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
		ctx.font = '600 64px ' + js13k.FONT_SERIF;
		ctx.fillText( js13k.TITLE, w / 2, h / 2 );

		this.textures.title = cnv;
	},


	/**
	 *
	 * @param {string} text
	 * @param {string} color
	 * @returns {HTMLCanvasElement}
	 */
	getAudioTexture( text, color ) {
		const key = 'audio:' + text + color;

		if( this.textures[key] ) {
			return this.textures[key];
		}

		const w = 200;
		const h = Math.round( w / 2 );

		const [cnv, ctx] = js13k.Renderer.getOffscreenCanvas( w, h, key );
		ctx.fillStyle = '#' + color;
		ctx.font = '36px ' + js13k.FONT_SANS;
		ctx.textBaseline = 'middle';
		ctx.fillText( String( text ), w / 2, h / 2 + 6 );

		this.textures[key] = cnv;

		return cnv;
	},


	/**
	 *
	 * @param {number|string} text
	 * @returns {HTMLCanvasElement}
	 */
	getDisplayTexture( text ) {
		const key = 'dis:' + text;

		if( this.textures[key] ) {
			return this.textures[key];
		}

		const w = 200;
		const h = Math.round( w / 2 );

		const [cnv, ctx] = js13k.Renderer.getOffscreenCanvas( w, h, key );
		ctx.fillStyle = '#f00';
		ctx.fillRect( 0, 0, w, h );
		ctx.fillStyle = '#fff';
		ctx.font = '600 64px ' + js13k.FONT_MONO;
		ctx.textBaseline = 'middle';
		ctx.fillText( String( text ), w / 2, h / 2 + 6 );

		this.textures[key] = cnv;

		return cnv;
	},


	/**
	 *
	 * @param {string} text
	 * @param {string} color
	 * @returns {HTMLCanvasElement}
	 */
	getEyesTexture( text, color ) {
		const key = 'eyes:' + text + color;

		if( this.textures[key] ) {
			return this.textures[key];
		}

		const w = 200;
		const h = 50;

		const [cnv, ctx] = js13k.Renderer.getOffscreenCanvas( w, h, key );
		ctx.fillStyle = '#' + color;
		ctx.font = '600 42px ' + js13k.FONT_MONO;
		ctx.textBaseline = 'middle';
		ctx.fillText( String( text ), w / 2, h / 2 );

		this.textures[key] = cnv;

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