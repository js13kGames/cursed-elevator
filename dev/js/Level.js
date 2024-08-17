'use strict';


js13k.Level = class {


	/**
	 *
	 * @constructor
	 */
	constructor() {
		this.timer = 0;

		// W.camera( { 'x': 0, 'y': 0, 'z': 0, 'rx': -40, 'ry': 0 } );

		// Elevator base
		W.group( { 'n': 'ev' } );
		W.plane( { 'g': 'ev', 'x': 0, 'y': -2, 'z': 0, 'w': 2, 'h': 2, 'rx': -90, 'b': 'aaa' } ); // floor
		W.plane( { 'g': 'ev', 'x': -1, 'y': 0, 'z': 0, 'ry': 90, 'w': 2, 'h': 4, 'b': 'ddd' } ); // wall: left
		W.plane( { 'g': 'ev', 'x': 1, 'y': 0, 'z': 0, 'ry': -90, 'w': 2, 'h': 4, 'b': 'ddd' } ); // wall: right
		W.plane( { 'g': 'ev', 'x': 0, 'y': 0, 'z': 1, 'ry': 180, 'w': 2, 'h': 4, 'b': 'f00' } ); // wall: back

		// W.light( { 'x': 0, 'y': 0, 'z': -1 } );
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
