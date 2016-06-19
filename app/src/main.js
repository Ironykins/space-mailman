function spawnPlayer() {
    player = game.add.sprite(game.world.centerX, game.world.centerY, 'player_ship');
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
    player.body.collides([asteroidCollisionGroup],playerHitAsteroid,true);
    game.camera.follow(player);
}

//Creates an explosion at x and y corrds.
function explodeAt(x,y,scale) {
    boom = game.add.sprite(x, y, 'explosion', 0);
    if(typeof scale !== "undefined") {
        boom.scale.set(scale);
        boom.smoothed = false;
    }
    boom.anchor = new Phaser.Point(0.5,0.5);
    anim = boom.animations.add('explode');
    anim.killOnComplete = true;
    anim.play(10);
}

function playerHitAsteroid(body, bodyB, shapeA, shapeB, equation) {
    explodeAt(player.body.x,player.body.y,3);
    player.destroy();
    spawnPlayer();
}
