var game = new Phaser.Game(800, 300, Phaser.AUTO, 'birdie', { preload: preload, create: create, update: update, render: render });

function preload() {

	game.load.crossOrigin = "Anonymous";
	game.load.image('coin','assets/dcoin.png');
	game.load.image('ground', 'assets/ground.png');
	game.load.image('background','assets/background.png');
	game.load.image('anvil','assets/anvil.png');
	game.load.spritesheet('duck_animation','assets/duck_animation.png', 47, 39);
	this.game.load.bitmapFont('Pixel', 'assets/Pixel.png', 'assets/Pixel.fnt');
}

var emitter;
var player;
var ground;
var cursors;
var jumpButton;
var facing;
var kuai;
var background;
var maxCoins;
var coinGroup;
var coinsOnScreen;
var text;
var lost = false;
var objs = [];
var coins = [];
var dObj;
var dCoin;
var completed = false;
var lostText;
var restartText;

function create() {
    game.physics.startSystem(Phaser.Physics.P2JS);

	background = game.add.tileSprite(0, 0, 800, 300, 'background');
	
    game.physics.p2.gravity.y = 500;

	
	player = game.add.sprite(100, 100, 'duck_animation');
	player.smoothed = false;
	player.name = 'player';
	player.animations.add('right', [1, 0], 5, true);
	player.animations.add('left', [2, 3], 5, true);
	player.alpha = 0;
	
    game.physics.p2.enable(player);
    
    player.body.fixedRotation = true;
	
	this.ground = game.add.sprite(400, 282, 'ground');
	this.ground.name = 'ground';
	this.ground.immovable = true;
	game.physics.p2.enable(this.ground);
	
	game.time.events.loop(750, spawnCoin,  this);
    game.time.events.add(500, startObj, this);
	
	text = game.add.bitmapText(72, 25, 'Pixel', 'Score: 0', 16);
	
    text.anchor.setTo(0.5, 0.5);
	
	
    this.cursors = game.input.keyboard.createCursorKeys();
    this.jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.restartButton = game.input.keyboard.addKey(Phaser.Keyboard.R);
	
	game.physics.p2.setPostBroadphaseCallback(checkOverlap, this);
	
	lost = false;
	this.completed = false;
	
	resetEverything();
}

function checkOverlap(body1, body2) {
		
    if ((body1.sprite.name == 'player' && body2.sprite.name == 'coin') || (body2.sprite.name == 'player' && body1.sprite.name == 'coin')){
        
		if (body1.sprite.name == 'coin') {
			body1.sprite.kill();
			coinsOnScreen -= 1;
			kuai += 1;
			text.setText('Score: ' + kuai);
		} else if (body2.sprite.name == 'coin') {
			body2.sprite.kill();
			coinsOnScreen -= 1;
			kuai += 1;
			text.setText('Score: ' + kuai);
		}
		
        return false;
    }
	
	if ((body1.sprite.name == 'player' && body2.sprite.name == 'bad') || (body2.sprite.name == 'player' && body1.sprite.name == 'bad')){
		lost = true;
		this.completed = false
		return false;

    }
	
    if ((body1.sprite.name == 'ground' && body2.sprite.name == 'coin') || (body2.sprite.name == 'ground' && body1.sprite.name == 'coin')){
        
		if (body1.sprite.name == 'coin') {
			body1.sprite.kill();
			coins.splice(0, 1);
			coinsOnScreen -= 1;
		} else if (body2.sprite.name == 'coin') {
			body2.sprite.kill();
			coins.splice(0, 1);
			coinsOnScreen -= 1;			
		}
		
        return false;
    }

    if ((body1.sprite.name == 'ground' && body2.sprite.name == 'bad') || (body2.sprite.name == 'ground' && body1.sprite.name == 'bad')){
        
		if (body1.sprite.name == 'bad') {
			body1.sprite.kill();
			objs.splice(0, 1);
		} else if (body2.sprite.name == 'bad') {
			body2.sprite.kill();	
			objs.splice(0, 1);
		}
		
        return false;
    }	
	
	 if ((body1.sprite.name == 'coin' && body2.sprite.name == 'coin')){
        return false;
    }	
	
    return true;
	//}
}

