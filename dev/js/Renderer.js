'use strict';


/**
 * @namespace js13k.Renderer
 */
js13k.Renderer = {

	camera: {
		rx: 0,
		ry: 0,
	},
	cameraLocked: true,
	defaultCamDir: new DOMPoint( 0, 0, -1 ),
	timer: 0,


	/**
	 *
	 * @returns {object}
	 */
	checkSelectables() {
		let hits = [];

		const ray = this.getRayFromCam();
		const aabb = {
			min: [],
			max: [],
		};

		for( const name in W.next ) {
			if( !name.startsWith( 's_' ) ) {
				continue;
			}

			const o = W.next[name];
			let d = 0;

			// "plane" has no depth, but a default value of 1
			if( o.type != 'plane' && o.type != 'billboard' ) {
				d = o.d;
			}

			aabb.min[0] = o.x - o.w / 2;
			aabb.min[1] = o.y - o.h / 2;
			aabb.min[2] = o.z - d / 2;

			if( o.g ) {
				const group = W.next[o.g];
				aabb.min[0] += group.x;
				aabb.min[1] += group.y;
				aabb.min[2] += group.z;
			}

			aabb.max[0] = aabb.min[0] + o.w;
			aabb.max[1] = aabb.min[1] + o.h;
			aabb.max[2] = aabb.min[2] + d;

			const hitPoint = this.rayHitsObject( ray, aabb );

			if( hitPoint ) {
				hits.push( [o, hitPoint] );
			}
		}

		return this.getClosest( ray.origin, hits );
	},


	/**
	 *
	 */
	drawPause() {
		this.ctxUI.fillStyle = '#00000070';
		this.ctxUI.fillRect( 0, 0, this.cnvUI.width, this.cnvUI.height );
		this.ctxUI.fillStyle = '#fff';
		this.ctxUI.font = '96px ' + js13k.FONT_SERIF;
		this.ctxUI.textAlign = 'center';
		this.ctxUI.fillText( 'PAUSED', this.cnvUI.width / 2, this.cnvUI.height / 2 );
	},


	/**
	 *
	 * @param {number[]} origin 
	 * @param {object[]} hits 
	 * @returns {object?}
	 */
	getClosest( origin, hits ) {
		if( hits.length == 1 ) {
			return hits[0][0];
		}

		let closest = null;
		let minDist = Infinity;

		for( let i = 0; i < hits.length; i++ ) {
			const p = hits[i][1];
			const v = [
				p[0] - origin[0],
				p[1] - origin[1],
				p[2] - origin[2],
			];
			const dist = Math.sqrt(
				v[0] * v[0] +
				v[1] * v[1] +
				v[2] * v[2]
			);

			if( dist < minDist ) {
				closest = hits[i][0];
				minDist = dist;
			}
		}

		return closest;
	},


	/**
	 * Get an offset canvas and its context.
	 * @param {number}  w
	 * @param {number}  h
	 * @param {string?} id
	 * @return {[HTMLCanvasElement, CanvasRenderingContext2D]}
	 */
	getOffscreenCanvas( w, h, id ) {
		const canvas = document.createElement( 'canvas' );
		canvas.width = w;
		canvas.height = h;

		if( id ) {
			canvas.id = id;
		}

		const ctx = canvas.getContext( '2d', { alpha: true } );
		ctx.imageSmoothingEnabled = false;

		return [canvas, ctx];
	},


	/**
	 *
	 * @returns {object}
	 */
	getRayFromCam() {
		const cam = W.next.camera;
		const rotMatrix = new DOMMatrix().rotateSelf( cam.rx, cam.ry, cam.rz );

		const ray = {
			origin: [cam.x, cam.y, cam.z],
			// Default cam direction with applied rotation
			dir: this.defaultCamDir.matrixTransform( rotMatrix ),
		};

		ray.dir = [ray.dir.x, ray.dir.y, ray.dir.z];

		return ray;
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

		// `W.onDraw` is a custom extension and not part of the original framework
		W.onDraw = this.update.bind( this );

		W.reset( this.cnv );
		W.clearColor( '000' );
		W.ambient( 0.2 );

		this.registerEvents();

		this.level = new js13k.Level();
	},


	/**
	 * "Fast Ray-Box Intersection" by Andrew Woo.
	 * From "Graphics Gems", Academic Press, 1990
	 * @param {object}   ray
	 * @param {number[]} ray.origin
	 * @param {number[]} ray.dir
	 * @param {object}   o
	 * @param {number[]} o.max
	 * @param {number[]} o.min
	 * @returns {number[]?}
	 */
	rayHitsObject( ray, o ) {
		const RIGHT = 0;
		const LEFT = 1;
		const MIDDLE = 2;

		let inside = true;
		let quadrant = [];
		let maxT = [];
		let candidatePlane = [];
		let coord = [];

		/* Find candidate planes; this loop can be avoided if
		rays cast all from the eye(assume perpsective view) */
		for( let i = 0; i < 3; i++ ) {
			if( ray.origin[i] < o.min[i] ) {
				quadrant[i] = LEFT;
				candidatePlane[i] = o.min[i];
				inside = false;
			}
			else if( ray.origin[i] > o.max[i] ) {
				quadrant[i] = RIGHT;
				candidatePlane[i] = o.max[i];
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

				if( coord[i] < o.min[i] || coord[i] > o.max[i] ) {
					return null;
				}
			}
			else {
				coord[i] = candidatePlane[i];
			}
		}

		return coord;
	},


	/**
	 *
	 */
	pause() {
		this.isPaused = true;
		document.body.classList.add( 'p' );
		W.isPaused = true;
	},


	/**
	 *
	 */
	registerEvents() {
		let mouseLastX = 0;
		let mouseLastY = 0;
		const camSpeed = 0.5;

		window.addEventListener( 'resize', _ev => this.resize() );

		const keys = js13k.Input.getKeysForAction( js13k.Input.ACTION.PAUSE );
		const cbPause = () => {
			this.togglePause();
			mouseLastX = null;
			mouseLastY = null;
		};
		keys.keyboard.forEach( key => js13k.Input.onKeyUp( key, cbPause ) );

		this.cnv.addEventListener( 'mousedown', ev => {
			if( ev.button !== 0 || !this.level ) {
				return;
			}

			this.level.selectObject();
		} );

		this.cnv.addEventListener( 'mouseenter', ev => {
			if( !this.level || this.cameraLocked ) {
				return;
			}

			mouseLastX = ev.clientX;
			mouseLastY = ev.clientY;
		} );

		this.cnv.addEventListener( 'mousemove', ev => {
			if( !this.level || this.isPaused || this.cameraLocked ) {
				return;
			}

			if( mouseLastX === null ) {
				mouseLastX = ev.clientX;
				mouseLastY = ev.clientY;

				return;
			}

			this.camera.rx -= ( ev.clientY - mouseLastY ) * camSpeed;
			this.camera.ry -= ( ev.clientX - mouseLastX ) * camSpeed;

			this.camera.rx = Math.min( 80, Math.max( -60, this.camera.rx ) );
			this.camera.ry = this.camera.ry % 360;

			W.camera( this.camera );

			mouseLastX = ev.clientX;
			mouseLastY = ev.clientY;
		} );

		// Reset camera
		js13k.Input.onKeyUp( 'KeyR', () => {
			if( this.cameraLocked ) {
				return;
			}

			this.camera.rx = 0;
			this.camera.ry = 0;
			W.camera( this.camera );
		} );
	},


	/**
	 * Resize the canvas.
	 */
	resize() {
		const ratio = 4 / 3;
		let width = window.innerWidth;
		let height = window.innerHeight;

		if( width > height ) {
			height -= 40;
			width = Math.round( Math.min( width, height * ratio ) );
		}
		else if( width < height ) {
			width -= 40;
			height = Math.round( Math.min( height, width * ratio ) );
		}

		this.cnv.width = width;
		this.cnv.height = height;

		this.cnvUI.width = width;
		this.cnvUI.height = height;

		if( W.next?.camera ) {
			// Trigger re-calculation of projection matrix
			W.camera( { 'fov': W.next.camera.fov } );
			W.gl.viewport( 0, 0, width, height );
		}
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
		document.body.classList.remove( 'p' );
		W.isPaused = false;
	},


	/**
	 * To be used in `requestAnimationFrame` callback.
	 * @param {number} [timestamp = 0]
	 */
	update( timestamp = 0 ) {
		if( timestamp && this.last ) {
			const timeElapsed = timestamp - this.last; // Time that passed between frames. [ms]

			// Target speed of 60 FPS (=> 1000 / 60 ~= 16.667 [ms]).
			const dt = timeElapsed / ( 1000 / js13k.TARGET_FPS );

			this.ctxUI.clearRect( 0, 0, this.cnvUI.width, this.cnvUI.height );
			this.ctxUI.imageSmoothingEnabled = false;

			// Draw FPS info
			this.ctxUI.fillStyle = '#fff';
			this.ctxUI.font = '11px monospace';
			this.ctxUI.textAlign = 'left';
			this.ctxUI.fillText( ~~( js13k.TARGET_FPS / dt ) + ' FPS', 10, 20 );

			if( this.isPaused ) {
				this.drawPause();
				return;
			}

			this.timer += dt;
			this.level.update( dt );
		}

		this.last = timestamp;
	},


};
