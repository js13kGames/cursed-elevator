'use strict';


/**
 * @namespace js13k.Audio
 */
js13k.Audio = {


	BUTTON: [.5,0,626,,.01,.01,,2.2,,,,,,,,.1,.01,.79,.02],
	DING: [2,0,783.99,.07,,1.6,1,2,,,,,,,,,,.3,.15],
	// DING2: [1.8,0,563,.02,.09,.19,1,3.3,,,,,,,,,,.55,.02,,615],
	ERROR: [.5,0,71,,.02,.05,3,.2,,68,,,,,,,.01,.96,.02,,389],
	// ERRR: [1.2,0,242,.01,.08,,1,1.8,,-5,,,,.1,18,.1,.02,.88,.03,,-1452],
	// SQUEEK: [.5,0,817,.03,,.008,3,2.8,,,,,,,,,,.9,.01,.19,-1491],


	/**
	 *
	 * @param {number[]} sound
	 */
	play( sound ) {
		zzfx( ...sound );
	},


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
	text( text, color, duration, pos ) {
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
	},


};
