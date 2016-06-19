/*
 * player.js
 * Copyright (C) 2016 konrad <konrad@serenity>
 *
 * Distributed under terms of the MIT license.
 *
 * Logic for the game's player objects.
 */

SpaceMailman.Game.prototype.spawnPlayer = function() {
    player = this.game.add.sprite(game.world.centerX, game.world.centerY, 'player_ship');
    flare = game.add.sprite(0, 14, 'ship_flare');
    flare.anchor.set(0.5);
    flare.scale.set(0.5);
    flare.angle = 180;
    game.physics.p2.enable(player,debug);
    player.body.collideWorldBounds = true;
    player.body.damping = 0.2;
    player.body.angularDamping = 0.999;
    player.addChildAt(flare,0);
    player.body.setCollisionGroup(playerCollisionGroup);
    player.body.collides([asteroidCollisionGroup],this.playerHitAsteroid,this);
    game.camera.follow(player);
}

SpaceMailman.Game.prototype.playerHitAsteroid = function(body,bodyB,shapeA,shapeB,equation) {
    this.explodeAt(player.body.x,player.body.y,3);
    player.destroy();
    //this.spawnPlayer();
    var timer = game.time.create(true);
    timer.add(2000, this.spawnPlayer, this);
    timer.start();
}

SpaceMailman.Game.prototype.controlPlayer = function() {
    if(player.body == null)
        return;

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
}
