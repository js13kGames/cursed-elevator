'use strict';


js13k.Level = class {


	/**
	 *
	 * @constructor
	 */
	constructor() {
		this.timer = 0;

		this._evX = 2;
		this._evY = 3;
		this._evZ = 2;

		this._buildElevatorWalls();
		this._buildElevatorDoors();
		this._buildElevatorDisplay();
		this._buildElevatorNumberPad();
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
			'y': this._evY / 2 - h - 0.15,
			'z': -this._evZ / 2 + 0.06,
		} );

		// base plate
		W.plane( {
			'g': g,
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
		// Left door
		W.cube( {
			'n': 'dl',
			'x': -( this._evX - this._evX / 5 ) / 2,
			'y': 0,
			'z': -this._evZ / 2,
			'w': this._evX / 5 * 2,
			'h': this._evY,
			'd': 0.05,
			'b': 'aaa',
		} );

		// Right door
		W.cube( {
			'n': 'dr',
			'x': ( this._evX - this._evX / 5 ) / 2,
			'y': 0,
			'z': -this._evZ / 2,
			'w': this._evX / 5 * 2,
			'h': this._evY,
			'd': 0.05,
			'b': 'aaa',
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
			'x': this._evX / 2 - w / 2 - 0.06,
			'y': -h / 2 + 0.075,
			'z': -this._evZ / 2 + 0.06,
		} );

		// base plate
		W.plane( {
			'g': g,
			'w': w,
			'h': h,
			'b': 'bbb',
		} );

		const padding = 0.02;
		const btnW = 0.1;
		const btnH = 0.07;
		const offsetX = ( btnW + padding ) / 2;
		const offsetY = 6 * ( btnH + padding ) / 2;

		for( let i = 0; i < 14; i++ ) {
			W.cube( {
				'g': g,
				'n': 's_btn' + i,
				'x': ( i % 2 ) * ( padding + btnW ) - offsetX,
				'y': ~~( i / 2 ) * ( padding + btnH ) - offsetY,
				'w': btnW,
				'h': btnH,
				'd': 0.02,
				'b': 'ddd',
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
		W.group( { 'n': g } );
		// floor
		W.plane( {
			'g': g,
			'x': 0,
			'y': -this._evY / 2,
			'z': 0,
			'w': this._evX,
			'h': this._evZ,
			'rx': -90,
			'b': '333',
		} );
		// ceiling
		W.plane( {
			'g': g,
			'x': 0,
			'y': this._evY / 2,
			'z': 0,
			'w': this._evX,
			'h': this._evZ,
			'rx': 90,
			'b': 'bbb',
		} );
		// wall: left
		W.plane( {
			'g': g,
			'x': -this._evX / 2,
			'y': 0,
			'z': 0,
			'ry': 90,
			'w': this._evZ,
			'h': this._evY,
			'b': 'aaa',
		} );
		// wall: right
		W.plane( {
			'g': g,
			'x': this._evX / 2,
			'y': 0,
			'z': 0,
			'ry': -90,
			'w': this._evZ,
			'h': this._evY,
			'b': 'aaa',
		} );
		// wall: back
		W.plane( {
			'g': g,
			'x': 0,
			'y': 0,
			'z': this._evZ / 2,
			'ry': 180,
			'w': this._evX,
			'h': this._evY,
			'b': '999',
		} );
		// front, left side
		W.cube( {
			'g': g,
			'x': -( this._evX - this._evX / 5 ) / 2,
			'y': 0,
			'z': -this._evZ / 2,
			'w': this._evX / 5,
			'h': this._evY,
			'd': 0.1,
			'b': '999',
		} );
		// front, right side
		W.cube( {
			'g': g,
			'x': ( this._evX - this._evX / 5 ) / 2,
			'y': 0,
			'z': -this._evZ / 2,
			'w': this._evX / 5,
			'h': this._evY,
			'd': 0.1,
			'b': '999',
		} );
		// front, top
		W.cube( {
			'g': g,
			'x': 0,
			'y': ( this._evY - this._evY / 4 ) / 2,
			'z': -this._evZ / 2,
			'w': this._evX,
			'h': this._evY / 4,
			'd': 0.1,
			'b': '999',
		} );
	}


	/**
	 *
	 */
	render() {
		// TODO:
	}


	/**
	 *
	 * @param {number} dt
	 */
	update( dt ) {
		this.timer += dt;
	}


};
