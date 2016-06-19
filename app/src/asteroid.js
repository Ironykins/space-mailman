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
    this.physics.p2.enable(ast,debug);
    ast.body.collideWorldBounds = true;
    ast.body.setCircle(radius,0,0,0);
    ast.body.damping = 0.01;
    ast.scale.set(2);
    ast.asteroidSize = scale;
    ast.smoothed = false;
    ast.body.applyImpulse([(Math.random() * 15)-7.5,(Math.random() * 15)-7.5],0,0)
    ast.body.setCollisionGroup(asteroidCollisionGroup);

    //The first parameter is either an array or a single collision group.
    ast.body.collides([shieldCollisionGroup, asteroidCollisionGroup, playerCollisionGroup]);
}

// Destroys an asteroid. Breaks it down.
SpaceMailman.Game.prototype.destroyAsteroid = function(asteroid) {
    var newX = asteroid.x;
    var newY = asteroid.y;
    var newSize = asteroid.sprite.asteroidSize - 1;

    //Destroy the asteroid.
    this.explodeAt(asteroid.x,asteroid.y);
    asteroid.sprite.destroy();
    asteroid.destroy();

    //If we're not at the smallest size, spawn some smaller ones.
    if(newSize < 1)
        return;

    this.spawnAsteroid(newX+64,newY,newSize);
    this.spawnAsteroid(newX-64,newY,newSize);
}
