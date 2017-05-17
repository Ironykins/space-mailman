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
var debug = true;
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

		//  Enable p2 physics
		this.physics.startSystem(Phaser.Physics.P2JS);
		this.physics.p2.defaultRestitution = 0.8;
		this.physics.p2.setImpactEvents(true);
		this.physics.p2.restitution = 0.8;

		playerCollisionGroup = this.physics.p2.createCollisionGroup();
		asteroidCollisionGroup = this.physics.p2.createCollisionGroup();
		shieldCollisionGroup = this.physics.p2.createCollisionGroup();
		
		// First base + shield
		base1 = game.add.sprite(game.world.centerX, game.world.centerY, 'station1')
		base1.anchor.set(0.5);
		base1.scale.set(0.5);
        shield = game.add.sprite(game.world.centerX,game.world.centerY,'shield');
		shield.anchor.set(0.5);
        shield.smoothed = false;
        this.physics.p2.enable(shield,debug);
		shield.body.static = true
        shield.body.setCircle(256,0,0,0);
        shield.body.setCollisionGroup(shieldCollisionGroup);
        shield.body.collides([asteroidCollisionGroup],this.shieldHitAsteroid,this);

		// Second base + shield
		base2 = game.add.sprite(game.world.centerX-512, game.world.centerY-512, 'station2')
		base2.anchor.set(0.5);
        shield2 = game.add.sprite(game.world.centerX-512,game.world.centerY-512,'shield');
		shield2.anchor.set(0.5);
		shield2.scale.set(0.5);
		shield2.smoothed = false;

        this.physics.p2.enable(shield2,debug);
		shield2.body.static = true;
        shield2.body.setCircle(128,0,0,0);
        shield2.body.setCollisionGroup(shieldCollisionGroup);
        shield2.body.collides([asteroidCollisionGroup],this.shieldHitAsteroid,this);

		this.physics.p2.updateBoundsCollisionGroup();

		//Create Player
		this.spawnPlayer();

		asteroids = this.add.group();
		for (i=0;i<50;i++) {
			var x = Math.floor(Math.random() * this.world.width);
			var y = Math.floor(Math.random() * this.world.height);
            this.spawnAsteroid(x,y)
		}

        this.createHUD();
    },

    shieldHitAsteroid: function(bodyA,bodyB,shapeA,shapeB) {
		var angle = new Phaser.Point(bodyA.x-bodyB.x,bodyA.y-bodyB.y).normalize();
		bodyB.applyImpulse([angle.x * 10, angle.y * 10])
    },

    update: function () {
        this.controlPlayer();

		//Parallax Scrolling
		bgfar.tilePosition.set(this.camera.x * -0.3, this.camera.y * -0.3);
		bg.tilePosition.set(this.camera.x * -0.6, this.camera.y * -0.6);
		bgnear.tilePosition.set(this.camera.x * -1, this.camera.y * -1);
    },

	render: function() {
        if(debug) {
            this.game.debug.cameraInfo(game.camera, 32, 32);
            this.game.debug.spriteCoords(player.sprite, 32, 500);
        }
	}
};
