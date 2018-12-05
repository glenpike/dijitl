//create canvas

function getCanvasContext(selector) {

    var canvas = document.querySelector(selector);

    if (canvas.getContext){
      return canvas.getContext('2d');
    } else {
      console.log('Can\'t get canvas context');
      return null;
    }
}

function getDimensions(selector) {
    var el = document.querySelector(selector),
        dimensions = null;

    if(el) {
        dimensions = {
            width: el.width | 0,
            height: el.height | 0
        }
    }

    return dimensions;
}

//create points
var ShapeShifter = {
    ctx: null,
    width: 0,
    height: 0,
    points: [],

    drawingDepth: 20,
    numShapes: 3,

    numPoints: 8,
    maxPoints: 64,
    minPoints: 4,

    speed: 0.5,
    minSpeed: 1,
    maxSpeed: 10,

    colours: {
        lines: [],
        fills: [],
    },

    drawLines: [],
    drawFills: [],

    init: function(ctx, dimensions) {
        //clone the colours array?
        if(!this.origColours) {
            this.origColours = Object.create(this.colours);
        }

        this.ctx = ctx;
        this.width = dimensions.width;
        this.height = dimensions.height;

        this.createRandomColours();
        this.createPoints();

    },

    createRandomColours: function() {
        this.colours = Object.create(this.origColours);
        for(var i = 0; i < this.numShapes;i++) {
            var rgba1 = rgba2 = 'rgba(';

            for(var c = 0;c < 3;c++) {
                rgba1 += Math.round(Math.random() * 255) + ',';
                rgba2 += Math.round(Math.random() * 255) + ',';
            }
            rgba1 += 0.5 + ')';
            rgba2 += 0.5 + ')';
            this.colours.lines[i] = rgba1;
            this.colours.fills[i] = rgba2;
        }
    },

    createPoints: function() {
        this.points = [];
        for(var i = 0; i < this.numPoints;i++) {
            var point = {
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                xdir: Math.round(Math.random() * 2) - 1,
                ydir: Math.round(Math.random() * 2) - 1,
                xinc: (Math.random() * this.maxSpeed) + 1,
                yinc: (Math.random() * this.maxSpeed) + 1
            }
            this.points.push(point);
        }
    },

    animate: function() {
        for(var i = 0; i < this.numPoints;i++) {
            var point = this.points[i];

            point.x += point.xinc * point.xdir;
            point.y += point.yinc * point.ydir;

            if(this.width < point.x) {
                point.xdir = -1;
                point.x = this.width;
                point.xinc = (Math.random() * this.maxSpeed) + 1;
            } else if(0 > point.x) {
                point.xdir = 1;
                point.x = 0;
                point.xinc = (Math.random() * this.maxSpeed) + 1;
            }

            if(this.height < point.y) {
                point.ydir = -1;
                point.y = this.height;
                point.yinc = (Math.random() * this.maxSpeed) + 1;
            } else if(0 > point.y) {
                point.ydir = 1;
                point.y = 0;
                point.yinc = (Math.random() * this.maxSpeed) + 1;
            }

        }
    },

    draw: function() {
        var ctx = this.ctx;
        ctx.clearRect(0, 0, this.width, this.height);

        ctx.strokeStyle = this.colours.lines[0];
        ctx.fillStyle = this.colours.fills[0];
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        for(var i = 1;i < this.numPoints;i++) {
            ctx.lineTo(this.points[i].x, this.points[i].y)
        }
        ctx.moveTo(this.points[0].x, this.points[0].y);
        ctx.fill();
        ctx.stroke();

        ctx.strokeStyle = this.colours.lines[1];
        ctx.fillStyle = this.colours.fills[1];
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        for(var i = 1;i < this.numPoints - 2;i+=2) {
            ctx.quadraticCurveTo(this.points[i].x, this.points[i].y, this.points[i + 1].x, this.points[i + 1].y)
        }
        ctx.quadraticCurveTo(this.points[i].x, this.points[i].y, this.points[0].x, this.points[0].y);
        ctx.fill();
        ctx.stroke();

        ctx.strokeStyle = this.colours.lines[2];
        ctx.fillStyle = this.colours.fills[2];
        ctx.beginPath();

        /*var pX1 = ((this.points[0].x - this.points[this.points.length - 1].x) / 2) + this.points[this.points.length - 1].x;
        var pY1 = ((this.points[0].y - this.points[this.points.length - 1].y) / 2) + this.points[this.points.length - 1].y;
        this.shape.moveTo(pX1, pY1);

        for(var i = 1; i < this.points.length; i++) {
            var pX = ((this.points[i].x - this.points[i - 1].x) / 2) + this.points[i - 1].x;
            var pY = ((this.points[i].y - this.points[i - 1].y) / 2) + this.points[i - 1].y;
            this.shape.curveTo(this.points[i - 1].x, this.points[i - 1].y, pX, pY);
        }
        this.shape.curveTo(this.points[this.points.length -1].x, this.points[this.points.length -1].y, pX1, pY1);
        this.shape.endFill();*/
        var p1 = {
            x: ((this.points[0].x - this.points[this.points.length - 1].x) / 2) + this.points[this.points.length - 1].x,
            y: ((this.points[0].y - this.points[this.points.length - 1].y) / 2) + this.points[this.points.length - 1].y
        };
        ctx.moveTo(p1.x, p1.y);
        for(var i = 1;i < this.numPoints;i++) {
            var p = {
                x: ((this.points[i].x - this.points[i - 1].x) / 2) + this.points[i - 1].x,
                y: ((this.points[i].y - this.points[i - 1].y) / 2) + this.points[i - 1].y
            };
            ctx.quadraticCurveTo(this.points[i - 1].x, this.points[i - 1].y, p.x, p.y)
        }
        ctx.quadraticCurveTo(this.points[this.points.length -1].x, this.points[this.points.length -1].y, p1.x, p1.y);
        ctx.fill();
        ctx.stroke();
    }
}


//animation

//controls

var selector = '#canvas',
    ctx = getCanvasContext(selector),
    dimensions = getDimensions(selector);

// ShapeShifter.init(ctx, dimensions);
// setInterval(function() {
//     ShapeShifter.draw();
//     ShapeShifter.animate();
// }, 100);
