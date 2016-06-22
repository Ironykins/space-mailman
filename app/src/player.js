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
var player = {
    score: 0,
    lives: 3
};

SpaceMailman.Game.prototype.spawnPlayer = function() {
    player.sprite = this.game.add.sprite(game.world.centerX, game.world.centerY, 'player_ship');
    flare = game.add.sprite(0, 14, 'ship_flare');
    flare.anchor.set(0.5);
    flare.scale.set(0.5);
    flare.angle = 180;

    game.physics.p2.enable(player.sprite,debug);
    player.sprite.body.collideWorldBounds = true;
    player.sprite.body.damping = 0.2;
    player.sprite.body.angularDamping = 0.999;
    player.sprite.addChildAt(flare,0);
    player.sprite.body.setCollisionGroup(playerCollisionGroup);
    player.sprite.body.collides([asteroidCollisionGroup],this.playerHitAsteroid,this);
    game.camera.follow(player.sprite);
}

SpaceMailman.Game.prototype.playerHitAsteroid = function(body,bodyB,shapeA,shapeB,equation) {
    this.explodeAt(player.sprite.body.x,player.sprite.body.y,3);
    player.sprite.body.destroy();
    player.sprite.destroy();

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
    if(player.sprite.body == null)
        return;

    if (cursors.left.isDown)
        player.sprite.body.rotateLeft(100);
    else if (cursors.right.isDown)
        player.sprite.body.rotateRight(100);

    if (cursors.up.isDown) {
        player.sprite.body.thrust(150);
        player.sprite.getChildAt(0).visible = true;
    }
    else
        player.sprite.getChildAt(0).visible = false;
}
