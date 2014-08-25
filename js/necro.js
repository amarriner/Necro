var SPRITES = Array();

(function () {
    'use strict';
}());

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
    
    self.destroy = function () {
        self.stop();
        
        $('#' + self.id).remove();
    }
        
    self.doFrame = function () {
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
        
        $('#' + self.id).draggable({ 
                            containment: "parent",
                            stop: function () {
                                for (i = 0; i < SPRITES.length; i++) {
                                    if (SPRITES[i].id == $(this).attr('id')) {
                                        SPRITES[i].posx = parseInt($(this).css('left'));
                                        SPRITES[i].posy = parseInt($(this).css('top'));
                                    }
                                }
                            }
                        })
                        .addClass('sprite')
                        .css('position', 'absolute')
                        .css('background-image', 'url(entities/' + self.i.image + ')')
                        .css('top', self.posy + 'px')
                        .css('left', self.posx + 'px')
                        .css('height', self.i.frame_height + 'px')
                        .css('width', self.i.frame_width - 1 + 'px')
                        .dblclick(function () { self.destroy(); });
        
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
    
    self.stringify = function () {
        console.log('Stringifying ' + i.name);
        
        
        return $.base64.encode(self.i.name + '|' + self.posx + '|' + self.posy);
    }
    
    self.init();
}

function addSprite(name, x, y) {
    var sprite; 
    
    if (! x) {
        x = 0;
    }
    
    if (! y) {
        y = 0;
    }
    
    $.each(images, function () {
        if (! name) {
            if (this.name == $('#add_images').val()) {
                sprite = new Sprite(this, x, y);
            }
        } else {
            if (this.name.toLowerCase() == name.toLowerCase()) {
                sprite = new Sprite(this, x, y);
            }
        }
    });
    
    return sprite;
}

function addSpriteFromCode(code) {
    var s = $.base64.decode(code);
    
    var sprite = addSprite(s.split('|')[0], s.split('|')[1], s.split('|')[2]);
    
    $('#debug').append('<div>' + s + '</div>');
    
    return sprite;
}

function getURL() {
    var url = '';
    
    for (var i = 0; i < SPRITES.length; i++) {
        if (url) {
            url += '^';
        }
        
        url += SPRITES[i].stringify();
    }
    
    var data = {
        'longUrl': 'http://localhost/necro/?' + url
    };
    
    var request = gapi.client.urlshortener.url.insert({
        'resource': data
    });
    
    // http://goo.gl/jVcAhz
    request.execute(function (response) {
        $('#url').html('<a href="' + response.id + '">' + response.id + '</a>');
    });
}

function googleLoadAPI() {
    gapi.client.setApiKey('AIzaSyBsL1lbvMam0kcljbDl7H3Ty-CqC87Cvig');
    gapi.client.load('urlshortener', 'v1', getURL);
}

$(document).ready(function () {
    'use strict';
          
    $.each(images, function () {
        $('#add_images').append('<option value="' + this.name + '">' + this.name + '</option>');
    });
    
    $('#add_button').click(function () { SPRITES.push(addSprite()); });
    $('#url_button').click(function() { googleLoadAPI(); });
    
    if (window.location.href.split('?').length == 2) {
        var code = window.location.href.split('?')[1];
        for (var i = 0; i < code.split('%5E').length; i++) {
            SPRITES.push(addSpriteFromCode(code.split('%5E')[i]));
        }
    } else {
        SPRITES.push(new Sprite(images.skeleton, 50, 50));
        //SPRITES.push(addSpriteFromCode('U2tlbGV0b258NTB8NTA='));
    
        SPRITES.push(new Sprite(images.slime_green, 5, 5));
        SPRITES.push(new Sprite(images.bat, 200, 200));
    }
});