'use strict';


/**
 * @namespace js13k.Audio
 */
js13k.Audio = {


	BUTTON: [.3,0,626,,.01,.01,,2.2,,,,,,,,.1,.01,.79,.02],
	DING: [1.5,0,783.99,.07,,1.6,1,2,,,,,,,,,,.3,.15],
	DOORS: [.3,0,164.8138,.2,1.1,.2,3,4,,,,,,,,.1,,,.5,,-562],
	ELEVATOR: [.1,0,146.8324,.2,2,.3,1,2,,,,,,3],
	ERROR: [.3,0,71,,.02,.05,3,.2,,68,,,,,,,.01,.96,.02,,389],
	// ERROR2: [1.2,0,242,.01,.08,,1,1.8,,-5,,,,.1,18,.1,.02,.88,.03,,-1452],
	// ERROR3: [1.1,0,86,,.03,.01,4,2.7,,-7,-390,.11,,.1,,,.02,.94,.01,,-1447],
	// KNOCK: [1.8,0,154,,.01,.03,3,3.9,-9,-27,-9,.01,,.8,169,,,.76,.02,.1,273],
	STEP: [1,0,453,,.07,.008,4,1.6,-6,-2,,,,.4,,.4,.02,.55,.04,,1424],
	// STEP2: [,0,65,.01,.19,.06,3,3,-9,-11,,,.04,,,,.17,.99,.15,.25,312],
	// SQUEEK: [.5,0,817,.03,,.008,3,2.8,,,,,,,,,,.9,.01,.19,-1491],
	TALKING: [.5,0,427,.01,.02,.02,1,3.7,,12,138,.03,,.1,180,1,,.97,.01],
	THUD: [2,0,453,.03,.03,.16,4,3.7,-1,,,,,.2,1.3,.2,.1,.52,.07],
	// THUD2: [2,0,57,.07,.07,.36,4,3.7,3,1,,,,1.3,,.4,,.38,.1,,504],
	// THUD3: [2,0,368,,.03,.17,1,3.4,16,5,,,.07,,31,.5,.21,,.13,.04],


	/**
	 *
	 * @param {number[]} sound
	 * @param {number}   duration
	 */
	play( sound, duration ) {
		if( duration ) {
			sound = sound.slice();
			sound[5] = duration - ( sound[3] || 0 ) - ( sound[5] || 0 ) - ( sound[18] || 0 );
		}

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
