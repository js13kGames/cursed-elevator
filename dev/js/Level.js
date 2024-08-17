'use strict';


js13k.Level = class {


	/**
	 *
	 * @constructor
	 */
	constructor() {
		this.timer = 0;

		const evX = 2;
		const evY = 3;
		const evZ = 2;

		// Group: elevator base
		W.group( { 'n': 'ev' } );
		// floor
		W.plane( {
			'g': 'ev',
			'x': 0,
			'y': -evY / 2,
			'z': 0,
			'w': evX,
			'h': evZ,
			'rx': -90,
			'b': '333'
		} );
		// ceiling
		W.plane( {
			'g': 'ev',
			'x': 0,
			'y': evY / 2,
			'z': 0,
			'w': evX,
			'h': evZ,
			'rx': 90,
			'b': 'bbb'
		} );
		// wall: left
		W.plane( {
			'g': 'ev',
			'x': -evX / 2,
			'y': 0,
			'z': 0,
			'ry': 90,
			'w': evZ,
			'h': evY,
			'b': 'aaa'
		} );
		// wall: right
		W.plane( {
			'g': 'ev',
			'x': evX / 2,
			'y': 0,
			'z': 0,
			'ry': -90,
			'w': evZ,
			'h': evY,
			'b': 'aaa'
		} );
		// wall: back
		W.plane( {
			'g': 'ev',
			'x': 0,
			'y': 0,
			'z': evZ / 2,
			'ry': 180,
			'w': evX,
			'h': evY,
			'b': '999'
		} );
		// front, left side
		W.cube( {
			'g': 'ev',
			'x': -( evX - evX / 5 ) / 2,
			'y': 0,
			'z': -evZ / 2,
			'w': evX / 5,
			'h': evY,
			'd': 0.1,
			'b': '999',
		} );
		// front, right side
		W.cube( {
			'g': 'ev',
			'x': ( evX - evX / 5 ) / 2,
			'y': 0,
			'z': -evZ / 2,
			'w': evX / 5,
			'h': evY,
			'd': 0.1,
			'b': '999'
		} );
		// front, top
		W.cube( {
			'g': 'ev',
			'x': 0,
			'y': ( evY - evY / 4 ) / 2,
			'z': -evZ / 2,
			'w': evX,
			'h': evY / 4,
			'd': 0.1,
			'b': '999'
		} );

		// Left door
		W.cube( {
			'n': 'dl',
			'x': -( evX - evX / 5 ) / 2,
			'y': 0,
			'z': -evZ / 2,
			'w': evX / 5 * 2,
			'h': evY,
			'd': 0.05,
			'b': 'aaa',
		} );

		// Right door
		W.cube( {
			'n': 'dr',
			'x': ( evX - evX / 5 ) / 2,
			'y': 0,
			'z': -evZ / 2,
			'w': evX / 5 * 2,
			'h': evY,
			'd': 0.05,
			'b': 'aaa'
		} );

		// Group: floor display
		// TODO:

		// Group: number pad
		// TODO:
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
