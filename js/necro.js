(function () {
    'use strict';
}());

var images = {
    "skeleton": {
        "name": "Skeleton",
        "image": "skeleton.png",
        "height": 50,
        "width": 192,
        "frame_height": 25,
        "frame_width": 24,
        "loop": false
    },
    "slime_green": {
        "name": "Green Slime",
        "image": "slime_green.png",
        "height": 52,
        "width": 104,
        "frame_height": 26,
        "frame_width": 26,
        "loop": true
    },
    "bat": {
        "name": "Bat",
        "image": "bat.png",
        "height": 48,
        "width": 96,
        "frame_height": 24,
        "frame_width": 24,
        "loop": true
    }
};

var i = images.slime_green;

var x = 0;
var dir = -1;
   
function Sprite(i, x, y) {
    'use strict';
    
    var self = this;
    
    self.id = -1;
    self.interval = -1;
    self.dir = -1;
    self.x = 0;
    self.i = i;
    self.posx = x;
    self.posy = y;
    
    self.doFrame = function() {
        self.x += self.i.frame_width * self.dir;
    
        if (self.x <= self.i.width * -1 + self.i.frame_width || self.x >= 0) {
            if (self.i.loop) {
                self.x = 0;
            } else {
                self.dir *= -1;
            }
        }
    
        $('#' + self.id).css('background-position', self.x + 'px 0px');
    }

    self.init = function () {
        console.log('Initializing ' + i.name);
        
        self.id = 'sprite_' + $('#animated div.sprite').length;
        $('#animated').append('<div id="' + self.id + '"></div>');
        
        $('#' + self.id).addClass('sprite')
                        .css('background-image', 'url(entities/' + self.i.image + ')')
                        .css('top', self.posy + 'px')
                        .css('left', self.posx + 'px')
                        .css('height', self.i.frame_height + 'px')
                        .css('width', self.i.frame_width - 1 + 'px');
        
        self.start();
    }
    
    self.start = function () {
        console.log('Starting ' + i.name);
        
        self.interval = setInterval(function () { self.doFrame(); }, 250);
    }
    
    self.stop = function () {
        console.log('Stopping ' + i.name);
        
        if (self.interval) {
            clearInterval(self.interval);
        }
    }
    
    self.init();
}

$(document).ready(function () {
    'use strict';
    
    var skel = new Sprite(images.skeleton, 50, 50);
    var slime = new Sprite(images.slime_green, 5, 5);
    var bat = new Sprite(images.bat, 200, 200);
});