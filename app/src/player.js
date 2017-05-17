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
    if(player.sprite) player.sprite.destroy();

    player.sprite = this.game.add.sprite(game.world.centerX, game.world.centerY, 'player_ship');
    player.sprite.anchor.set(0.5);
    flare = game.add.sprite(0, 14, 'ship_flare');
    flare.anchor.set(0.5);
    flare.scale.set(0.5);
    flare.angle = 180;

    game.physics.enable(player.sprite, Phaser.Physics.ARCADE, debug);
    player.sprite.body.setCircle(12,4,4);
    player.sprite.body.collideWorldBounds = true;
    player.sprite.body.drag.set(30);
    player.sprite.body.maxVelocity.set(200);
    
    player.sprite.addChildAt(flare,0);
    game.camera.follow(player.sprite);
}

SpaceMailman.Game.prototype.playerHitAsteroid = function() {
    if(player.dead) return;
    this.explodeAt(player.sprite.body.x,player.sprite.body.y,3);
    player.dead = true;
    player.sprite.alpha = 0;
    player.sprite.body.enable = false;
    
    if(player.lives > 0) {
        player.lives -= 1;
        this.updateHUD();
        var timer = game.time.create(true);
        timer.add(2000, this.spawnPlayer, this);
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
        game.physics.arcade.accelerationFromRotation(player.sprite.rotation+Math.PI/-2, 200, player.sprite.body.acceleration);
        player.sprite.getChildAt(0).visible = true;
    }
    else {
        player.sprite.getChildAt(0).visible = false;
        player.sprite.body.acceleration.set(0);
    }
}
