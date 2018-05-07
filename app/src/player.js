/*
 * player.js
 * Copyright (C) 2016 konrad <konrad@serenity>
 *
 * Distributed under terms of the MIT license.
 *
 * Logic for the game's player objects.
 *
 * Player sprite has a given scheme of children.
 * 0 = Flame Trail Effect
 */

SpaceMailman.Game.prototype.spawnPlayer = function() {
    player.dead = false;
    player.sprite = this.game.add.sprite(game.world.centerX, game.world.centerY, 'player_ship');
    player.sprite.anchor.set(0.5);
    player.sprite.angle = -90;
    flare = game.add.sprite(-14, 0, 'ship_flare');
    flare.anchor.set(0.5);
    flare.scale.set(0.5);
    flare.angle = 270;

    game.physics.enable(player.sprite, Phaser.Physics.ARCADE, debug);
    player.sprite.body.setCircle(12,4,4);
    player.sprite.body.collideWorldBounds = true;
    player.sprite.body.drag.set(30);
    player.sprite.body.maxVelocity.set(200);
    player.sprite.addChildAt(flare,0);

    player.weapon = this.game.add.weapon(30, 'bullet');
    player.weapon.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS;
    player.weapon.bulletSpeed = 600;
    player.weapon.fireRate = 100;
    player.weapon.trackSprite(player.sprite, 0, 0, true);
    player.weapon.bulletAngleVariance = 5;

    game.camera.follow(player.sprite);
}

function respawn() {
    player.sprite.x = 2048
    player.sprite.y = 2048
    player.sprite.alpha = 1
    player.dead = false
    player.sprite.body.enable = true;
}

SpaceMailman.Game.prototype.playerHitAsteroid = function() {
    if(player.dead) return;
    this.explodeAt(player.sprite.body.x, player.sprite.body.y, 3);
    player.dead = true;
    player.sprite.alpha = 0;
    player.sprite.body.enable = false;
    
    if(player.lives > 0) {
        player.lives -= 1;
        this.updateHUD();
        var timer = game.time.create(true);
        timer.add(2000, respawn, this);
        timer.start();
    }
    else {
        this.gameOverScreen();
    }
}

SpaceMailman.Game.prototype.controlPlayer = function() {
    if(player.sprite.body == null || player.dead)
        return;

    if (cursors.left.isDown)
        player.sprite.body.angularVelocity = -300;
    else if (cursors.right.isDown)
        player.sprite.body.angularVelocity = 300;
    else
        player.sprite.body.angularVelocity = 0;

    if (cursors.up.isDown) {
        game.physics.arcade.accelerationFromRotation(player.sprite.rotation, 200, player.sprite.body.acceleration);
        player.sprite.getChildAt(0).visible = true;
    }
    else {
        player.sprite.getChildAt(0).visible = false;
        player.sprite.body.acceleration.set(0);
    }

    if(fireButton.isDown) player.weapon.fire();
}
