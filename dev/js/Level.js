'use strict';


js13k.SCENE = {
	NORMAL: 0,
	TITLE: 1,
	INTRO: 2,
	ELEVATOR_MOVING: 3,
	NEXT_LOOP: 4,
	REPEAT_LOOP: 5,
	OUTRO: 6,
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
		this.timer = 0;

		this.buttonsEnabled = [];
		this.deaths = 0;
		this.doors = js13k.STATE.OPEN;
		this.elevator = js13k.STATE.IDLE;
		this.floorCurrent = 6; // TODO: set to 1
		this.floorNext = this.floorCurrent;
		this.floorsVisited = [];
		this.loop = 3; // TODO: set to 1
		this.note = null;
		this.scene = js13k.SCENE.NORMAL; // TODO: set to TITLE

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

		this.setDisplay( this.floorCurrent );
		this.prepareLoop( this.loop );
		this.prepareFloor( this.floorCurrent );
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


		// Left door area

		W.group( {
			'n': 'dlg',
			'g': 'ev',
			'x': -this._rightDoorOpen,
			'z': -this._evZ / 2,
		} );

		W.cube( {
			'g': 'dlg',
			'w': doorWidth,
			'h': this._evY,
			'd': doorDepth,
			'b': 'aaa',
			's': 20,
		} );

		// Fake shadow
		W.plane( {
			'n': 'dsl',
			'g': 'dlg',
			'b': '0008',
			'y': -this._evY / 2 - 0.001,
			'z': -0.27,
			'h': 100,
			'rx': -90,
			'ry': 20,
			'ns': 1,
		} );


		// Right door area

		W.group( {
			'n': 'drg',
			'g': 'ev',
			'x': this._rightDoorOpen,
			'z': -this._evZ / 2,
		} );

		W.cube( {
			'g': 'drg',
			'w': doorWidth,
			'h': this._evY,
			'd': doorDepth,
			'b': 'aaa',
			's': 20,
		} );

		// Fake shadow
		W.plane( {
			'n': 'dsr',
			'g': 'drg',
			'b': '0008',
			'y': -this._evY / 2 - 0.001,
			'z': -0.27,
			'h': 100,
			'rx': -90,
			'ry': -20,
			'ns': 1,
		} );

		this._noteWidth = doorWidth / 4;

		W.plane( {
			'n': 's_note1',
			'g': 'drg',
			'x': ( this._noteWidth - doorWidth ) / 2 + 0.1,
			'y': -0.1,
			'z': doorDepth / 2 + 0.001,
			'w': this._noteWidth,
			'h': this._noteWidth * 1.414, // 297 / 210 ~= 1.414
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
			const t = js13k.Assets.textures['s_lbl_' + n];

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
				't': t,
			} );

			if( i == 13 ) {
				this.oBtn13 = JSON.parse( JSON.stringify( W.next[n] ) );
				this.oLblBtn13 = JSON.parse( JSON.stringify( W.next['s_lbl_' + n] ) );
				this.oLblBtn13.t = t;
			}
		}

		delete this.oBtn13.m;
		delete this.oLblBtn13.m;
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
			'z': 0.025,
			'w': 0.04,
			'h': 0.15,
			'd': this._evZ - 0.15,
			'b': 'aaa',
			's': 30,
		} );
		// railing: right
		W.cube( {
			'g': g,
			'x': this._evX / 2 - 0.02,
			'y': -this._evY / 5,
			'z': 0.025,
			'w': 0.04,
			'h': 0.15,
			'd': this._evZ - 0.15,
			'b': 'aaa',
			's': 30,
		} );
		// railing: back
		W.cube( {
			'g': g,
			'y': -this._evY / 5,
			'z': this._evZ / 2 - 0.02,
			'w': this._evX - 0.15,
			'h': 0.15,
			'd': 0.04,
			'b': 'aaa',
			's': 30,
		} );

		// front, left side
		W.cube( {
			'g': g,
			'n': 's__fl',
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
			'n': 'plane',
			'y': -this._evY / 2 - 0.002,
			'z': -this._evZ / 2 - 10,
			'w': 30,
			'h': 20,
			'rx': 90,
			'rz': 180,
			'b': '111',
		} );

		// Eyes
		// (red)
		W.plane( {
			'n': 'e_red',
			'y': 0.8,
			'z': 100,
			'w': 0.5,
			'h': 0.5 / 4,
			't': js13k.Assets.getEyesTexture( '•   •', 'f00' ),
			'ns': 1,
		} );
		// (blue)
		W.plane( {
			'n': 'e_blue',
			'x': 0.6,
			'y': -0.4,
			'z': 100,
			'w': 0.5,
			'h': 0.5 / 4,
			'rx': 30,
			'ry': -45,
			't': js13k.Assets.getEyesTexture( '•  •', '77f' ),
			'ns': 1,
		} );
		// (pink)
		W.group( {
			'n': 'e_pink_all',
			'z': 100,
		} );
		W.plane( {
			'g': 'e_pink_all',
			'n': 'e_pink1',
			'x': 0.4,
			'y': 0.6,
			'w': 0.7,
			'h': 0.7 / 4,
			't': js13k.Assets.getEyesTexture( '•   •', 'f2c' ),
			'ns': 1,
		} );
		W.plane( {
			'g': 'e_pink_all',
			'n': 'e_pink2',
			'x': 0.7,
			'y': 0.2,
			'w': 0.5,
			'h': 0.5 / 4,
			'ry': 20,
			't': js13k.Assets.getEyesTexture( '•  •', 'f2c' ),
		} );
		W.plane( {
			'g': 'e_pink_all',
			'n': 'e_pink3',
			'x': 0.9,
			'y': -0.1,
			'w': 0.5,
			'h': 0.5 / 4,
			'ry': 20,
			't': js13k.Assets.getEyesTexture( '•   •', 'f2c' ),
		} );
		W.plane( {
			'g': 'e_pink_all',
			'n': 'e_pink4',
			'x': 1.3,
			'y': 0.1,
			'w': 0.4,
			'h': 0.4 / 4,
			'ry': 20,
			'rx': -10,
			't': js13k.Assets.getEyesTexture( '•  •', 'f2c' ),
		} );

		W.plane( {
			'g': 'e_pink_all',
			'n': 'e_pink5',
			'x': -0.5,
			'y': 0.3,
			'w': 0.5,
			'h': 0.5 / 4,
			'ry': -20,
			't': js13k.Assets.getEyesTexture( '•  •', 'f2c' ),
		} );
		W.plane( {
			'g': 'e_pink_all',
			'n': 'e_pink6',
			'x': -0.8,
			'w': 0.4,
			'h': 0.4 / 4,
			'ry': -20,
			't': js13k.Assets.getEyesTexture( '•   •', 'f2c' ),
		} );
		W.plane( {
			'g': 'e_pink_all',
			'n': 'e_pink7',
			'x': -1.2,
			'y': 0.2,
			'w': 0.6,
			'h': 0.6 / 4,
			'ry': -20,
			't': js13k.Assets.getEyesTexture( '•  •', 'f2c' ),
		} );
		W.plane( {
			'g': 'e_pink_all',
			'n': 'e_pink8',
			'x': -1.4,
			'y': -0.2,
			'w': 0.5,
			'h': 0.5 / 4,
			'ry': -20,
			't': js13k.Assets.getEyesTexture( '•   •', 'f2c' ),
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
	 */
	clicked() {
		if( this.note ) {
			this.note = null;
		}
		else {
			this.selectObject();
		}
	}


	/**
	 *
	 * @param {number} floor
	 */
	doFloorAction( floor ) {
		const loop = this.loop;
		const hasFloor13 = this.buttonsEnabled.includes( 13 );
		let scene = js13k.SCENE.NORMAL;

		if( loop == 1 ) {
			// (red) stares from a distance, next loop
			if( floor == 13 ) {
				scene = js13k.SCENE.NEXT_LOOP;
			}
		}
		else if( loop == 2 ) {
			if( !hasFloor13 ) {
				this.buttonsEnabled.push( 13 );
			}

			// (blue) first dialog
			if( floor == 3 ) {
				// Look to player
				W.move( {
					'n': 'e_blue',
					'rx': 0,
					'ry': 0,
					'a': 500,
					'onAnimDone': () => {
						this.runners.push( {
							duration: 2,
							do: progress => {
								this.showDialog( js13k.Assets.texts.blue1, W.next.e_blue, '77f', progress );

								return progress > 2 || this.floorCurrent != 3;
							},
						} );

						// Look away again
						W.move( {
							'n': 'e_blue',
							'rx': 30,
							'ry': -45,
							'a': 2000,
						} );
					},
				} );
			}
			// (red) is closer now, next loop
			else if( floor == 13 ) {
				scene = js13k.SCENE.NEXT_LOOP;
			}
		}
		else if( loop == 3 ) {
			if( !hasFloor13 && this.hasVisitedFloors( [3, 7] ) ) {
				this.buttonsEnabled.push( 13 );
			}

			// (blue) second dialog
			if( floor == 3 ) {
				const pos = {
					x: W.next.e_blue.x,
					y: W.next.e_blue.y,
					z: W.next.e_blue.z,
					h: W.next.e_blue.h,
				};

				this.runners.push( {
					duration: 2,
					do: progress => {
						this.showDialog( js13k.Assets.texts.blue2, pos, '77f', progress );
						W.move( {
							'n': 'e_blue',
							'x': pos.x + ( Math.random() - 0.5 ) / 60,
							'y': pos.y + ( Math.random() - 0.5 ) / 100,
						} );

						return this.elevator == js13k.STATE.MOVING;
					},
				} );
			}
			// (pink) first dialog
			else if( floor == 7 ) {
				const y = W.next.e_pink1.y;

				this.runners.push(
					{
						duration: 5,
						do: progress => {
							this.showDialog( js13k.Assets.texts.pink1, W.next.e_pink1, 'f2c', progress );

							return progress > 1;
						},
					},
					{
						duration: 10,
						do: progress => {
							const f = ( Math.sin( Math.PI * 10 * progress ) + 1 ) / 2;

							W.move( {
								'n': 'e_pink1',
								'y': y - f * 0.025,
								'rx': f * 40,
							} );

							return progress > 1 || this.elevator == js13k.STATE.MOVING;
						},
					},
				);
			}
			// Have (red) walk closer, next loop
			else if( floor == 13 ) {
				const { y: startY, z: startZ } = W.next.e_red;
				const goalY = 0.3;
				const goalZ = -1.5;
				const diffY = goalY - startY;
				const diffZ = goalZ - startZ;

				this.runners.push( {
					duration: 2,
					do: progress => {
						W.move( {
							'n': 'e_red',
							'y': startY + diffY * progress,
							'z': startZ + diffZ * progress,
						} );

						if( progress > 1 ) {
							this.setScene( js13k.SCENE.NEXT_LOOP );

							return true;
						}

						return false;
					},
				} );
			}

			return;
		}
		else if( loop == 4 ) {
			if( !hasFloor13 && this.hasVisitedFloors( [3, 4, 7] ) ) {
				this.buttonsEnabled.push( 13 );
			}

			// (blue) dying
			if( floor == 3 ) {
				this.runners.push( {
					duration: 2,
					do: progress => {
						this.showDialog( js13k.Assets.texts.blue3, W.next.e_blue, '77f', progress );

						return progress > 1;
					},
				} );
			}
			// (red) among the (pink)
			else if( floor == 7 ) {
				this.runners.push( {
					duration: 2,
					do: progress => {
						this.showDialog( js13k.Assets.texts.pink2, W.next.e_pink1, 'f2c', progress );

						return progress > 1;
					},
				} );
			}
			// Empty, next loop
			else if( floor == 13 ) {
				scene = js13k.SCENE.NEXT_LOOP;
			}
		}
		else if( loop == 5 ) {
			// A different (blue)
			if( floor == 3 ) {
				this.runners.push( {
					duration: 2,
					do: progress => {
						this.showDialog( js13k.Assets.texts.blue4, W.next.e_blue, '7ae', progress );

						return progress > 1;
					},
				} );
			}
			// (red) kills (pink), attacks player
			else if( floor == 7 ) {
				const pos = [5, 6, 8].map( index => {
					const key = 'e_pink' + index;

					return {
						n: key,
						x: W.next[key].x,
						y: W.next[key].y,
					};
				} );

				this.runners.push( {
					duration: 2,
					do: _progress => {
						pos.forEach( o => {
							W.move( {
								'n': o.n,
								'x': o.x + ( Math.random() - 0.5 ) / 60,
								'y': o.y + ( Math.random() - 0.5 ) / 100,
							} );
						} );

						return this.elevator == js13k.STATE.MOVING;
					},
				} );

				// (red) looks towards player
				W.move( {
					'n': 'e_red',
					'rx': 0,
					'ry': 0,
					'rz': 0,
					'a': 700,
					'onAnimDone': () => {
						const {
							x: startX,
							y: startY,
							z: startZ
						} = W.next.e_red;

						// (red) moves towards player
						this.runners.push( {
							duration: 5,
							do: progress => {
								if( this.handleRedAttack( progress ) ) {
									return true;
								}

								W.move( {
									'n': 'e_red',
									'x': ( 1 - progress ) * startX,
									'y': ( 1 - progress ) * startY,
									'z': ( 1 - progress ) * ( startZ + 1 ) - 1,
								} );

								return false;
							},
						} );
					},
				} );
			}
			// Empty, next loop
			else if( floor == 13 ) {
				scene = js13k.SCENE.NEXT_LOOP;
			}
			// A chance of (red) attacking if floor 7 has already been visited
			// Except for the floor where the button can be found
			else if( floor != 8 && this.floorsVisited.includes( 7 ) && Math.random() < 0.3 ) {
				W.move( {
					'n': 'e_red',
					'x': 0,
					'y': 0.5,
					'z': -3,
				} );

				// (red) moves towards player
				this.runners.push( {
					duration: 5,
					do: progress => {
						if( this.handleRedAttack( progress ) ) {
							return true;
						}

						W.move( {
							'n': 'e_red',
							'y': ( 1 - progress ) * 0.5,
							'z': ( 1 - progress ) * -2 - 1,
						} );

						return false;
					},
				} );
			}
		}
		else if( loop == 6 ) {
			// Ending
			if( floor == 1 ) {
				scene = js13k.SCENE.OUTRO;
			}
		}

		this.setScene( scene );
	}


	/**
	 *
	 * @returns {boolean}
	 */
	doorsInMotion() {
		return [
			js13k.STATE.CLOSING,
			js13k.STATE.OPENING,
		].includes( this.doors );
	}


	/**
	 *
	 * @param {function?} cb
	 */
	doorsClose( cb ) {
		if( this.doors == js13k.STATE.CLOSED || this.doorsInMotion() ) {
			cb?.();
			return;
		}

		this.doors = js13k.STATE.CLOSING;

		js13k.Audio.play( js13k.Audio.DOORS );

		W.move( {
			'n': 'dlg',
			'x': -this._rightDoorClosed,
			'a': 2000,
		} );
		W.move( {
			'n': 'drg',
			'x': this._rightDoorClosed,
			'a': 2000,
			'onAnimDone': () => {
				this.doors = js13k.STATE.CLOSED;
				setTimeout( () => cb?.(), 800 );
			},
		} );
	}


	/**
	 *
	 * @param {function?} cb
	 */
	doorsOpen( cb ) {
		if( this.doors == js13k.STATE.OPEN || this.doorsInMotion() ) {
			cb?.();
			return;
		}

		this.doors = js13k.STATE.OPENING;

		setTimeout( () => {
			js13k.Audio.play( js13k.Audio.DOORS );

			W.move( {
				'n': 'dlg',
				'x': -this._rightDoorOpen,
				'a': 2000,
			} );
			W.move( {
				'n': 'drg',
				'x': this._rightDoorOpen,
				'a': 2000,
				'onAnimDone': () => {
					this.doors = js13k.STATE.OPEN;
					cb?.();
				},
			} );
		}, 800 );
	}


	/**
	 *
	 * @param {number} progress
	 * @returns {boolean}
	 */
	handleRedAttack( progress ) {
		if( this.doors == js13k.STATE.CLOSED ) {
			js13k.Audio.play( js13k.Audio.THUD );
			js13k.Audio.text(
				'*thud*', 'f00', 3,
				{
					x: 0,
					y: 0.1,
					z: -1,
				}
			);

			const camStart = {
				'x': W.next.camera.x,
				'y': W.next.camera.y,
				'z': W.next.camera.z,
			};

			// Short screen shake
			this.runners.push( {
				duration: 0.7,
				do: progress => {
					W.camera( {
						'x': camStart.x + ( Math.random() * 2 - 1 ) / 300,
						'y': camStart.y + ( Math.random() * 2 - 1 ) / 300,
						'z': camStart.z + ( Math.random() * 2 - 1 ) / 300,
					} );

					return progress > 1;
				},
			} );

			W.move( {
				'n': 'e_red',
				'z': 100,
			} );

			return true;
		}

		// Didn't close doors on time
		if( progress > 1 ) {
			this.setScene( js13k.SCENE.REPEAT_LOOP );
			return true;
		}

		return false;
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
			this.note = o.n;
		}
		else if( o.n.startsWith( 'btn' ) ) {
			if( !this.isButtonEnabled( o.n ) && this.loop == 5 && o.n == 'btn13' ) {
				W.move( this.oBtn13 );
				W.move( this.oLblBtn13 );
				this.buttonsEnabled.push( 13 );

				return;
			}

			if( this.elevator == js13k.STATE.IDLE ) {
				if( !this.isButtonEnabled( o.n ) ) {
					js13k.Audio.play( js13k.Audio.ERROR );
					return;
				}

				js13k.Audio.play( js13k.Audio.BUTTON );
				js13k.Audio.text( '*beep*', 'ff0', 1, o );

				const floor = Number( o.n.substring( 3 ) );

				// "Close doors" button ("><")
				if( floor == 0 ) {
					this.doorsClose();
					return;
				}

				// Same floor, toggle door state
				if( this.floorCurrent == floor ) {
					if( this.doors == js13k.STATE.OPEN ) {
						this.doorsClose();
					}
					else {
						this.doorsOpen();
					}

					return;
				}

				this.floorNext = floor;
				this.elevator = js13k.STATE.MOVING;

				this.doorsClose( () => this.setScene( js13k.SCENE.ELEVATOR_MOVING ) );
			}
		}
	}


	/**
	 *
	 * @param {number[]} check
	 * @returns {boolean}
	 */
	hasVisitedFloors( check ) {
		for( let i = 0; i < check.length; i++ ) {
			if( !this.floorsVisited.includes( check[i] ) ) {
				return false;
			}
		}

		return true;
	}


	/**
	 *
	 * @param {object?} target
	 * @param {string}  target.n
	 */
	highlight( target ) {
		if( !target || !this.isButtonEnabled( target.n ) ) {
			if( !target || this.loop != 5 || target.n != 'btn13' ) {
				W.move( {
					'n': 'hl',
					'z': 100,
				} );

				return;
			}
		}

		const o = W.next[target.n];
		const oGlobal = js13k.getGlobalPos( o );
		const size = 0.005;

		W.move( {
			'n': 'hl',
			'x': oGlobal.x,
			'y': oGlobal.y,
			'z': oGlobal.z + ( o.ry ? 0 : size * 2 ),
			'rx': o.rx,
			'ry': o.ry,
			'rz': o.rz,
		} );

		W.move( {
			'n': 'hl_t',
			'y': oGlobal.h / 2,
			'w': oGlobal.w,
			'h': size,
		} );

		W.move( {
			'n': 'hl_r',
			'x': oGlobal.w / 2,
			'h': oGlobal.h,
			'w': size,
		} );

		W.move( {
			'n': 'hl_b',
			'y': -oGlobal.h / 2,
			'w': oGlobal.w,
			'h': size,
		} );

		W.move( {
			'n': 'hl_l',
			'x': -oGlobal.w / 2,
			'h': oGlobal.h,
			'w': size,
		} );
	}


	/**
	 *
	 * @param {string} n
	 * @returns {boolean}
	 */
	isButtonEnabled( n ) {
		if( !n.startsWith( 'btn' ) ) {
			return true;
		}

		return this.buttonsEnabled.includes(
			Number( n.replace( 'btn', '' ) )
		);
	}


	/**
	 *
	 * @param {number} nextLoop
	 */
	loopNext( nextLoop ) {
		W.camera( {
			'x': 0,
			'y': 0,
			'z': 0,
		} );

		this.loop = nextLoop;
		this.floorsVisited = [];
		this.floorCurrent = this.loop == 6 ? 13 : 1;
		this.floorNext = this.floorCurrent;
		this.setDisplay( this.floorCurrent );
		this.prepareLoop( nextLoop );
		this._lastSelectable = null;
	}


	/**
	 *
	 * @param {number} floor
	 */
	prepareFloor( floor ) {
		const loop = this.loop;

		const red = {
			'n': 'e_red',
			'y': 0.8,
			'z': 100, // outside of visible area
		};
		const blue = {
			'n': 'e_blue',
			'y': 0,
			'z': 100,
			'rx': 0,
		};
		const pink = {
			'n': 'e_pink_all',
			'z': 100,
		};

		if( loop == 1 ) {
			if( floor == 13 ) {
				red.z = -3;
			}
		}
		else if( loop == 2 ) {
			if( floor == 3 ) {
				blue.z = -4;
			}
			else if( floor == 13 ) {
				red.z = -3;
			}
		}
		else if( loop == 3 ) {
			if( floor == 3 ) {
				blue.z = -4;
			}
			else if( floor == 7 ) {
				pink.z = -3;
			}
			else if( floor == 13 ) {
				red.z = -3;
			}
		}
		else if( loop == 4 ) {
			const note = {
				'n': 's_note4',
				'z': 100,
			};

			if( floor == 3 ) {
				blue.y = -1;
				blue.z = -5;
				blue.rx = -90;
			}
			else if( floor == 4 ) {
				note.z = -2;
			}
			else if( floor == 7 ) {
				pink.z = -3;

				// Replace one of (pink) with (red)
				red.x = W.next.e_pink7.x;
				red.y = W.next.e_pink7.y;
				red.z = -3;
				W.move( {
					'n': 'e_pink7',
					'z': 100,
				} );
			}

			W.move( note );
		}
		else if( loop == 5 ) {
			if( floor == 3 ) {
				blue.z = -3;
			}
			else if( floor == 7 ) {
				if( !this.floorsVisited.includes( 7 ) ) {
					pink.z = -3;

					W.move( {
						'n': 'e_pink5',
						'x': -0.5,
						'y': 0.2,
						'ry': -30,
					} );
					W.move( {
						'n': 'e_pink6',
						'y': -0.1,
						'ry': -30,
					} );
					W.move( {
						'n': 'e_pink8',
						'x': -1.1,
						'y': 0.1,
						'ry': -30,
					} );

					red.x = 0.75;
					red.z = -3;
					red.ry = 30;
				}
			}
			else if( floor == 8 ) {
				W.move( {
					'n': 'btn13',
					'x': -0.6,
					'y': -1.2,
					'z': -0.2,
					'rx': 90,
					'ry': 10,
				} );
				W.move( {
					'n': 's_lbl_btn13',
					'x': -0.6,
					'y': -1.189,
					'z': -0.2,
					'rx': -90,
					'ry': 10,
				} );
			}
		}
		else if( loop == 6 ) {
			//
		}

		W.move( red );
		W.move( blue );
		W.move( pink );
	}


	/**
	 *
	 * @param {number} loop
	 */
	prepareLoop( loop ) {
		const enabledButtons = [
			[0, 13],
			[0, 3],
			[0, 3, 7],
			[0, 3, 4, 7],
			[0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], // Button for 13 has to be collected first
			[1],
		];

		this.buttonsEnabled = enabledButtons[loop - 1];

		if( loop == 2 ) {
			W.plane( {
				'n': 's_note2',
				'g': 'dlg',
				'x': 0.3,
				'y': -0.3,
				'z': 0.0251,
				'w': this._noteWidth,
				'h': this._noteWidth * 1.414,
				'rz': 20,
				't': js13k.Assets.textures.paper,
			} );
		}
		else if( loop == 3 ) {
			W.plane( {
				'n': 's_note3',
				'x': this._evX / 2 - 0.03,
				'y': -0.2,
				'z': -0.1,
				'w': this._noteWidth,
				'h': this._noteWidth * 1.414,
				'ry': -90,
				't': js13k.Assets.textures.paper,
			} );
		}
		else if( loop == 4 ) {
			W.plane( {
				'n': 's_note4',
				'x': -0.1,
				'y': -this._evY / 2,
				'w': this._noteWidth,
				'h': this._noteWidth * 1.414,
				'rx': -90,
				'ry': 5,
				't': js13k.Assets.textures.paper,
				'b': '000',
				'mix': 0.7,
			} );
		}
		else if( loop == 5 ) {
			W.move( {
				'n': 'btn13',
				'z': 100,
			} );
			W.move( {
				'n': 's_lbl_btn13',
				'z': 100,
			} );

			W.move( {
				'n': 'e_blue',
				'x': -1,
				'y': -0.4,
				'ry': -45,
				't': js13k.Assets.getEyesTexture( '•  •', '7ae' ),
			} );
		}
		else if( loop == 6 ) {
			W.clearColor( 'eee' );
			W.delete( 'plane' );
			W.delete( 'dsl' );
			W.delete( 'dsr' );
		}

		if( loop > 1 ) {
			W.delete( 's_note1' );
			W.delete( 'title' ); // TODO: remove, only for developing
		}
		if( loop > 2 ) {
			W.delete( 's_note2' );
		}
		if( loop > 3 ) {
			W.delete( 's_note3' );
		}
		if( loop > 4 ) {
			W.delete( 's_note4' );
			W.delete( 'e_pink1' );
			W.delete( 'e_pink2' );
			W.delete( 'e_pink3' );
			W.delete( 'e_pink4' );
			W.delete( 'e_pink7' );
		}
	}


	/**
	 *
	 */
	runRunners() {
		const remove = [];

		for( let i = 0; i < this.runners.length; i++ ) {
			const runner = this.runners[i];
			runner.start ??= this.timer;

			const progress = ( this.timer - runner.start ) / ( runner.duration * js13k.TARGET_FPS );

			// Return something true-ish to remove a runner.
			if( runner.do( progress ) ) {
				remove.push( runner );
			}
		}

		this.runners = this.runners.filter( runner => !remove.includes( runner ) );
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

		const loop = this.loop;
		const runner = {};

		if( scene == js13k.SCENE.ELEVATOR_MOVING ) {
			if( W.next.dialog ) {
				W.move( {
					'n': 'dialog',
					'z': 100,
				} );
			}

			const camStart = {
				'x': W.next.camera.x,
				'y': W.next.camera.y,
				'z': W.next.camera.z,
			};

			// Moving from 1 floor to the next takes 1.2 seconds.
			// Multiple floors take longer. But the greater the
			// floor difference, the faster it is.
			const floorDiff = this.floorNext - this.floorCurrent;
			runner.duration = Math.min( 5, 1.2 * Math.abs( floorDiff ) );

			js13k.Audio.play( js13k.Audio.ELEVATOR, runner.duration );

			runner.do = progress => {
				this.setDisplay( this.floorCurrent + Math.round( progress * floorDiff ) );

				if( progress > 1 ) {
					this.prepareFloor( this.floorNext );

					W.camera( camStart );
					js13k.Audio.play( js13k.Audio.DING );
					js13k.Audio.text( '*ding*', 'ff0', 3, W.next.display );

					this.floorCurrent = this.floorNext;
					this.floorsVisited.push( this.floorCurrent );

					this.doorsOpen( () => {
						this.elevator = js13k.STATE.IDLE;
						this.setScene( js13k.SCENE.NORMAL );
						setTimeout( () => this.doFloorAction( this.floorCurrent ), 1 );
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
		else if( scene == js13k.SCENE.NEXT_LOOP ) {
			this.canInteract = false;

			const redStartZ = W.next.e_red.z;

			runner.duration = 3;
			runner.do = progress => {
				js13k.Renderer.cameraLocked = true;

				// TODO: fade to black transition, sometimes with (red) still visible
				// - Just move camera out of elevator and move (red) back to keep same distance?
				// - Turn all ambient colors black?
				const cam = {
					'z': 0,
					'rx': 0,
					'ry': 0,
				};

				if( progress > 1 ) {
					W.move( {
						'n': 'e_red',
						'z': 100,
					} );
					js13k.Renderer.cameraLocked = false;
					this.loopNext( loop + 1 );
					setTimeout( () => this.setScene( js13k.SCENE.INTRO ), 1 );

					return true;
				}

				cam.z = -0.5 * progress;
				W.move( {
					'n': 'e_red',
					'z': redStartZ + cam.z,
				} );
				W.camera( cam );

				return false;
			};
		}
		else if( scene == js13k.SCENE.REPEAT_LOOP ) {
			this.canInteract = false;

			runner.duration = 3;
			runner.do = progress => {
				js13k.Renderer.cameraLocked = true;

				if( progress > 1 ) {
					js13k.Renderer.cameraLocked = false;
					this.loopNext( loop );
					setTimeout( () => this.setScene( js13k.SCENE.INTRO ), 1 );

					return true;
				}

				js13k.Renderer.ctxUI.fillStyle = `rgba(0,0,0,${progress})`;
				js13k.Renderer.ctxUI.fillRect(
					0, 0,
					js13k.Renderer.cnvUI.width, js13k.Renderer.cnvUI.height
				);

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

				if( progress > 1 ) {
					setTimeout( () => this.setScene( js13k.SCENE.INTRO ), 1 );
				}

				return progress > 1;
			};
		}
		else if( scene == js13k.SCENE.OUTRO ) {
			// Hide pointer
			document.getElementById( 'p' ).hidden = true;
			this.canInteract = false;
			js13k.Renderer.cameraLocked = true;

			W.camera( {
				'rx': 0,
				'ry': 0,
				'a': 1000,
				'onAnimDone': () => {
					runner.duration = 5;
					runner.do = progress => {
						// Wait a moment before actually doing anything
						if( progress < 0.2 ) {
							return false;
						}

						progress -= 0.2;

						W.camera( { 'z': progress * -2 } );

						const alpha = Math.min( progress, 1 );
						const w = js13k.Renderer.cnvUI.width;
						const h = js13k.Renderer.cnvUI.height;

						js13k.Renderer.ctxUI.fillStyle = `rgba(238,238,238,${alpha})`;
						js13k.Renderer.ctxUI.fillRect( 0, 0, w, h );

						js13k.Renderer.ctxUI.font = '96px ' + js13k.FONT_SERIF;
						js13k.Renderer.ctxUI.textAlign = 'center';
						js13k.Renderer.ctxUI.fillStyle = `rgba(110,110,110,${alpha})`;
						js13k.Renderer.ctxUI.fillText( 'ESCAPED', w / 2, h / 2 );

						return false;
					};

					this.runners.push( runner );
				},
			} );
		}

		runner.do && this.runners.push( runner );
	}


	/**
	 *
	 * @param {string[]} lines
	 * @param {object}   pos
	 * @param {number}   pos.h
	 * @param {number}   pos.x
	 * @param {number}   pos.y
	 * @param {number}   pos.z
	 * @param {string}   color
	 * @param {number}   progress
	 */
	showDialog( lines, pos, color, progress ) {
		if( !W.next.dialog ) {
			[this.cnvDialog, this.ctxDialog] = js13k.Renderer.getOffscreenCanvas( 2, 2, 'dialog' );

			W.billboard( {
				'n': 'dialog',
				'ns': 1,
				't': this.cnvDialog,
			} );
		}

		progress = Math.min( progress, 1 );

		let total = 0;
		let longest = 0;

		for( let i = 0; i < lines.length; i++ ) {
			const text = lines[i];
			total += text.length;
			longest = Math.max( longest, text.length );
		}

		this.cnvDialog.width = longest * 14;
		this.cnvDialog.height = lines.length * 30;

		this.ctxDialog.clearRect( 0, 0, this.cnvDialog.width, this.cnvDialog.height );
		this.ctxDialog.font = '600 24px ' + js13k.FONT_SANS;
		this.ctxDialog.textAlign = 'center';
		this.ctxDialog.textBaseline = 'top';
		this.ctxDialog.fillStyle = '#' + color;

		const textPos = Math.round( progress * total );
		let shown = 0;
		let linesDiff = lines.length;
		let lastChar = '';

		for( let i = 0; i < lines.length; i++ ) {
			const text = lines[i].substring( 0, textPos - shown );
			shown += text.length;
			linesDiff--;
			lastChar = text[text.length - 1];

			this.ctxDialog.fillText( text, this.cnvDialog.width / 2, i * 30 );

			if( shown >= textPos ) {
				break;
			}
		}

		W.gl.deleteTexture( W.textures.dialog );
		delete W.textures.dialog;

		const globalPos = js13k.getGlobalPos( pos );
		const relH = 30 / 400 * linesDiff;

		W.move( {
			'n': 'dialog',
			'x': globalPos.x,
			'y': globalPos.y + globalPos.h / 2 + 0.1 - relH,
			'z': globalPos.z,
			'w': this.cnvDialog.width / 400,
			'h': this.cnvDialog.height / 400,
			't': this.cnvDialog,
		} );

		if( ( this._lastDialogTextPos || 0 ) < textPos ) {
			this._lastDialogTextPos = textPos;

			if( lastChar != ' ' ) {
				js13k.Audio.play( js13k.Audio.TALKING );
			}
		}
	}


	/**
	 *
	 * @param {number} dt
	 */
	update( dt ) {
		this.timer += dt;
		this.runRunners();

		if( this.note ) {
			const text = js13k.Assets.texts[this.note];
			js13k.Renderer.drawNote( text );

			if( js13k.Input.isPressed( js13k.Input.ACTION.INTERACT, true ) ) {
				this.note = null;
			}
		}
		else if( this.canInteract && this.elevator == js13k.STATE.IDLE ) {
			this._checkSelections();
		}
	}


};
