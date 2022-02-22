var gameScreen
var dpad
var buttons
var char


function start() {
    gameScreen = new Screen("black", "playArea");
    dpad = new Controller("red", "dpadArea", "dpad");
    buttons = new Controller("red", "buttonArea", "buttons")
    char = new Rectangle(25, 25, "red", 40, 40);
    gameScreen.start();
}

function updateGameArea() {
    gameScreen.clear();
    char.update(gameScreen);
    char.newPos();
    dpad.directionControler(char);
    buttons.inputController(char);
}

// Full Screen Experience Samples
var elem = document.documentElement;
function openFullScreen() {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
    }
}

function closeFullScreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
    }
}

window.addEventListener("load", function () {
    setTimeout(function () {
        // This hides the address bar:
        window.scrollTo(0, 1);
    }, 0);
});


class CanvasArea {
    constructor(bgcolor, area) {
        this.canvas = document.createElement("canvas");
        this.canvas.id = area + "Canvas";
        this.context = this.canvas.getContext("2d");
        this.canvas.style.backgroundColor = bgcolor;
        this.area = document.getElementById(area);
        this.area.insertBefore(this.canvas, this.area.childNodes[-1]);
    }
}

class Controller extends CanvasArea {
    constructor(bgcolor, area, type) {
        super(bgcolor, area);
        this.canvas.width = 160;
        this.canvas.height = 160;
        this.canvas.style.borderRadius = "20%"
        this.type = type;
        if (this.type === "dpad") {
            var color = "black";
            this.upBtn = new Rectangle(50, 50, color, 55, 5)
            this.downBtn = new Rectangle(50, 50, color, 55, 105)
            this.leftBtn = new Rectangle(50, 50, color, 5, (this.canvas.height - 105))
            this.rightBtn = new Rectangle(50, 50, color, 105, (this.canvas.height - 105))
            this.upBtn.update(this);
            this.downBtn.update(this);
            this.leftBtn.update(this);
            this.rightBtn.update(this);
        }
        if (this.type === "buttons") {
            var color = "black"
            this.aBtn = new Rectangle(50, 50, color, 10, 75)
            this.bBtn = new Rectangle(50, 50, color, 100, 45)
            this.aBtn.update(this);
            this.bBtn.update(this);
        }
    }
    listenTouch(screen) {
        screen.touches = {}
        screen.canvas.addEventListener('touchstart', function (e) {
            for (var i = 0; i < e.changedTouches.length; i++) {
                screen.touches[e.changedTouches[i].identifier] = {
                    "x": e.changedTouches[i].clientX - screen.canvas.offsetLeft,
                    "y": screen.y = e.changedTouches[i].clientY - screen.canvas.offsetTop
                }
                console.log(screen.touches)
            }
        })
        screen.canvas.addEventListener('touchend', function (e) {
            for (var i = 0; i < e.changedTouches.length; i++) {
                delete screen.touches[e.changedTouches[i].identifier];
            }
        })
        screen.canvas.addEventListener('touchmove', function (e) {
            for (var i = 0; i < e.changedTouches.length; i++) {
                screen.touches[e.changedTouches[i].identifier] = {
                    "x": e.changedTouches[i].clientX - screen.canvas.offsetLeft,
                    "y": screen.y = e.changedTouches[i].clientY - screen.canvas.offsetTop
                }
            }
        })
    }
    directionControler(object) {
        object.speedX = 0;
        object.speedY = 0;
        var speed = 2
        // console.log(this.touches);
        for (let key in this.touches) {
            console.log(key, this.touches[key])
            if (dpad.upBtn.clicked(this.touches[key])) {
                object.speedY -= speed;
            }
            if (dpad.downBtn.clicked(this.touches[key])) {
                object.speedY += speed;
            }
            if (dpad.rightBtn.clicked(this.touches[key])) {
                object.speedX += speed;
            }
            if (dpad.leftBtn.clicked(this.touches[key])) {
                object.speedX -= speed;
            }

        }
    }
    inputController(object) {
        // console.log(this.touches);
        for (let key in this.touches) {
            console.log(key, this.touches[key])
            if (buttons.aBtn.clicked(this.touches[key])) {
                object.color = "green";
            }
            if (buttons.bBtn.clicked(this.touches[key])) {
                object.color = "red";
            }
        }

    }
}

class Screen extends CanvasArea {
    constructor(bgcolor, area) {
        super(bgcolor, area);
        if (matchMedia("only screen and (orientation: portrait)").matches) {
            this.canvas.width = innerWidth;
            this.canvas.height = innerWidth;
        } else if (matchMedia("only screen and (orientation: landscape)").matches) {
            this.canvas.height = innerHeight;
            this.canvas.width = innerHeight;
        }
    }
    start() {
        // Refresh interval
        this.interval = setInterval(updateGameArea, 20);
        // Listeners
        dpad.listenTouch(dpad)
        buttons.listenTouch(buttons)
    }
    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    stop() {
        clearInterval(this.interval);
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
    clicked(key) {
        console.log('reach')
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

start();