function update() {
	
	player.body.velocity.x = 0;
	if (lost == false) {
    if (this.cursors.left.isDown && this.cursors.right.isUp) {
        player.body.velocity.x = -300;
		
		 if (facing != 'left')
        {
            player.animations.play('left');
            facing = 'left';
        }

    }
    else if (this.cursors.right.isDown && this.cursors.left.isUp)
    {
        player.body.velocity.x = 300;
		if (facing != 'right')
        {
            player.animations.play('right');
            facing = 'right';
        }
    }
    else
    {
        player.body.velocity.x = 0;
    }
	
	if (this.jumpButton.isDown) {
		player.body.velocity.y = -200;
		if (facing === 'right') {
            player.animations.play('right');
        } else {
			player.animations.play('left');
		}
		
		
	} else if (player.body.y > 243) {
		player.animations.stop();
		if (facing == 'left') {
                player.frame = 3;
            } else {
                player.frame = 0;
            }		
	}
	
	} else {
		if (this.completed == false) {
		this.completed = true;
		this.game.physics.p2.applyGravity = false;
		player.body.velocity.x = 0;
		player.body.velocity.y = 0;
	    game.add.tween(player).to( { alpha: 0 }, 1000, "Quart.easeOut", true);

			lostText = game.add.bitmapText(400, 150, 'Pixel', 'You lost!', 16);
			restartText = game.add.bitmapText(400, 180, 'Pixel', 'Press \'R\' to restart', 8);
						lostText.anchor.setTo(0.5, 0.5);
			restartText.anchor.setTo(0.5, 0.5);
			
			lostText.alpha = 0;
			restartText.alpha = 0;
			game.add.tween(lostText).to( { alpha: 1 }, 1000, "Quart.easeIn", true);
			game.add.tween(restartText).to( { alpha: 1 }, 1000, "Quart.easeIn", true);

		for (i = 0; i < objs.length; i++)  {
				objs[i].body.velocity.y = 0;
				objs[i].body.velocity.x = 0;
				objs[i].name = "lol";
				objs[i].body.data.shapes[0].sensor=true;
				game.add.tween(objs[i]).to( { alpha: 0 }, 1000, "Quart.easeOut", true);
		}
		

		
		for (i = 0; i < coins.length; i++) {
			
				coins[i].body.velocity.y = 0;
				coins[i].body.velocity.x = 0;
				coins[i].name = "lol";
				coins[i].body.data.shapes[0].sensor=true;
		
				game.add.tween(coins[i]).to( { alpha: 0 }, 1000, "Quart.easeOut", true);
				
		}
		
		this.completed = true;
		coins = []
		objs = []
		}
		
		if (this.restartButton.isDown) {
				lost = false;
				game.add.tween(lostText).to( { alpha: 0 }, 1000, "Quart.easeOut", true);
				game.add.tween(restartText).to( { alpha: 0 }, 1000, "Quart.easeOut", true);
				
				
				resetEverything();
		}
	}

	
	
	    if (coinsOnScreen < maxCoins) {
        // Set the launch point to a random location below the bottom edge
        // of the stage


	
    }
	
	
}


function spawnCoin() {
	if (lost == false) {
			        coin = game.add.sprite(this.game.rnd.integerInRange(20, this.game.width-20), 16, 'coin');
				
				coin.name = "coin";

		coinsOnScreen += 1;
        
		game.physics.p2.enable(coin);
		coin.body.setCircle(16);
		coins.push(coin);
	}
}

function spawnObj() {
	if (lost == false) {
			        obj = game.add.sprite(this.game.rnd.integerInRange(20, this.game.width-20), 7, 'anvil');
				
				obj.name = "bad";
        
		game.physics.p2.enable(obj);
		obj.body.setRectangle(32,28);
		
		objs.push(obj);
	}
}

function startObj() {
	game.time.events.loop(750, spawnObj,  this);
}	
	
function resetEverything() {
	player.animations.stop();
	player.frame = 0;
	facing = "right";
	game.add.tween(player).to( { alpha: 1 }, 500, "Quart.easeIn", true);
	text.setText('Score: 0');
	player.body.x = 100;
	player.body.y = 100;
	
	game.physics.p2.applyGravity = true;
		
	coinsOnScreen = 0;
	maxCoins = 3;
	kuai = 0;
	lost = false;
	
}

function render() {}
