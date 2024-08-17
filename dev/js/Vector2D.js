'use strict';


js13k.Vector2D = class {


	/**
	 *
	 * @constructor
	 * @param {number} [x = 0]
	 * @param {number} [y = 0]
	 */
	constructor( x = 0, y = 0 ) {
		this.x = x;
		this.y = y;
	}


	/**
	 *
	 * @return {js13k.Vector2D}
	 */
	clone() {
		return new js13k.Vector2D( this.x, this.y );
	}


	/**
	 * Get the length of the vector.
	 * @return {number} Length of the vector.
	 */
	length() {
		if( this.x + this.y == 0 ) {
			return 0;
		}

		return Math.sqrt( this.x * this.x + this.y * this.y );
	}


	/**
	 * Multiply with a number.
	 * @param  {number} v
	 * @return {js13k.Vector2D}
	 */
	mul( v ) {
		this.x *= v;
		this.y *= v;

		return this;
	}


	/**
	 * Normalize the vector.
	 * @return {js13k.Vector2D}
	 */
	normalize() {
		const length = this.length();

		if( length ) {
			this.x /= length;
			this.y /= length;
		}

		return this;
	}


	/**
	 *
	 * @param {number} x
	 * @param {number} y
	 */
	set( x, y ) {
		this.x = x;
		this.y = y;
	}


	/**
	 * Subtract a vector.
	 * @param  {js13k.Vector2D} v
	 * @return {js13k.Vector2D}
	 */
	sub( v ) {
		this.x -= v.x;
		this.y -= v.y;

		return this;
	}


};
