class Cannon {
    constructor(x, y, width, height, angle) {
        this.x = x;
        this.y = y;
        this.w = width;
        this.h = height;
        this.angle = angle;
        this.gunImg = loadImage("assets/cannon.png");
        this.baseImg = loadImage("assets/cannonBase.png");
    }
    display() {
        if(keyIsDown(LEFT_ARROW) && this.angle > -30) {
            this.angle = this.angle - 1;
        }
        if(keyIsDown(RIGHT_ARROW) && this.angle < 75) {
            this.angle = this.angle + 1;
        }
        //code to create the cannon gun
        push();
        translate(this.x, this.y);
        rotate(this.angle);
        imageMode(CENTER);
        image(this.gunImg, 0, 0, this.w, this.h);
        pop();

        //code to create the cannon base
        image(this.baseImg, 50, 25, 200, 200);
        //image(this.baseImg, this.x, this.y, this.w, this.h);
    }
}

