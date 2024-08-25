'use strict';


/**
 * @namespace js13k
 */
// eslint-disable-next-line no-redeclare
const js13k = {


	// Config
	FONT_SANS: 'Arial, sans-serif',
	FONT_SERIF: '"Times New Roman", serif',
	FOV: 30,
	TARGET_FPS: 60,
	TITLE: 'Triskaidekaphobia',


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
