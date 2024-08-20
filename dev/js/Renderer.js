'use strict';


/**
 * @namespace js13k.Renderer
 */
js13k.Renderer = {


	timer: 0,


	/**
	 *
	 * @returns {object}
	 */
	checkSelectables() {
		let hits = [];

		const cam = W.next.camera;
		const ray = {
			origin: [cam.x, cam.y, cam.z],
			dir: [
				// TODO: rx/ry/rz are rotation values in degree, but I need a normalized 3D vector
			],
		};

		for( const name in W.next ) {
			if( !name.startsWith( 's_' ) ) {
				continue;
			}

			const o = W.next[name];
			const hitPoint = this.rayHitsObject( ray, o );

			if( hitPoint ) {
				hits.push( [o, hitPoint] );
			}
		}

		// TODO: return closest to camera

		return hits;
	},


	/**
	 * "Fast Ray-Box Intersection" by Andrew Woo.
	 * From "Graphics Gems", Academic Press, 1990
	 * @param {object}   ray
	 * @param {number[]} ray.origin
	 * @param {number[]} ray.dir
	 * @param {object}   o
	 * @returns {number[]?}
	 */
	rayHitsObject( ray, o ) {
		const RIGHT = 0;
		const LEFT = 1;
		const MIDDLE = 2;

		const minB = [o.x, o.y, o.z];
		const maxB = [
			o.x + o.w,
			o.y + o.h,
			o.z + o.d,
		];

		let inside = true;
		let quadrant = [];
		let maxT = [];
		let candidatePlane = [];
		let coord = [];

		/* Find candidate planes; this loop can be avoided if
		rays cast all from the eye(assume perpsective view) */
		for( let i = 0; i < 3; i++ ) {
			if( ray.origin[i] < minB[i] ) {
				quadrant[i] = LEFT;
				candidatePlane[i] = minB[i];
				inside = false;
			}
			else if( ray.origin[i] > maxB[i] ) {
				quadrant[i] = RIGHT;
				candidatePlane[i] = maxB[i];
				inside = false;
			}
			else {
				quadrant[i] = MIDDLE;
			}
		}

		/* Ray origin inside bounding box */
		if( inside )	{
			return ray.origin;
		}

		/* Calculate T distances to candidate planes */
		for( let i = 0; i < 3; i++ ) {
			if( quadrant[i] != MIDDLE && ray.dir[i] != 0 ) {
				maxT[i] = ( candidatePlane[i] - ray.origin[i] ) / ray.dir[i];
			}
			else {
				maxT[i] = -1;
			}
		}

		/* Get largest of the maxT's for final choice of intersection */
		let whichPlane = 0;

		for( let i = 1; i < 3; i++ ) {
			if( maxT[whichPlane] < maxT[i] ) {
				whichPlane = i;
			}
		}

		/* Check final candidate actually inside box */
		if( maxT[whichPlane] < 0 ) {
			return null;
		}

		for( let i = 0; i < 3; i++ ) {
			if( whichPlane != i ) {
				coord[i] = ray.origin[i] + maxT[whichPlane] * ray.dir[i];

				if( coord[i] < minB[i] || coord[i] > maxB[i] ) {
					return null;
				}
			}
			else {
				coord[i] = candidatePlane[i];
			}
		}

		return coord;
	},


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
