'use strict';


/**
 * @namespace js13k
 */
// eslint-disable-next-line no-redeclare
const js13k = {


	// Config
	FONT_SANS: 'Arial, sans-serif',
	FONT_SERIF: '"Times New Roman", serif',
	FONT_MONO: '"Courier New", monospace',
	TARGET_FPS: 60,


	/**
	 *
	 */
	init() {
		js13k.Input.init();
		js13k.Renderer.init();
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
