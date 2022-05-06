class Boat {
    constructor(x, y, width, height, boatPOS, boatAnimation) {
        var options = {
            restitution: 0.8,
            friction: 1,
            density: 1
        }
        this.body = Bodies.rectangle(x, y, width, height, options);
        World.add(world, this.body);
        this.animation = boatAnimation;
        this.speed = 0.05;
        this.isBroken = false;
        this.width = width;
        this.height = height;
        this.boatPOS = boatPOS;
        this.boat = loadImage("assets/boat.png");
    }
    animate() {
        this.speed = this.speed + 0.05;
    }
    remove(index) {
        this.isBroken = true;
        this.animation = breakAnimation;
        this.speed = 0.05;
        this.width = 250;
        this.height = 250;
        Body.setVelocity(boats[index].body, {x: 0, y: 0})
        setTimeout(() => {
            World.remove(world, boats[index].body);
            delete boats[index];
        }, 2000);
    }
    display() {
        var p = this.body.position;
        //var index = Math.round(random(0, 3));
        var index = floor(this.speed % this.animation.length);
        push();
        translate(p.x, p.y)
        imageMode(CENTER);
        image(this.animation[index], 0, this.boatPOS, this.height, this.width);
        pop();
    }
}