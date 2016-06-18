var game;
var cursors, firebutton;
var player;
var bg, bgnear;
var asteroidCount;
var maxAsteroids = 20;
var asteroids = [];
var debug = false;
var flare;

function preload () {
    game.load.image('player_ship', 'app/sprite/ship.png');
    game.load.image('ship_flare', 'app/sprite/ship_thrust.png');
    game.load.atlas('asteroids', 'app/sprite/asteroids.png', 'app/sprite/asteroids.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    game.load.image('bullet', 'app/sprite/shmup-bullet.png');
}

function create () {
    game.world.setBounds(0, 0, 1920, 1920);
    cursors = game.input.keyboard.createCursorKeys();
	fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

    //Create Background Stars
    var stars = game.add.bitmapData(512, 512, null, true);
    for(i = 0; i<30;i++) {
        var x = Math.floor((Math.random() * 512));
        var y = Math.floor((Math.random() * 512));
        stars.rect(x, y, 8, 8, 'rgba(255,255,255,1)');
    }
    bg = game.add.tileSprite(0, 0, game.width, game.height, stars);
    bg.fixedToCamera = true;
    bg.tileScale.set(0.5);
    bg.tint = 0x555555;

    bgnear = game.add.tileSprite(0, 0, game.width, game.height, stars);
    bgnear.fixedToCamera = true;
    bgnear.tint = 0x888888;

    //  Enable p2 physics
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.defaultRestitution = 0.8;

    //Create Player
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
    player.body.angle = 90;

    weapon = game.add.weapon(30, 'bullet');
    weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
    weapon.bulletLifespan = 2000;
    weapon.bulletSpeed = 600;
    weapon.fireRate = 400;
	weapon.trackSprite(player, 0, 0, false);

    game.camera.follow(player);

    for (i=0;i<30;i++) {
        var x = Math.floor(Math.random() * game.world.width);
        var y = Math.floor(Math.random() * game.world.height);
        ast = game.add.sprite(x, y, 'asteroids', 'reg_lg');
        game.physics.p2.enable(ast,debug);
        ast.body.collideWorldBounds = true;
        ast.body.setCircle(48,0,0,0);
        ast.body.applyImpulse([(Math.random() * 15)-7.5,(Math.random() * 15)-7.5],0,0)
    }
}

function update () {
    // Hacky fix for shooting sideways.
	weapon.fireAngle = player.body.angle - 90;

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

    if (fireButton.isDown)
        weapon.fire();

    //Parallax Scrolling
    bg.tilePosition.set(this.game.camera.x * -0.5, this.game.camera.y * -0.5);
    bgnear.tilePosition.set(this.game.camera.x * -1, this.game.camera.y * -1);
}

function render() {
    game.debug.cameraInfo(game.camera, 32, 32);
    game.debug.spriteCoords(player, 32, 500);
}

//When the window loads, create the game object.
window.onload = function() {
    game = new Phaser.Game(800, 600, Phaser.AUTO, 'game_window', { preload: preload, create: create, update: update, render:render});
};
