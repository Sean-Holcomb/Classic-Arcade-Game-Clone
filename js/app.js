var blockHeight = 83;
var blockwidth = 101;
var yCenter = 30;
var speedMulti = 100;
var sprites = ['images/char-boy.png',
    'images/char-cat-girl.png',
    'images/char-horn-girl.png',
    'images/char-pink-girl.png',
    'images/char-princess-girl.png'
];


/**
 * Enemy class constructor
 * Sets Enemy to random lane, one of three speeds and staggers them off the left of the screen.
 */
var Enemy = function () {
    this.sprite = 'images/enemy-bug.png';
    this.x = -1 * Math.floor((Math.random() * 6) + 1) * blockwidth;
    this.y = (Math.floor((Math.random() * 3) + 1) * blockHeight) - yCenter;
    this.speed = Math.floor((Math.random() * 3) + 1) * speedMulti;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
    //move the enemy
    this.x += this.speed * dt;
    //reset enemy when it moves off screen, with new row and speed
    if (this.x >= 606) {
        this.x = -101;
        this.y = (Math.floor((Math.random() * 3) + 1) * blockHeight) - yCenter;
        this.speed = Math.floor((Math.random() * 3) + 1) * speedMulti;
    }
    //logic for collsions
    if (this.x >= player.x - 50 && this.x <= player.x + 50 && this.y == player.y) {
        player.reset();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function () {
    this.sprite = 'images/char-boy.png';
    this.y = 5 * blockHeight - yCenter;
    this.x = 2 * blockwidth;
    this.playing = false;
};

// Draw player on screen
Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Required method for engine.js
Player.prototype.update = function () {

};

//move player back to starting position
Player.prototype.reset = function () {
    this.y = 5 * blockHeight - yCenter;
    this.x = 2 * blockwidth;
};

/**
 * Method to move player around map, each arrow checks if a move is available.
 * A move up at the top of the screen brings player back to start.
 */
Player.prototype.handleInput = function (allowedKeys) {
    switch (allowedKeys) {
    case 'left':
        if (this.x >= blockwidth) {
            this.x -= blockwidth;
        }
        break;
    case 'right':
        if (this.x < 4 * blockwidth) {
            this.x += blockwidth;
        }
        break;
    case 'up':
        if (this.y > blockHeight) {
            this.y -= blockHeight;
        } else {
            this.reset();
        }
        break;
    case 'down':
        if (this.y <= 4 * blockHeight) {
            this.y += blockHeight;
        }
        break;
    }
};

/**
 * Player selector object
 */
var PlayerSelector = function () {
    this.sprite = 'images/Selector.png';
    this.x = 0;
    this.y = blockHeight * 5 - 40;
    this.position = 0;
};

//render selector
PlayerSelector.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
//method to allow selector to move
PlayerSelector.prototype.handleInput = function (allowedKeys) {
    switch (allowedKeys) {
    case 'left':
        if (this.x >= blockwidth) {
            this.x -= blockwidth;
            this.position -= 1;
        }
        break;
    case 'right':
        if (this.x < 4 * blockwidth) {
            this.x += blockwidth;
            this.position += 1;
        }
        break;
    case 'up':
        if (this.y > blockHeight) {
            player.playing = true;
            player.sprite = sprites[this.position];
        }
        break;
    }
};

/**
 * CharacterSprite object
 * Used to display character sprites
 */
var CharacterSprite = function (sprit, xCord) {
    this.sprite = sprit;
    this.y = 5 * blockHeight - yCenter;
    this.x = xCord;
};

//render character sprite
CharacterSprite.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// instantiate objects.
var allEnemies = [];
var allSprites = [];
var selector = new PlayerSelector();
var player = new Player();
for (var i = 0; i < 5; i++) {
    allEnemies[i] = new Enemy();
    allSprites[i] = new CharacterSprite(sprites[i], i * blockwidth);
}


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    //only move player if user is past character select screen.
    if (player.playing) {
        player.handleInput(allowedKeys[e.keyCode]);
    } else {
        selector.handleInput(allowedKeys[e.keyCode]);
    }
});
