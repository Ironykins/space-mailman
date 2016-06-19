/*
 * game.js
 * Copyright (C) 2016 konrad <konrad@serenity>
 *
 * Distributed under terms of the MIT license.
 */
var cursors, firebutton;
var player;
var bg, bgnear;
var asteroidCount;
var maxAsteroids = 20;
var asteroids;
var debug = false;
var flare;
var playerCollisionGroup, asteroidCollisionGroup;

SpaceMailman.Game = function (game) {
    this.game;		//	a reference to the currently running game
    this.add;		//	used to add sprites, text, groups, etc
    this.camera;	//	a reference to the game camera
    this.cache;		//	the game cache
    this.input;		//	the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load;		//	for preloading assets
    this.math;		//	lots of useful common math operations
    this.sound;		//	the sound manager - add a sound, play one, set-up markers, etc
    this.stage;		//	the game stage
    this.time;		//	the clock
    this.tweens;    //  the tween manager
    this.state;	    //	the state manager
    this.world;		//	the game world
    this.particles;	//	the particle manager
    this.physics;	//	the physics manager
    this.rnd;		//	the repeatable random number generator
};

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

    // Create the player.
    spawnPlayer: function() {
		player = this.game.add.sprite(game.world.centerX, game.world.centerY, 'player_ship');
		flare = game.add.sprite(0, 14, 'ship_flare');
		flare.anchor = new Phaser.Point(0.5,0.5);
		flare.scale = new Phaser.Point(0.5,0.5);
		flare.angle = 180;
		game.physics.p2.enable(player,debug);
		player.body.collideWorldBounds = true;
		player.body.damping = 0.2;
		player.body.angularDamping = 0.999;
		player.addChild(flare);
		player.body.setCollisionGroup(playerCollisionGroup);
		player.body.collides([asteroidCollisionGroup],this.playerHitAsteroid,this);
		game.camera.follow(player);
	},

    playerHitAsteroid: function(body,bodyB,shapeA,shapeB,equation) {
		this.explodeAt(player.body.x,player.body.y,3);
		player.destroy();
		this.spawnPlayer();
    },

    create: function () {
        this.explodeAt(960,960);
		this.world.setBounds(0, 0, 1920, 1920);
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
		bg.tileScale.set(0.5);
		bg.tint = 0x555555;

		bgnear = this.add.tileSprite(0, 0, this.world.width, this.world.height, stars);
		bgnear.fixedToCamera = true;
		bgnear.tint = 0x888888;

		//  Enable p2 physics
		this.physics.startSystem(Phaser.Physics.P2JS);
		this.physics.p2.defaultRestitution = 0.8;
		this.physics.p2.setImpactEvents(true);
		this.physics.p2.restitution = 0.8;

		playerCollisionGroup = this.physics.p2.createCollisionGroup();
		asteroidCollisionGroup = this.physics.p2.createCollisionGroup();
		this.physics.p2.updateBoundsCollisionGroup();

		//Create Player
		this.spawnPlayer();

		asteroids = this.add.group();
		for (i=0;i<30;i++) {
			var x = Math.floor(Math.random() * this.world.width);
			var y = Math.floor(Math.random() * this.world.height);
			ast = asteroids.create(x, y, 'asteroids', 'reg_lg');
			this.physics.p2.enable(ast,debug);
			ast.body.collideWorldBounds = true;
			ast.body.setCircle(48,0,0,0);
			ast.scale.set(2);
			ast.smoothed = false;
			ast.body.applyImpulse([(Math.random() * 15)-7.5,(Math.random() * 15)-7.5],0,0)
			ast.body.setCollisionGroup(asteroidCollisionGroup);

			//The first parameter is either an array or a single collision group.
			ast.body.collides([asteroidCollisionGroup, playerCollisionGroup]);
		}

    },

    update: function () {
		if (cursors.left.isDown)
			player.body.rotateLeft(100);
		else if (cursors.right.isDown)
			player.body.rotateRight(100);

		if (cursors.up.isDown) {
			player.body.thrust(150);
			flare.visible = true;
		}
		else
			flare.visible = false;

		//Parallax Scrolling
		bg.tilePosition.set(this.camera.x * -0.5, this.camera.y * -0.5);
		bgnear.tilePosition.set(this.camera.x * -1, this.camera.y * -1);
    },

	render: function() {
		this.game.debug.cameraInfo(game.camera, 32, 32);
		this.game.debug.spriteCoords(player, 32, 500);
	}
};
