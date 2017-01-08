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

		//Create Player
		this.spawnPlayer();

        //Create Shield
        shield = game.add.sprite(game.world.centerX,game.world.centerY,'shield');
        this.physics.p2.enable(shield,debug);
		shield.anchor.set(0.5);
		shield.scale.set(8);
        shield.smoothed = false;
        shield.body.setCircle(132,0,0,0);
        shield.body.setCollisionGroup(shieldCollisionGroup);
        shield.body.collides([asteroidCollisionGroup],this.shieldHitAsteroid,this);
		shield.tint = 0x222277;
        shield.body.static = true;
		this.physics.p2.updateBoundsCollisionGroup();
		asteroids = this.add.group();
		for (i=0;i<30;i++) {
			var x = Math.floor(Math.random() * this.world.width);
			var y = Math.floor(Math.random() * this.world.height);
            var ast = this.spawnAsteroid(x,y);
			// Give new asteroids a push.
			ast.body.applyImpulse([(Math.random() * 15)-7.5,(Math.random() * 15)-7.5],0,0)
		}

        this.createHUD();
    },

    shieldHitAsteroid: function(body,bodyB,shapeA,shapeB,equation) {
        this.destroyAsteroid(bodyB);
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
