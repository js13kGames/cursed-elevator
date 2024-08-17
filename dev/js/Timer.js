'use strict';


/**
 * Timer class to time e.g. animations.
 * Based on the Timer class of LittleJS:
 * https://killedbyapixel.github.io/LittleJS/docs/Timer.html
 */
js13k.Timer = class {


	/**
	 *
	 * @constructor
	 * @param {js13k.Level} level          - Level to which this timer sets its time to.
	 * @param {number}      [duration = 0] - Duration in game seconds.
	 */
	constructor( level, duration = 0 ) {
		this.level = level;
		this.set( duration );
	}


	/**
	 *
	 * @return {boolean}
	 */
	elapsed() {
		return this.level.timer > this.timeEnd;
	}


	/**
	 * 
	 * @return {number} Progress as [0, 1]
	 */
	progress() {
		return Math.min( 1, 1 - ( this.timeEnd - this.level.timer ) / this.duration );
	}


	/**
	 * Reset the timer to a new duration.
	 * @param {number} duration - Duration in game seconds.
	 */
	set( duration ) {
		this.duration = duration * js13k.TARGET_FPS;
		this.timeEnd = this.level.timer + this.duration;
	}


};
