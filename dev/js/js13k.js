'use strict';


/**
 * @namespace js13k
 */
// eslint-disable-next-line no-redeclare
const js13k = {


	// Config
	FONT_MONO: '"Courier New", monospace',
	FONT_SANS: 'Arial, sans-serif',
	FONT_SERIF: '"Times New Roman", serif',
	FOV: 30,
	TARGET_FPS: 60,
	TITLE: 'Triskaidekaphobia',


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

		const pos = {
			x: group.x + o.x,
			y: group.y + o.y,
			z: group.z + o.z,
			w: o.w,
			h: o.h,
		};

		return pos;
	},


	/**
	 *
	 */
	init() {
		js13k.Assets.loadAll( () => {
			js13k.Input.init();
			js13k.Renderer.init();
		} );
	},


	/**
	 *
	 * @return {object?}
	 */
	loadGame() {
		const json = localStorage.getItem( '2024_sd_elevator.save' );
		return json ? JSON.parse( json ) : null;
	},


	/**
	 *
	 * @param {number} levelId
	 */
	saveGame( levelId ) {
		localStorage.setItem(
			'2024_sd_elevator.save',
			JSON.stringify( { level: levelId } )
		);
	},


};


window.addEventListener( 'load', () => js13k.init() );
