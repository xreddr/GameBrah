var myGamePiece
// var otherPiece
var screen
var allButtons = [];

function startGame() {
    screen = new GameScreen(innerWidth, innerHeight, "black");
    myGamePiece = new Rectangle(30, 30, "red", screen.cenx, screen.ceny);
    // enemy = new Square(30, 30, "green", 20, 20)
    // otherPiece = new Circle(40, 40, 20, "blue")
    screen.start();
    document.getElementById("startButton").remove();
}

function buttons() {
    allButtons = [
        upBtn = new Rectangle(50, 50, "blue", 70, (screen.canvas.height - 170)),
        downBtn = new Rectangle(50, 50, "blue", 70, (screen.canvas.height - 70)),
        leftBtn = new Rectangle(50, 50, "blue", 20, (screen.canvas.height - 120)),
        rightBtn = new Rectangle(50, 50, "blue", 120, (screen.canvas.height - 120)),
        aBtn = new Rectangle(50, 50, "blue", (screen.canvas.width - 170), (screen.canvas.height - 70)),
        bBtn = new Rectangle(50, 50, "blue", (screen.canvas.width - 70), (screen.canvas.height - 70))
    ]
}

function updateGameArea() {
    buttons();
    screen.borders(myGamePiece)
    screen.clear();
    myGamePiece.newPos();
    myGamePiece.update(screen);
    for (i = 0; i < allButtons.length; i++) {
        allButtons[i].update(screen)
    }
    screen.touchControler(myGamePiece);
    // enemy.update(screen);
    // enemy.newPos();
    // otherPiece.update(screen);
    // if (enemy.bottom < myGamePiece.top ||
    //     enemy.top > myGamePiece.bottom ||
    //     enemy.right < myGamePiece.left ||
    //     enemy.left > myGamePiece.right) {
    //     const angle = Math.atan2(myGamePiece.y - enemy.y, myGamePiece.x - enemy.x)
    //     // console.log(angle)
    //     enemy.speedX = Math.cos(angle) * 5;
    //     enemy.speedY = Math.sin(angle) * 5;
    //     // console.log(enemy.speedX, enemy.speedY)

    // } else { console.log("Got Ya") }
}


class GameScreen {
    constructor(width, height, bgcolor) {
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");
        this.canvas.width = width;
        this.canvas.height = height;
        this.canvas.style.backgroundColor = bgcolor;
        this.cenx = width / 2;
        this.ceny = height / 2;
    }
    start() {
        // Insert into document
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        // Refresh interval
        this.interval = setInterval(updateGameArea, 20);
        // Listeners
        this.listenTouch(this);
        this.listenMouse(this);
    }
    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    stop() {
        clearInterval(this.interval);
    }

    // Controllers 
    listenTouch(screen) {
        // window.addEventListener('touchstart', function (e) {
        //     screen.x = e.touches[0].pageX;
        //     screen.y = e.touches[0].pageY;
        //     console.log('reach')
        // })
        // window.addEventListener('touchmove', function (e) {
        //     screen.x = e.touches[0].pageX;
        //     screen.y = e.touches[0].pageY;
        // })
        // window.addEventListener('touchend', function (e) {
        //     screen.x = false;
        //     screen.y = false;
        // })
        screen.touches = {}
        window.addEventListener('touchstart', function (e) {
            for (var i = 0; i < e.changedTouches.length; i++) {
                screen.touches[e.changedTouches[i].identifier] = {
                    "x": e.changedTouches[i].clientX,
                    "y": screen.y = e.changedTouches[i].clientY
                }
                // console.log(screen.touches)
                // screen.x = e.changedTouches[i].clientX;
                // screen.y = e.changedTouches[i].clientY;
            }
        })
        window.addEventListener('touchend', function (e) {
            for (var i = 0; i < e.changedTouches.length; i++) {
                delete screen.touches[e.changedTouches[i].identifier];
            }
        })
        window.addEventListener('touchmove', function (e) {
            for (var i = 0; i < e.changedTouches.length; i++) {
                screen.touches[e.changedTouches[i].identifier] = {
                    "x": e.changedTouches[i].clientX,
                    "y": screen.y = e.changedTouches[i].clientY
                }
            }
        })
        // window.addEventListener('touchcancel', function (e) {
        //     for (var i = 0; i < e.changedTouches.length; i++) {
        //         screen.x = e.changedTouches[i].clientX;
        //         screen.y = e.changedTouches[i].clientY;
        //     }
        // })
    }
    listenMouse(screen) {
        window.addEventListener('mousedown', function (e) {
            screen.x = e.pageX;
            screen.y = e.pageY;
        })
        window.addEventListener('mouseup', function (e) {
            screen.x = false;
            screen.y = false;
        })
    }
    touchControler(object) {
        object.speedX = 0;
        object.speedY = 0;
        // console.log(this.touches);
        for (let key in this.touches) {
            // console.log(key, this.touches[key])
            if (upBtn.clicked(this.touches[key])) {
                object.speedY -= 1;
            }
            if (downBtn.clicked(this.touches[key])) {
                object.speedY += 1;
            }
            if (rightBtn.clicked(this.touches[key])) {
                object.speedX += 1;
            }
            if (leftBtn.clicked(this.touches[key])) {
                object.speedX -= 1;
            }
            if (aBtn.clicked(this.touches[key])) {
                object.color = "green";
            }
            if (bBtn.clicked(this.touches[key])) {
                object.color = "red";
            }
        }
    }


    // Borders
    borders(object) {
        if (object.right > this.canvas.width && this.x > this.canvas.width) {
            this.x = false;
        }
        if (object.bottom > this.canvas.height && this.y > this.canvas.height) {
            this.y = false;
        }
        if (object.left < 0 && this.x < 0) {
            this.x = false;
        }
        if (object.top < 0 && this.y < 0) {
            this.y = false;
        }
    }
}

class Component {
    constructor() {
        this.speedX = 0;
        this.speedY = 0;
    }
    newPos() {
        this.x += this.speedX;
        this.y += this.speedY;
    };
    update(screen) {
        if (this.type = "square") {
            // Takes GameScreen object
            this.ctx = screen.context;
            this.ctx.fillStyle = this.color;
            this.ctx.fillRect(this.x, this.y, this.width, this.height);
            // Object edges
            this.top = this.y;
            this.right = this.x + this.width;
            this.bottom = this.y + this.height;
            this.left = this.x;
        }
        if (this.type = "circle") {
            // takes GameScreen object
            this.ctx = screen.context;
            this.ctx.fillStyle = this.color;
            this.ctx.beginPath()
            this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            this.ctx.fill();
            this.edge = this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        }
    };
    clicked(key) {
        var clicked = true;
        if (this.bottom < key["y"] ||
            this.top > key["y"] ||
            this.right < key["x"] ||
            this.left > key["x"]) {
            clicked = false;
        }
        return clicked;
    }
}

class Rectangle extends Component {
    constructor(width, height, color, x, y) {
        super();
        this.width = width;
        this.height = height;
        this.color = color;
        this.x = x;
        this.y = y;
        this.type = "square";
    }
}

class Circle extends Component {
    constructor(x, y, radius, color) {
        super();
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.type = "cirlce"
    };
}
