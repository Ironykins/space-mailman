/*
 * preloader.js
 * Copyright (C) 2016 konrad <konrad@serenity>
 *
 * Distributed under terms of the MIT license.
 *
 * Screen to display while we wait for game assets to load.
 */

SpaceMailman.Preloader = function (game) {
	this.background = null;
	this.preloadBar = null;
	this.ready = false;
};

SpaceMailman.Preloader.prototype = {

	preload: function () {

		//	These are the assets we loaded in Boot.js
		//	A nice sparkly background and a loading progress bar
		//this.background = this.add.sprite(0, 0, 'preloaderBackground');
		//this.preloadBar = this.add.sprite(300, 400, 'preloaderBar');

		//	This sets the preloadBar sprite as a loader sprite.
		//	What that does is automatically crop the sprite from 0 to full-width
		//	as the files below are loaded in.
		//this.load.setPreloadSprite(this.preloadBar);

		//Load all our assets. Progress bar will update as we load these.
		this.load.image('player_ship', 'app/sprite/ship.png');
		this.load.image('ship_flare', 'app/sprite/ship_thrust.png');
		this.load.image('shield', 'app/sprite/shield_bubble.png');
		//this.load.image('bullet', 'app/sprite/shmup-bullet.png');
		this.load.atlas('asteroids', 'app/sprite/asteroids.png', 'app/sprite/asteroids.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
		this.load.spritesheet('explosion', 'app/sprite/explosion.png', 96, 96, 12);
	},

	create: function () {

		//	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
		//this.preloadBar.cropEnabled = false;

	},

	update: function () {

		//	You don't actually need to do this, but I find it gives a much smoother game experience.
		//	Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
		//	You can jump right into the menu if you want and still play the music, but you'll have a few
		//	seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
		//	it's best to wait for it to decode here first, then carry on.
		
		//	If you don't have any music in your game then put the game.state.start line into the create function and delete
		//	the update function completely.
		
		//if (this.cache.isSoundDecoded('titleMusic') && this.ready == false)
		//{
			//this.ready = true;
			////TODO: Make this start at main menu when a menu is actually implemented
			//this.state.start('Game');
		//}
		this.state.start('Game');
	}
};
