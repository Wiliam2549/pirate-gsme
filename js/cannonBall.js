class CannonBall {
    constructor(x, y) {
        this.radius = 30;
        this.body = Bodies.circle(x, y, this.radius, {isStatic: true});
        World.add(world, this.body);
        this.CannonBallIMG = loadImage("assets/cannonball.png");
        this.animation = [this.CannonBallIMG];
        this.speed = 0.05;
        this.trajectory = [];
        this.isSink = false;
    }
    animate() {
        this.speed = this.speed + 0.05;
    }
    shoot() {
        var h = cannon.angle - 40;
        //converting the angel h from degrees to radians
        h = h * (3.14 / 180);
        var velocity = p5.Vector.fromAngle(h);
        velocity.mult(0.4);
        Body.setStatic(this.body, false);
        Body.setVelocity(this.body, {x: velocity.x * (180 / 3.14), y: velocity.y * (180 / 3.14)});
    }
    remove(index) {
        this.isSink = true;
        this.animation = splashAnimation;
        this.speed = 0.05;
        this.radius = 100;
        Body.setVelocity(this.body, {x: 0, y: 0});
        setTimeout(() => {
            World.remove(world, this.body);
            delete balls[index];
        }, 100);
    }
    display() {
        var p = this.body.position;
        var index = floor(this.speed % this.animation.length);
        push();
        imageMode(CENTER);
        image(this.animation[index], p.x, p.y, this.radius, this.radius);
        pop();

        //getting the current x and y positions of the cannon bal and storing them in a temparary array and then pushing this array into the trajectory
        if(this.body.velocity.x > 0 && p.x > 200) {
            var position = [p.x, p.y];
            this.trajectory.push(position);
        }

        //exstracting the y and x cordinates from teh trajectory array one by one and displaying an image of a tiny cannon ball at all those spots
        for(var i = 0; i < this.trajectory.length; i++) {
            image(this.CannonBallIMG, this.trajectory[i][0], this.trajectory[i][1], 5, 5);
        }
    }
}


