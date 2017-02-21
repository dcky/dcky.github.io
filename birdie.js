var game = new Phaser.Game(800, 300, Phaser.AUTO, 'birdie', { preload: preload, create: create, update: update, render: render });
var Game = {}
	
Game.win = function(game) {

}

Game.win.prototype = {
	update: function() { 
		console.log("hi");
			this.text = game.add.text(200, 200, 'You win', { font: "32px Arial", fill: "#ffffff", align: "center" });
    this.text.anchor.setTo(0.5, 0.5);
	}

}	



game.state.add('win', Game.win);


function preload() {

	game.load.crossOrigin = "Anonymous";
	game.load.image('coin','assets/dcoin.png');
	game.load.image('ground', 'assets/ground.png');
	game.load.image('background','assets/background.png');
	game.load.image('anvil','assets/anvil.png');
	game.load.spritesheet('duck_animation','assets/duck_animation.png', 47, 39);
}

var emitter;
var player;
var ground;
var cursors;
var jumpButton;
var facing = 'idle';
var kuai;
var background;
var maxCoins;
var coinGroup;
var coinsOnScreen;
var text;
var lost = false;
var objs = [];
var coins = [];

function create() {
	this.coinsOnScreen = 0;
	this.maxCoins = 3;
	this.kuai = 0;
	this.lost = false;


    game.physics.startSystem(Phaser.Physics.P2JS);

	background = game.add.tileSprite(0, 0, 800, 300, 'background');
	
    game.physics.p2.gravity.y = 500;
	
	this.player = game.add.sprite(100, 100, 'duck_animation');
	this.player.smoothed = false;
	this.player.name = 'player';
	this.player.animations.add('right', [1, 0], 5, true);
	this.player.animations.add('left', [2, 3], 5, true);
	
    game.physics.p2.enable(this.player);
	console.log(this.player.name);
    
    this.player.body.fixedRotation = true;
	
	this.ground = game.add.sprite(400, 282, 'ground');
	this.ground.name = 'ground';
	game.physics.p2.enable(this.ground);
	
	game.time.events.loop(750, spawnCoin,  this);
    game.time.events.add(500, startObj, this);
	
	this.text = game.add.text(72, 25, 'Score: 0', { font: "32px Arial", fill: "#ffffff", align: "center" });
    this.text.anchor.setTo(0.5, 0.5);
	
	
    this.cursors = game.input.keyboard.createCursorKeys();
    this.jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	
	game.physics.p2.setPostBroadphaseCallback(checkOverlap, this);

}

function checkOverlap(body1, body2) {
	if (this.lost == false) {
    if ((body1.sprite.name == 'player' && body2.sprite.name == 'coin') || (body2.sprite.name == 'player' && body1.sprite.name == 'coin')){
        
		if (body1.sprite.name == 'coin') {
			body1.sprite.kill();
			this.coinsOnScreen -= 1;
			this.kuai += 1;
			this.text.setText('Score: ' + this.kuai);
		} else if (body2.sprite.name == 'coin') {
			body2.sprite.kill();
			this.coinsOnScreen -= 1;
			this.kuai += 1;
			this.text.setText('Score: ' + this.kuai);
		}
		
        return false;
    }
	
	if ((body1.sprite.name == 'player' && body2.sprite.name == 'bad') || (body2.sprite.name == 'player' && body1.sprite.name == 'bad')){
        
		this.lost = true;
		
		return false;

    }
	
    if ((body1.sprite.name == 'ground' && body2.sprite.name == 'coin') || (body2.sprite.name == 'ground' && body1.sprite.name == 'coin')){
        
		if (body1.sprite.name == 'coin') {
			body1.sprite.kill();
			coins.splice(0, 1);
			this.coinsOnScreen -= 1;
		} else if (body2.sprite.name == 'coin') {
			body2.sprite.kill();
			coins.splice(0, 1);
			this.coinsOnScreen -= 1;			
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
	}
}

function update() {
	this.player.body.velocity.x = 0;
	if (this.lost == false) {
    if (this.cursors.left.isDown && this.cursors.right.isUp) {
        this.player.body.velocity.x = -300;
		
		 if (this.facing != 'left')
        {
            this.player.animations.play('left');
            this.facing = 'left';
        }

    }
    else if (this.cursors.right.isDown && this.cursors.left.isUp)
    {
        this.player.body.velocity.x = 300;
		if (this.facing != 'right')
        {
            this.player.animations.play('right');
            this.facing = 'right';
        }
    }
    else
    {
        this.player.body.velocity.x = 0;
    }
	
	if (this.jumpButton.isDown) {
		this.player.body.velocity.y = -200;
		if (this.facing === 'right') {
            this.player.animations.play('right');
        } else {
			this.player.animations.play('left');
		}
		
		
		//this.facing = 'idle';
	} else if (this.player.body.y > 243) {
		this.player.animations.stop();
		if (this.facing == 'left') {
                this.player.frame = 3;
            } else {
                this.player.frame = 0;
            }		
	}
	
	} else {
		this.game.physics.p2.applyGravity = false
		this.player.body.velocity.x = 0;
		this.player.body.velocity.y = 0;
	    game.add.tween(this.player).to( { alpha: 0 }, 1000, "Quart.easeOut", true);

			this.text = game.add.text(400, 150, 'You lost!', { font: "32px Arial", fill: "#ffffff", align: "center" });
			this.text.alpha = 0;
			game.add.tween(this.text).to( { alpha: 1 }, 1000, "Quart.easeIn", true);
		this.text.anchor.setTo(0.5, 0.5);
	
		for (i = 0; i < objs.length; i++)  {
			o = objs[i];
			console.log(o);
			
					o.body.velocity.x = 0;
				o.body.velocity.y = 0;
				game.add.tween(o).to( { alpha: 0 }, 1000, "Quart.easeOut", true);
		}
		

		
		for (i = 0; i < coins.length; i++) {
			c = coins[i];
								c.body.velocity.x = 0;
				c.body.velocity.y = 0;
				game.add.tween(c).to( { alpha: 0 }, 1000, "Quart.easeOut", true);
		}
		
		coins = []
				objs = []
	}

	
	
	    if (this.coinsOnScreen < this.maxCoins) {
        // Set the launch point to a random location below the bottom edge
        // of the stage


	
    }
	
	
}


function spawnCoin() {
	if (this.lost == false) {
			        coin = game.add.sprite(this.game.rnd.integerInRange(20, this.game.width-20), 16, 'coin');
				
				coin.name = "coin";

		this.coinsOnScreen += 1;
        
		game.physics.p2.enable(coin);
		coin.body.setCircle(16);
		coins.push(coin);
	}
}

function spawnObj() {
	if (this.lost == false) {
			        obj = game.add.sprite(this.game.rnd.integerInRange(20, this.game.width-20), 7, 'anvil');
				
				obj.name = "bad";
        
		game.physics.p2.enable(obj);
		obj.body.setRectangle(32,28);
		
		objs.push(obj);
		//console.log(objs);
	}
}

function startObj() {
	game.time.events.loop(750, spawnObj,  this);
}	
	
function render() {

}
