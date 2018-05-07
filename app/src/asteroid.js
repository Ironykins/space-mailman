/*
 * asteroid.js
 * Copyright (C) 2016 konrad <konrad@serenity>
 *
 * Distributed under terms of the MIT license.
 *
 * Control logic for asteroids.
 * -> Spawning 
 * -> Removing
 * -> Physics
 * -> Breakdown
 */

/*
 * Creates an asteroid at a given x-y coordinate.
 * Creates an asteroid of the given scale.
 * Scale is 0-3. 0 for a non-colliding particle that dies.
 * 1-3 for the different sizes of asteroids.
 */
SpaceMailman.Game.prototype.spawnAsteroid = function(x,y,scale) {
    var astSprite, radius = 0;
    switch(scale) {
        case 0:
            astSprite = 'reg_particle';
            break;
        case 1:
            astSprite = 'reg_small';
            radius = 16;
            break;
        case 2:
            astSprite = 'reg_med';
            radius = 32;
            break;
        default:
            astSprite = 'reg_lg';
            radius = 48;
            scale = 3
    }

    ast = asteroids.create(x, y, 'asteroids', astSprite);
    ast.body.collideWorldBounds = true;
    ast.body.setCircle(radius/2);
    ast.body.drag.set(0.01);
    ast.body.bounce.set(0.5);
    ast.scale.set(2);
    ast.asteroidSize = scale;
    ast.smoothed = false;
    return ast;
}

// Destroys an asteroid. Breaks it down.
SpaceMailman.Game.prototype.destroyAsteroid = function(asteroid, body2) {
    var newSize = asteroid.asteroidSize - 1;
    var position = new Phaser.Point(asteroid.x, asteroid.y);
    var baseVel = asteroid.body.velocity;

    //Destroy the asteroid.
    this.explodeAt(asteroid.x,asteroid.y);
    asteroid.destroy();

    //If we're not at the smallest size, spawn some smaller ones.
    if(newSize < 1)
        return;

    // Create the asteroids.
    // var shotVector = new Phaser.Point(position.x - body2.position.x, position.y - body2.position.y).normalize();
    var shotVector = body2.body.newVelocity.normalize();
    var pos1 = Phaser.Point.add(asteroid.position, Phaser.Point.multiply(Phaser.Point.rotate(shotVector,0,0,Math.PI/8),new Phaser.Point(15,15)));
    var pos2 = Phaser.Point.add(asteroid.position, Phaser.Point.multiply(Phaser.Point.rotate(shotVector,0,0,-Math.PI/8),new Phaser.Point(15,15)));

    var ast1 = this.spawnAsteroid(pos1.x, pos1.y, newSize);
    var ast2 = this.spawnAsteroid(pos2.x, pos2.y, newSize);

    // Calculate new velocities.
    var vel1 = new Phaser.Point(ast1.body.position.x - body2.position.x, ast1.body.position.y - body2.position.y).normalize();
    var vel2 = new Phaser.Point(ast2.body.position.x - body2.position.x, ast2.body.position.y - body2.position.y).normalize();

    var vec1 = Phaser.Point.rotate(shotVector,0,0,Math.PI/8)
    var vec2 = Phaser.Point.rotate(shotVector,0,0,-Math.PI/8)

    ast1.body.velocity = new Phaser.Point(baseVel.x,baseVel.y);
    ast1.body.velocity.add(100 * vec1.x, 100 * vec1.y);

    ast2.body.velocity = new Phaser.Point(baseVel.x,baseVel.y);
    ast2.body.velocity.add(100 * vec2.x, 100 * vec2.y);

    player.score += 1;
    this.updateHUD();
}
