'use strict';


/**
 * @namespace js13k.Renderer
 */
js13k.Renderer = {


	timer: 0,


	drawPause() {
		// TODO:
	},


	/**
	 * Get an offset canvas and its context.
	 * @param  {number} w
	 * @param  {number} h
	 * @return {[HTMLCanvasElement, CanvasRenderingContext2D]}
	 */
	getOffscreenCanvas( w, h ) {
		const canvas = document.createElement( 'canvas' );
		canvas.width = w;
		canvas.height = h;

		const ctx = canvas.getContext( '2d', { alpha: true } );
		ctx.imageSmoothingEnabled = false;

		return [canvas, ctx];
	},


	/**
	 * Initialize the renderer.
	 */
	init() {
		this.cnv = document.getElementById( 'c' );

		this.cnvUI = document.getElementById( 'ui' );
		this.ctxUI = this.cnvUI.getContext( '2d', { alpha: true } );
		this.ctxUI.imageSmoothingEnabled = false;

		this.resize();

		this.loadAssets( () => {
			// `W.onDraw` is a custom extension and not part of the original framework
			W.onDraw = this.update.bind( this );

			W.reset( this.cnv );
			W.clearColor( '000' );
			W.ambient( 0.2 );

			this.registerEvents();

			this.level = new js13k.Level();
		} );
	},


	/**
	 *
	 * @param {function} cb
	 */
	loadAssets( cb ) {
		cb();
		// const img = new Image();

		// img.onload = () => {
		// 	this.images = img;
		// 	cb();
		// };

		// img.src = 'i.png';
	},


	/**
	 * To be used in `requestAnimationFrame` callback.
	 * @param {number} [timestamp = 0]
	 */
	update( timestamp = 0 ) {
		js13k.Input.update();

		if( timestamp && this.last ) {
			const timeElapsed = timestamp - this.last; // Time that passed between frames. [ms]

			// Target speed of 60 FPS (=> 1000 / 60 ~= 16.667 [ms]).
			const dt = timeElapsed / ( 1000 / js13k.TARGET_FPS );

			this.ctxUI.imageSmoothingEnabled = false;

			if( this.isPaused ) {
				this.drawPause();
				return;
			}

			this.timer += dt;

			this.level.update( dt );
			this.level.render();

			// // Draw FPS info
			// this.ctxUI.fillStyle = '#fff';
			// this.ctxUI.font = '600 16px ' + js13k.FONT_MONO;
			// this.ctxUI.textAlign = 'left';
			// this.ctxUI.fillText(
			// 	~~( js13k.TARGET_FPS / dt ) + ' FPS, ' + Math.round( this.scale * 1000 ) / 1000,
			// 	js13k.TILE_SIZE, this.cnv.height / this.scale - js13k.TILE_SIZE
			// );
		}

		this.last = timestamp;
	},


	/**
	 *
	 */
	pause() {
		this.isPaused = true;
	},


	/**
	 *
	 */
	registerEvents() {
		window.addEventListener( 'resize', _ev => this.resize() );

		const keys = js13k.Input.getKeysForAction( js13k.Input.ACTION.PAUSE );

		setInterval(
			() => {
				// Inputs are not updated if main loop is not running.
				if( this.isPaused ) {
					js13k.Input.update();
				}

				keys.gamepad.forEach( key => {
					if( js13k.Input.isPressedGamepad( key, true ) ) {
						this.togglePause();
					}
				} );
			},
			100
		);

		const cbPause = () => this.togglePause();
		keys.keyboard.forEach( key => js13k.Input.onKeyUp( key, cbPause ) );

		js13k.Input.on( 'gp_disconnect', () => this.pause() );
	},


	/**
	 * Resize the canvas.
	 */
	resize() {
		let width = 1200;
		let height = 900;

		this.cnv.width = width;
		this.cnv.height = height;

		this.cnvUI.width = width;
		this.cnvUI.height = height;
	},


	/**
	 *
	 */
	togglePause() {
		this.isPaused ? this.unpause() : this.pause();
	},


	/**
	 *
	 */
	unpause() {
		this.isPaused = false;
	},


};
