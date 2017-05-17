/*
 * game.js
 * Copyright (C) 2016 konrad <konrad@serenity>
 *
 * Distributed under terms of the MIT license.
 */
var cursors, firebutton;
var bg, bgnear;
var asteroidCount;
var maxAsteroids = 20;
var asteroids;
var shields;
var debug = false;
var playerCollisionGroup, asteroidCollisionGroup;

SpaceMailman.Game = function (game) {};

SpaceMailman.Game.prototype = {
    // Create an explosion at an x-y coordinate
    explodeAt: function(x,y,scale) {
        boom = this.game.add.sprite(x, y, 'explosion', 0);
        if(typeof scale !== "undefined") {
            boom.scale.set(scale);
            boom.smoothed = false;
        }
        boom.anchor = new Phaser.Point(0.5,0.5);
        anim = boom.animations.add('explode');
        anim.killOnComplete = true;
        anim.play(10);
    },

    create: function () {
		this.world.setBounds(0, 0, 4096, 4096);
		cursors = this.input.keyboard.createCursorKeys();
		fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

		//Create Background Stars
		var stars = this.add.bitmapData(512, 512, null, true);
		for(i = 0; i<30;i++) {
			var x = Math.floor((Math.random() * 512));
			var y = Math.floor((Math.random() * 512));
			stars.rect(x, y, 8, 8, 'rgba(255,255,255,1)');
		}
		bg = this.add.tileSprite(0, 0, this.world.width, this.world.height, stars);
		bg.fixedToCamera = true;
		bg.tileScale.set(0.6);
		bg.tint = 0x555555;

		bgfar = this.add.tileSprite(0, 0, this.world.width, this.world.height, stars);
		bgfar.fixedToCamera = true;
		bgfar.tileScale.set(0.3);
		bgfar.tint = 0x555555;

		bgnear = this.add.tileSprite(0, 0, this.world.width, this.world.height, stars);
		bgnear.fixedToCamera = true;
		bgnear.tint = 0x888888;

		//  Enable physics
		this.physics.startSystem(Phaser.Physics.ARCADE);
/*
		playerCollisionGroup = this.physics.p2.createCollisionGroup();
		asteroidCollisionGroup = this.physics.p2.createCollisionGroup();
		shieldCollisionGroup = this.physics.p2.createCollisionGroup();
*/		
		shields = this.add.group();
		shields.enableBody = true;
		
		// First base + shield
		base1 = game.add.sprite(game.world.centerX, game.world.centerY, 'station1')
		base1.anchor.set(0.5);
		base1.scale.set(0.5);
		this.createShield(game.world.centerX,game.world.centerY,1)
		this.createShield(game.world.centerX-512,game.world.centerY-512,0.5)

        // shield = shields.create(game.world.centerX,game.world.centerY,'shield');
		// shield.anchor.set(0.5);
        // shield.smoothed = false;
		// // this.physics.enable(shield, Phaser.Physics.ARCADE, debug);
		// shield.body.immovable = true
		// shield.body.allowRotation = false;
        // shield.body.setCircle(256,0,0,0);

		// Second base + shield
		base2 = game.add.sprite(game.world.centerX-512, game.world.centerY-512, 'station2')
		base2.anchor.set(0.5);


		// this.physics.p2.updateBoundsCollisionGroup();

		//Create Player
		this.spawnPlayer();

		asteroids = this.add.group();
		asteroids.enableBody = true;
		for (i=0;i<50;i++) {
            this.spawnAsteroid(game.world.randomX,game.world.randomY)
		}
        this.createHUD();
    },

	createShield: function(x,y,scale) {
		var spriteRad = 256;
		shield = shields.create(x,y,'shield');
		shield.anchor.set(0.5);
		shield.scale.set(scale);
		shield.smoothed = false;
		shield.body.immovable = true
		shield.body.allowRotation = false;
		shield.body.bounce.set(5);
		shield.body.setCircle(scale*spriteRad,((1-scale)*spriteRad),((1-scale)*spriteRad));
	},

    shieldHitAsteroid: function(first,second) {
		var angle = new Phaser.Point(first.body.x-second.body.x,first.body.y-second.body.y).normalize();
		second.body.velocity.subtract(angle.x*500,angle.y*500);
    },

    update: function () {
        this.controlPlayer();

		this.physics.arcade.collide(player.sprite, asteroids, this.playerHitAsteroid, null, this);
		this.physics.arcade.collide(shields, asteroids, this.shieldHitAsteroid, null, this);
		this.physics.arcade.collide(asteroids);

		//Parallax Scrolling
		bgfar.tilePosition.set(this.camera.x * -0.3, this.camera.y * -0.3);
		bg.tilePosition.set(this.camera.x * -0.6, this.camera.y * -0.6);
		bgnear.tilePosition.set(this.camera.x * -1, this.camera.y * -1);
    },

	render: function() {
        if(debug) {
            this.game.debug.cameraInfo(game.camera, 32, 32);
            this.game.debug.spriteCoords(player.sprite, 32, 500);
			this.game.debug.body(player.sprite)

			for (i=0;i<asteroids.children.length;i++)
				this.game.debug.body(asteroids.children[i])
			
			for (i=0;i<shields.children.length;i++)
				this.game.debug.body(shields.children[i])
        }
	}
};
