'use strict';


/**
 * @namespace js13k.Input
 */
js13k.Input = {


	ACTION: {
		PAUSE: 1,
		INTERACT: 2,
		CANCEL: 3,

		LEFT: 10,
		UP: 11,
		RIGHT: 12,
		DOWN: 13,
	},

	_ignoreUntilReleased: {},
	_onKeyDown: {},
	_onKeyUp: {},

	keystate: {},


	/**
	 *
	 */
	buildActionKeyMap() {
		this.ACTION_KEY_MAP = {
			[this.ACTION.PAUSE]: {
				keyboard: ['Escape'],
			},
			[this.ACTION.UP]: {
				keyboard: ['ArrowUp', 'KeyW', 'KeyZ', 'KeyY'], // Z: French layout, Y: Also french layout, because Firefox behaves weird
			},
			[this.ACTION.LEFT]: {
				keyboard: ['ArrowLeft', 'KeyA', 'KeyQ'], // Q: French layout
			},
			[this.ACTION.DOWN]: {
				keyboard: ['ArrowDown', 'KeyS'],
			},
			[this.ACTION.RIGHT]: {
				keyboard: ['ArrowRight', 'KeyD'],
			},
			[this.ACTION.INTERACT]: {
				keyboard: ['KeyE', 'Enter'],
			},
		};
	},


	/**
	 *
	 * @return {object}
	 */
	getDirections() {
		let x = 0;
		let y = 0;

		if( this.isPressed( this.ACTION.LEFT ) ) {
			x = -1;
		}
		else if( this.isPressed( this.ACTION.RIGHT ) ) {
			x = 1;
		}

		if( this.isPressed( this.ACTION.UP ) ) {
			y = -1;
		}
		else if( this.isPressed( this.ACTION.DOWN ) ) {
			y = 1;
		}

		return { x, y };
	},


	/**
	 * Get the keyboard key codes for a certain action.
	 * @param  {number} action
	 * @return {object}
	 */
	getKeysForAction( action ) {
		return this.ACTION_KEY_MAP[action];
	},


	/**
	 * Initialize the input handler.
	 */
	init() {
		this.buildActionKeyMap();
		this.registerEvents();
	},


	/**
	 *
	 * @param  {number}   action
	 * @param  {boolean?} forget
	 * @return {boolean}
	 */
	isPressed( action, forget ) {
		const keys = this.getKeysForAction( action );

		for( const key of keys.keyboard ) {
			if( this.isPressedKey( key, forget ) ) {
				return true;
			}
		}

		return false;
	},


	/**
	 * Check if a key is currently being pressed.
	 * @param  {string}  code   - Key code.
	 * @param  {boolean} forget
	 * @return {boolean}
	 */
	isPressedKey( code, forget ) {
		const ks = this.keystate[code];

		if( ks && ks.time ) {
			if( forget ) {
				ks.time = 0;
				ks.waitForReset = true;
			}

			return true;
		}

		return false;
	},


	/**
	 * Add a listener for the keydown event.
	 * @param {string}   code - Key code.
	 * @param {function} cb   - Callback.
	 */
	onKeyDown( code, cb ) {
		const list = this._onKeyDown[code] || [];
		list.push( cb );
		this._onKeyDown[code] = list;
	},


	/**
	 * Add a listener for the keyup event.
	 * @param {string}   code - Key code.
	 * @param {function} cb   - Callback.
	 */
	onKeyUp( code, cb ) {
		const list = this._onKeyUp[code] || [];
		list.push( cb );
		this._onKeyUp[code] = list;
	},


	/**
	 *
	 */
	registerEvents() {
		document.body.onkeydown = ev => {
			const ks = this.keystate[ev.code];

			if( !ks || !ks.waitForReset ) {
				this.keystate[ev.code] = {
					time: Date.now()
				};

				if( this._onKeyDown[ev.code] ) {
					this._onKeyDown[ev.code].forEach( cb => cb() );
				}
			}
		};

		document.body.onkeyup = ev => {
			this.keystate[ev.code] = {
				time: 0
			};

			if( this._onKeyUp[ev.code] ) {
				this._onKeyUp[ev.code].forEach( cb => cb() );
			}
		};
	},


};
