'use strict';


js13k.SCENE = {
	NORMAL: 0,
	TITLE: 1,
	INTRO: 2,
	ELEVATOR_MOVING: 3,
};

js13k.STATE = {
	// Doors
	OPEN: 1,
	OPENING: 2,
	CLOSED: 3,
	CLOSING: 4,
	// Elevator
	IDLE: 5,
	MOVING: 6,
};


js13k.Level = class {


	/**
	 *
	 * @constructor
	 */
	constructor() {
		this._lastCheck = 0;
		this.canInteract = true;
		this.runners = [];
		this.scene = js13k.SCENE.NORMAL; // TODO: set to TITLE
		this.states = {
			doors: js13k.STATE.OPEN,
			elevator: js13k.STATE.IDLE,
			floorCurrent: 1,
			floorNext: 1,
			note: null,
		};
		this.timer = 0;

		this._evX = 2.5;
		this._evY = 3;
		this._evZ = 2;

		W.light( { 'y': this._evY / 2 - 0.2 } );

		W.plane( {
			'n': 'title',
			'z': -2,
			'w': 1,
			'h': 0.2,
			'b': 'f00',
			't': js13k.Assets.textures.title,
		} );

		W.group( { 'n': 'ev' } );
		this._buildElevatorWalls();
		this._buildElevatorDoors();
		this._buildElevatorDisplay();
		this._buildElevatorNumberPad();
		this._buildFloors();
		this._buildHighlight();

		this.setDisplay( this.states.floorCurrent );
	}


	/**
	 *
	 * @private
	 */
	_buildElevatorDisplay() {
		const g = 'display';
		const w = 0.5;
		const h = 0.25;

		W.group( {
			'n': g,
			'g': 'ev',
			'y': this._evY / 2 - h - 0.15,
			'z': -this._evZ / 2 + 0.06,
		} );

		// base plate
		W.plane( {
			'g': g,
			'n': 'dis',
			'w': w,
			'h': h,
			'b': 'f00',
		} );
	}


	/**
	 *
	 * @private
	 */
	_buildElevatorDoors() {
		const doorWidth = this._evX / 2;
		const doorDepth = 0.05;

		this._rightDoorClosed = doorWidth / 2 + 0.0025; // leave a very small gap open
		this._rightDoorOpen = this._rightDoorClosed + this._evX / 2 - this._evX / 3.5;

		// Left door
		W.cube( {
			'n': 'dl',
			'g': 'ev',
			'x': -this._rightDoorOpen,
			'z': -this._evZ / 2,
			'w': doorWidth,
			'h': this._evY,
			'd': doorDepth,
			'b': 'aaa',
			's': 20,
		} );

		W.group( {
			'n': 'drg',
			'g': 'ev',
			'x': this._rightDoorOpen,
			'z': -this._evZ / 2,
		} );

		// Right door
		W.cube( {
			'n': 'dr',
			'g': 'drg',
			'w': doorWidth,
			'h': this._evY,
			'd': doorDepth,
			'b': 'aaa',
			's': 20,
		} );

		const noteWidth = doorWidth / 4;

		W.plane( {
			'n': 's_note1',
			'g': 'drg',
			'x': ( noteWidth - doorWidth ) / 2 + 0.1,
			'y': -0.1,
			'z': doorDepth / 2 + 0.001,
			'w': noteWidth,
			'h': noteWidth * 1.414, // 297 / 210 ~= 1.414
			'rz': -10,
			't': js13k.Assets.textures.paper,
		} );
	}


	/**
	 *
	 * @private
	 */
	_buildElevatorNumberPad() {
		const g = 'pad';
		const w = 0.3;
		const h = 0.7;

		// Group: number pad
		W.group( {
			'n': g,
			'g': 'ev',
			'x': this._evX / 2 - w,
			'y': -h / 4,
			'z': -this._evZ / 2 + 0.051,
		} );

		// base plate
		W.plane( {
			'g': g,
			'w': w,
			'h': h,
			'b': 'bbb',
			's': 20,
		} );

		const padding = 0.02;
		const btnW = 0.1;
		const btnH = 0.07;
		const offsetX = ( btnW + padding ) / 2;
		const offsetY = 6 * ( btnH + padding ) / 2;

		for( let i = 0; i < 14; i++ ) {
			const n = 'btn' + i;
			const x = ( i % 2 ) * ( padding + btnW ) - offsetX;
			const y = ~~( i / 2 ) * ( padding + btnH ) - offsetY;

			W.cube( {
				'g': g,
				'n': n,
				'x': x,
				'y': y,
				'w': btnW,
				'h': btnH,
				'd': 0.02,
				'b': 'ddd',
			} );
			W.plane( {
				'g': g,
				'n': 's_lbl_' + n,
				'x': x,
				'y': y,
				'z': 0.011,
				'w': btnW,
				'h': btnH,
				't': js13k.Assets.textures['s_lbl_' + n],
			} );
		}
	}


	/**
	 *
	 * @private
	 */
	_buildElevatorWalls() {
		const g = 'ev';

		// Group: elevator base
		W.group( { 'n': g, 'g': 'ev' } );

		// floor
		W.plane( {
			'g': g,
			'y': -this._evY / 2,
			'w': this._evX,
			'h': this._evZ,
			'rx': -90,
			'b': '333',
			't': js13k.Assets.textures.floor,
			'mix': 0.5,
		} );
		// ceiling
		W.plane( {
			'g': g,
			'y': this._evY / 2,
			'w': this._evX,
			'h': this._evZ,
			'rx': 90,
			'b': 'bbb',
			't': js13k.Assets.textures.ceil,
			'mix': 0.5,
		} );

		// wall: left
		W.plane( {
			'g': g,
			'x': -this._evX / 2,
			'ry': 90,
			'w': this._evZ,
			'h': this._evY,
			'b': '999',
			't': js13k.Assets.textures.wall,
			's': 30,
			'mix': 0.5,
		} );
		// wall: right
		W.plane( {
			'g': g,
			'x': this._evX / 2,
			'ry': -90,
			'w': this._evZ,
			'h': this._evY,
			'b': '999',
			't': js13k.Assets.textures.wall,
			's': 30,
			'mix': 0.5,
		} );
		// wall: back
		W.plane( {
			'g': g,
			'z': this._evZ / 2,
			'ry': 180,
			'w': this._evX,
			'h': this._evY,
			'b': '999',
			't': js13k.Assets.textures.wall,
			's': 30,
			'mix': 0.5,
		} );

		// railing: left
		W.cube( {
			'g': g,
			'x': -this._evX / 2 + 0.02,
			'y': -this._evY / 5,
			'w': 0.04,
			'h': 0.15,
			'd': this._evZ,
			'b': 'aaa',
			's': 30,
		} );
		// railing: right
		W.cube( {
			'g': g,
			'x': this._evX / 2 - 0.02,
			'y': -this._evY / 5,
			'w': 0.04,
			'h': 0.15,
			'd': this._evZ,
			'b': 'aaa',
			's': 30,
		} );
		// railing: back
		W.cube( {
			'g': g,
			'y': -this._evY / 5,
			'z': this._evZ / 2 - 0.02,
			'w': this._evX,
			'h': 0.15,
			'd': 0.04,
			'b': 'aaa',
			's': 30,
		} );

		// front, left side
		W.cube( {
			'g': g,
			'x': -( this._evX - this._evX / 4.5 ) / 2,
			'z': -this._evZ / 2,
			'w': this._evX / 4.5,
			'h': this._evY,
			'd': 0.1,
			'b': '999',
			't': js13k.Assets.textures.fs,
			's': 30,
			'mix': 0.5,
		} );
		// front, right side
		W.cube( {
			'g': g,
			'n': 's__fr',
			'x': ( this._evX - this._evX / 4.5 ) / 2,
			'z': -this._evZ / 2,
			'w': this._evX / 4.5,
			'h': this._evY,
			'd': 0.1,
			'b': '999',
			't': js13k.Assets.textures.fs,
			's': 30,
			'mix': 0.5,
		} );
		// front, top
		W.cube( {
			'g': g,
			'y': ( this._evY - this._evY / 4 ) / 2,
			'z': -this._evZ / 2,
			'w': this._evX,
			'h': this._evY / 4,
			'd': 0.1,
			'b': '999',
			't': js13k.Assets.textures.ft,
			's': 30,
			'mix': 0.5,
		} );
	}


	/**
	 *
	 * @private
	 */
	_buildFloors() {
		// Dark bottom plane
		W.plane( {
			'y': -this._evY / 2,
			'z': -this._evZ / 2 - 10,
			'w': 30,
			'h': 20,
			'rx': 90,
			'rz': 180,
			'b': '111',
		} );

		// Eyes
		W.billboard( {
			'n': 'eyes',
			'y': 0.8,
			'z': 100,
			'w': 0.5,
			'h': 0.5 / 4,
			't': js13k.Assets.getEyesTexture( '•   •', '#77f' ),
		} );
	}


	/**
	 *
	 * @private
	 */
	_buildHighlight() {
		const color = 'fff';
		const size = 0.005;

		W.group( { 'n': 'hl' } );

		W.cube( {
			'n': 'hl_t',
			'g': 'hl',
			'size': size,
			'b': color,
			'ns': 1,
		} );

		W.cube( {
			'n': 'hl_r',
			'g': 'hl',
			'size': size,
			'b': color,
			'ns': 1,
		} );

		W.cube( {
			'n': 'hl_b',
			'g': 'hl',
			'size': size,
			'b': color,
			'ns': 1,
		} );

		W.cube( {
			'n': 'hl_l',
			'g': 'hl',
			'size': size,
			'b': color,
			'ns': 1,
		} );
	}


	/**
	 *
	 * @private
	 */
	_checkSelections() {
		// Only check objects every 50 ms
		if( this.timer - this._lastCheck > 0.05 * js13k.TARGET_FPS ) {
			this._lastCheck = this.timer;

			const hit = js13k.Renderer.checkSelectables();

			if( hit && hit.n != this._lastSelectable?.hit ) {
				let key = hit.n;

				// Highlight button
				if( key.startsWith( 's_lbl_btn' ) ) {
					key = key.substring( 6 ); // remove "s_lbl_"
				}

				const target = W.next[key];

				if( target ) {
					this._lastSelectable = {
						hit: hit.n,
						'n': key,
					};
				}
			}
			else if( !hit && this._lastSelectable ) {
				this._lastSelectable = null;
			}
		}

		this.highlight( this._lastSelectable );

		if( this._lastSelectable ) {
			const cnvUI = js13k.Renderer.cnvUI;
			const ctxUI = js13k.Renderer.ctxUI;
			ctxUI.fillStyle = '#fff';
			ctxUI.font = '20px ' + js13k.FONT_MONO;
			ctxUI.textAlign = 'center';
			ctxUI.fillText( '[E]/LEFT-CLICK TO SELECT', cnvUI.width / 2, cnvUI.height - 42 );

			if( js13k.Input.isPressed( js13k.Input.ACTION.INTERACT, true ) ) {
				this.selectObject();
			}
		}
	}


	/**
	 *
	 * @param {string}  text
	 * @param {string}  color
	 * @param {number}  duration
	 * @param {object}  pos
	 * @param {string?} pos.g
	 * @param {number}  pos.x
	 * @param {number}  pos.y
	 * @param {number}  pos.z
	 */
	audioText( text, color, duration, pos ) {
		text = `*${text}*`;

		const cnv = js13k.Assets.getAudioTexture( text, color );
		const moveY = 0.01 * duration;

		W.plane( {
			'n': cnv.id,
			'g': pos.g,
			'x': pos.x,
			'y': pos.y + 0.05,
			'z': pos.z + 0.1,
			'w': 0.5,
			'h': 0.25,
			't': cnv,
			'ns': 1,
		} );

		W.move( {
			'n': cnv.id,
			'y': pos.y + 0.05 + moveY,
			'a': duration * 1000,
			'onAnimDone': () => W.delete( cnv.id ),
		} );
	}


	/**
	 *
	 */
	clicked() {
		if( this.states.note ) {
			this.states.note = null;
		}
		else {
			this.selectObject();
		}
	}


	/**
	 *
	 * @returns {boolean}
	 */
	doorsInMotion() {
		return [
			js13k.STATE.CLOSING,
			js13k.STATE.OPENING,
		].includes( this.states.doors );
	}


	/**
	 *
	 * @param {function?} cb
	 */
	doorsClose( cb ) {
		if( this.states.doors == js13k.STATE.CLOSED || this.doorsInMotion() ) {
			cb?.();
			return;
		}

		this.states.doors = js13k.STATE.CLOSING;

		W.move( { 'n': 'dl', 'x': -this._rightDoorClosed, 'a': 2000 } );
		W.move( {
			'n': 'drg',
			'x': this._rightDoorClosed,
			'a': 2000,
			'onAnimDone': () => {
				this.states.doors = js13k.STATE.CLOSED;
				cb?.();
			},
		} );
	}


	/**
	 *
	 * @param {function?} cb
	 */
	doorsOpen( cb ) {
		if( this.states.doors == js13k.STATE.OPEN || this.doorsInMotion() ) {
			cb?.();
			return;
		}

		this.states.doors = js13k.STATE.OPENING;

		W.move( { 'n': 'dl', 'x': -this._rightDoorOpen, 'a': 2000 } );
		W.move( {
			'n': 'drg',
			'x': this._rightDoorOpen,
			'a': 2000,
			'onAnimDone': () => {
				this.states.doors = js13k.STATE.OPEN;
				cb?.();
			},
		} );
	}


	/**
	 * 
	 * @param {object}  o
	 * @param {string?} o.g
	 * @param {number}  o.x
	 * @param {number}  o.y
	 * @param {number}  o.z
	 * @returns {object}
	 */
	getGlobalPos( o ) {
		if( !o.g ) {
			return o;
		}

		const group = W.next[o.g];

		return {
			x: group.x + o.x,
			y: group.y + o.y,
			z: group.z + o.z,
		};
	}


	/**
	 *
	 * @param {object} o
	 * @param {string} o.n
	 */
	handleSelected( o ) {
		if( !o ) {
			return;
		}

		if( o.n.startsWith( 's_note' ) ) {
			this.states.note = o.n;
		}
		else if( o.n.startsWith( 'btn' ) ) {
			if( this.states.elevator == js13k.STATE.IDLE ) {
				js13k.Audio.play( js13k.Audio.BUTTON );
				this.audioText( 'beep', '#ff0', 1, o );

				const floor = Number( o.n.substring( 3 ) );

				// "Close doors" button ("><")
				if( floor == 0 ) {
					this.doorsClose();
					return;
				}

				// Same floor, toggle door state
				if( this.states.floorCurrent == floor ) {
					if( this.states.doors == js13k.STATE.OPEN ) {
						this.doorsClose();
					}
					else {
						this.doorsOpen();
					}

					return;
				}

				this.states.floorNext = floor;
				this.states.elevator = js13k.STATE.MOVING;

				this.doorsClose( () => {
					this.setScene( js13k.SCENE.ELEVATOR_MOVING );
				} );
			}
		}
	}


	/**
	 *
	 * @param {object?} target
	 * @param {string}  target.n
	 */
	highlight( target ) {
		if( !target ) {
			W.move( {
				'n': 'hl',
				'z': 100,
			} );

			return;
		}

		const o = W.next[target.n];
		const pos = this.getGlobalPos( o );
		const size = 0.005;

		W.move( {
			'n': 'hl',
			'x': pos.x,
			'y': pos.y,
			'z': pos.z + 0.01,
			'rz': o.rz,
		} );

		W.move( {
			'n': 'hl_t',
			'y': o.h / 2,
			'w': o.w,
			'h': size,
		} );

		W.move( {
			'n': 'hl_r',
			'x': o.w / 2,
			'h': o.h,
			'w': size,
		} );

		W.move( {
			'n': 'hl_b',
			'y': -o.h / 2,
			'w': o.w,
			'h': size,
		} );

		W.move( {
			'n': 'hl_l',
			'x': -o.w / 2,
			'h': o.h,
			'w': size,
		} );
	}


	/**
	 *
	 * @param {number} floor
	 */
	prepareFloor( floor ) {
		let eyes = {
			'n': 'eyes',
			'y': 0.8,
			'z': 100, // outside of visible area
		};

		if( floor > 1 ) {
			eyes.z = -3;
		}

		W.move( eyes );
	}


	/**
	 *
	 */
	runRunners() {
		for( let i = this.runners.length - 1; i >= 0; i-- ) {
			const runner = this.runners[i];
			runner.start ??= this.timer;

			const progress = ( this.timer - runner.start ) / ( runner.duration * js13k.TARGET_FPS );

			// Return something true-ish to remove a runner.
			if( runner.do( progress ) ) {
				this.runners.splice( i );
			}
		}
	}


	/**
	 *
	 */
	selectObject() {
		if( this._lastSelectable ) {
			const o = W.next[this._lastSelectable.n];
			this.handleSelected( o );
		}
	}


	/**
	 *
	 * @param {number|string} text
	 */
	setDisplay( text ) {
		W.move( {
			'n': 'dis',
			't': js13k.Assets.getDisplayTexture( text ),
			'mix': 0.25,
		} );
	}


	/**
	 *
	 * @param {js13k.SCENE} scene
	 */
	setScene( scene ) {
		if( this.scene == scene ) {
			return;
		}

		this.scene = scene;
		this.canInteract = true;

		const runner = {};

		if( scene == js13k.SCENE.ELEVATOR_MOVING ) {
			const camStart = {
				'x': W.next.camera.x,
				'y': W.next.camera.y,
				'z': W.next.camera.z,
			};

			// Moving from 1 floor to the next takes 1.25 second.
			// Multiple floors take longer.
			const floorDiff = this.states.floorNext - this.states.floorCurrent;
			runner.duration = 1.25 * Math.abs( floorDiff );

			runner.do = progress => {
				this.setDisplay( this.states.floorCurrent + Math.round( progress * floorDiff ) );

				if( progress > 1 ) {
					this.prepareFloor( this.states.floorNext );

					W.camera( camStart );
					js13k.Audio.play( js13k.Audio.DING );
					this.audioText( 'ding', '#ff0', 3, W.next.display );

					this.states.floorCurrent = this.states.floorNext;

					this.doorsOpen( () => {
						this.states.elevator = js13k.STATE.IDLE;

						setTimeout( () => {
							const { y: startY, z: startZ } = W.next.eyes;
							const goalY = 0.3;
							const goalZ = -1.5;
							const diffY = goalY - startY;
							const diffZ = goalZ - startZ;
	
							this.runners.push( {
								duration: 2,
								do: progress => {
									W.move( {
										'n': 'eyes',
										'y': startY + diffY * progress,
										'z': startZ + diffZ * progress,
									} );
	
									return progress >= 1;
								},
							} );

							this.setScene( js13k.SCENE.NORMAL );
						}, 1 );
					} );

					return true;
				}

				// Screen shake
				W.camera( {
					'x': camStart.x + ( Math.random() * 2 - 1 ) / 300,
					'y': camStart.y + ( Math.random() * 2 - 1 ) / 300,
					'z': camStart.z + ( Math.random() * 2 - 1 ) / 300,
				} );

				return false;
			};
		}
		else if( scene == js13k.SCENE.INTRO ) {
			this.canInteract = false;
			this.doorsClose();

			runner.duration = 3;
			runner.do = progress => {
				js13k.Renderer.cameraLocked = true;

				const cam = {
					'z': 0,
					'rx': 0,
					'ry': 0,
				};

				if( progress > 1 ) {
					W.camera( cam );
					js13k.Renderer.cameraLocked = false;

					// Show pointer
					document.getElementById( 'p' ).hidden = false;

					W.delete( 'title' );

					setTimeout( () => this.setScene( js13k.SCENE.NORMAL ), 1 );

					return true;
				}

				// End on a smoother stop in the animation
				cam.z = -0.5 * ( 1 - Math.sin( progress * Math.PI / 2 ) );
				W.camera( cam );

				return false;
			};
		}
		else if( scene == js13k.SCENE.TITLE ) {
			// Hide pointer
			document.getElementById( 'p' ).hidden = true;
			this.canInteract = false;

			runner.duration = 3;
			runner.do = progress => {
				js13k.Renderer.cameraLocked = true;
				W.camera( { 'z': -0.5, 'rx': 0, 'ry': 0 } );

				if( progress >= 1 ) {
					setTimeout( () => this.setScene( js13k.SCENE.INTRO ), 1 );
				}

				return progress >= 1;
			};
		}

		runner.do && this.runners.push( runner );
	}


	/**
	 *
	 * @param {number} dt
	 */
	update( dt ) {
		this.timer += dt;
		this.runRunners();

		if( this.states.note ) {
			const text = js13k.Assets.texts[this.states.note];
			js13k.Renderer.drawNote( text );

			if( js13k.Input.isPressed( js13k.Input.ACTION.INTERACT, true ) ) {
				this.states.note = null;
			}
		}
		else if( this.canInteract && this.states.elevator == js13k.STATE.IDLE ) {
			this._checkSelections();
		}
	}


};
