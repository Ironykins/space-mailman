/*
 * weapon.js
 * Copyright (C) 2016 konrad <konrad@serenity>
 *
 * Distributed under terms of the MIT license.
 *
 * Mad gunz
 * The Phaser weapon implementation only works with arcade physics and is kinda limited.
 * So we write our own for ourselves. The Space Mailman Weapon!
 */

Phaser.Plugin.SMWeapon = function(game, parent) {
    Phaser.Plugin.call(this, game, parent);
    this.bullets = null;
    this.shots = 0;
    this.fireLimit = 0;
    this.fireRate = 100; // In milliseconds.
    this.fireFrom = new Phaser.Rectangle(0, 0, 1, 1); //The rectangle that we fire bullets from.
    this.fireAngle = Phaser.ANGLE_UP;
    this.bulletInheritSpriteSpeed = false;
    this.bulletAngleVariance = 0; //In degrees.
    this.bulletSpeed = 200;
    this.bulletKillDistance = 0;
    this.bulletKey = '';
    this._bulletClass = Phaser.Bullet;
    this._bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    this._data = {
        customBody: false,
        width: 0,
        height: 0,
        offsetX: 0,
        offsetY: 0
    };
    this.bounds = new Phaser.Rectangle();
    this.bulletBounds = game.world.bounds;
    this.onFire = new Phaser.Signal();
    this.onKill = new Phaser.Signal();
    this.onFireLimit = new Phaser.Signal();
    this.trackedSprite = null;
    this.trackedPointer = null;
    this.trackRotation = false;
    this.trackOffset = new Phaser.Point();
    this._nextFire = 0;
    this._rotatedPoint = new Phaser.Point();
}

// Base it on the official phaser weapon.
// TODO: Will this fuck things up? If they update it and stuff.
Phaser.Plugin.SMWeapon.prototype = Object.create(Phaser.Plugin.prototype);
Phaser.Plugin.SMWeapon.constructor = Phaser.Plugin.SMWeapon;
