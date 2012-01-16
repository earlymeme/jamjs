/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

  // The base Class implementation (does nothing)
  this.Class = function(){};
 
  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
    var _super = this.prototype;
   
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;
   
    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
           
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
           
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);       
            this._super = tmp;
           
            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }
   
    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }
   
    // Populate our constructed prototype object
    Class.prototype = prototype;
   
    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;

    // And make this class extendable
    Class.extend = arguments.callee;
   
    return Class;
  };
})();
var Canvas = Class.extend({
	
	ctx: null,
	size: null,
	
	init: function(canvas_elem, size)
	{
		this.ctx = canvas_elem.getContext("2d");
		this.size = size;
	},
	
	clear: function (color)
	{
		if (color)
		{
			this.ctx.fillStyle = color;
		}
		
		this.ctx.clearRect(0, 0, this.size.x, this.size.y);
	}
});
var Loader = Class.extend(
{
	items: [],
	nb_loaded: 0,
	
	init: function (items) 
	{
		this.items = items ? items : [];
	},
	
	load: function ()
	{
		var self = this;
		if (this.items.length == 0)
		{
			this._onload();
		}
		else
		{
			for (var i = 0; i < this.items.length; i++)
			{
				this.items[i].onload = function() {self._load_update.apply(self, arguments)};
				this.items[i].load();
			}
		}
	},
	
	load_update: function () {},
	_load_update: function ()
	{
		this.nb_loaded += 1;
		
		if (this.nb_loaded == this.items.length)
		{
			this._onload();
		}
		else
		{
			this.load_update();
		}
	},
	
	onload: function () {},
	_onload: function ()
	{
		//this.items = [];
		this.onload();
	}
});

var Vector = Class.extend(
{
	x: 0,
	y: 0,
	
	init: function(x, y)
	{
		if (x) this.x = x;
		else this.x = 0;
		
		if (y) this.y = y;
		else this.y = 0;
	},
	
	toString: function()
	{
		return 'Vector('+ this.x +','+ this.y +')';
	}
});
var Rect = Class.extend(
{
	pos: null,
	size: null,
	
	init: function (pos, size) 
	{
		if (pos) this.pos = pos;
		else this.pos = new Vector();
		
		if (size) this.size = size;
		else this.size = new Vector();
	},
	
	left: function ()
	{
		return this.pos.x;
	},
	
	right: function ()
	{
		return this.pos.x + this.size.x;
	},
	
	top: function ()
	{
		return this.pos.y;
	},
	
	bottom: function ()
	{
		return this.pos.y + this.size.y;
	},
	
	center: function (pos)
	{
		if(pos)
		{
//			this.pos.x = pos.x - size.x/2;
//			this.pos.y = pos.y - size.y/2;
			this.pos.x = pos.x - this.size.x/2;
			this.pos.y = pos.y - this.size.y/2;
		}
		
		return new Vector(
			this.pos.x + this.size.x/2,
			this.pos.y + this.size.y/2
		);
	},
	
	clone: function ()
	{
		return new Rect(
			new Vector(this.pos.x, this.pos.y),
			new Vector(this.size.x, this.size.y)
		);
	},
	
	toString: function ()
	{
		return this.pos.toString() +' - '+ this.size.toString();
	}
});

var Sprite = Class.extend(
{
	//image
	img: null,
	rect: null,
	angle: 0,
	
	// animation
	anim_column: 0,
	timeToNextFrame: 0,
	
	// animation config
	current_anim: 0,
	config: {},
	default_config: {
		src: null,
		size: null,
		anim: [
			{
				fps: 0,
				row: 0,
				first_frame: 0
			}
		]
	},
	
	init: function (config) 
	{
		var i = null;
		this.rect = new Rect();
		this.current_anim = 0;
		this.angle = 0;
		this.anim_column = 0;
		this.timeToNextFrame = 0;
		
		//merge default config with actual config
		extend_array(config, this.default_config);
		for (i in config['anim'])
		{
			extend_array(config['anim'][i], this.default_config['anim'][0]);
		}
		this.config = config;
	},
	
	onload: function () {},
	_onload: function ()
	{
		if (!this.config['size'])
		{
			this.config['size'] = new Vector(
				this.img.width,
				this.img.height
			);
			this.rect.size.x = this.img.width;
			this.rect.size.y = this.img.height;
		}
		else
		{
			var x = this.config['size'].x;
			var y = this.config['size'].y;
			this.config['size'] = new Vector(
				this.img.width,
				this.img.height
			);
			this.rect.size.x = x;
			this.rect.size.y = y;
		}
		
		this.onload();
	},
	
	load: function ()
	{
		var self = this;
		
		this.img = new Image();
		this.img.onload = function() {self._onload.apply(self, arguments)};
		this.img.src = this.config['src'];
	},
	
	_blit: function (canvas) 
	{
		//see http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#dom-context-2d-drawimage
		canvas.ctx.drawImage(
			this.img, //image
			this.rect.size.x*this.anim_column, //sx
			this.rect.size.y*this.config['anim'][this.current_anim]['row'], //sy
			this.rect.size.x, //sw
			this.rect.size.y, //sh
			this.rect.pos.x, //dx
			this.rect.pos.y, //dy
			this.rect.size.x, //dw
			this.rect.size.y //dy
		);
	},
	
	draw: function (canvas)
	{
		if (this.angle != 0)
		{
			canvas.ctx.save();
			
			var tr = new Vector(
				this.rect.pos.x + (this.rect.size.x/2),
				this.rect.pos.y + (this.rect.size.y/2)
			);
			
			//put the rotation point at the center of the sprite
			canvas.ctx.translate(
				tr.x,
				tr.y
			);
			
			//rotate by angle
			canvas.ctx.rotate(this.angle * Math.PI /180);
			
			//put the rotation points back to the origins
			canvas.ctx.translate(
				-tr.x,
				-tr.y
			);
		}
		
		this._blit(canvas);
		
		if (this.angle != 0)
		{
			canvas.ctx.restore();
		}
	},
	_draw: function (canvas)
	{
		this.draw(canvas);
	},
	
	update: function (delay) {},
	_update: function (delay)
	{
		this.update_anim(delay);
		this.update();
	},
	
	move: function (vect)
	{
		this.rect.pos.x += vect.x;
		this.rect.pos.y += vect.y;
	},
	
	clone: function ()
	{
		var config = this.config;
		var rect = this.rect.clone();
		var x = rect.size.x;
		var y = rect.size.y;
		
		//swap size because _onload wil swap it
		//TODO: find better
		rect.size.x = config['size'].x;
		rect.size.y = config['size'].y;
		config['size'].x = x;
		config['size'].y = y;
		
		var newone = new Sprite(this.config);
		newone.img = this.img;
		newone.rect = rect;
		newone.angle = this.angle;
		newone.anim_column = this.anim_column;
		newone.timeToNextFrame = this.timeToNextFrame;
		newone.current_anim = this.current_anim;
		
		newone._onload();
		
		return newone;
	},
	
	//-------- ANIMATIONS ----------//
	
	update_anim: function (delay) 
	{
		if (this.config['anim'][this.current_anim]['fps'] > 0)
		{
			this.timeToNextFrame += delay/1000.0;
			
			if (this.timeToNextFrame >= 1/this.config['anim'][this.current_anim]['fps'])
			{
				this.anim_column += 1;
				if (this.anim_column >= this.config['size'].x/this.rect.size.x)
				{
					this.anim_column = this.config['anim'][this.current_anim]['first_frame'];
				}
				
				this.timeToNextFrame = 0;
			}
		}
	},
	
	set_anim: function (anim)
	{
		this.current_anim = anim;
		this.anim_column = 0;
	},
	
	//-------- COLIDE TEST ---------//
	
	/**
	 * return true if the sprite collide the pt
	 */
	collidePoint: function (pt)
	{
		return pt.x >= this.rect.pos.x &&
			pt.x <= this.rect.pos.x + this.rect.size.x &&
			pt.y >= this.rect.pos.y &&
			pt.y <= this.rect.pos.y + this.rect.size.y;
	},
	
	/**
	 * return true if the sprite collide the rect (use bounding box)
	 */
	collideRect: function (pos, size)
	{
		var x1 = (this.rect.pos.x < pos.x && this.rect.pos.x + this.rect.size.x >= pos.x);
		var y1 = (this.rect.pos.y < pos.y && this.rect.pos.y + this.rect.size.y >= pos.y);
		var x2 = (pos.x < this.rect.pos.x && pos.x + size.x >= this.rect.pos.x);
		var y2 = (pos.y < this.rect.pos.y && pos.y + size.y >= this.rect.pos.y);
		
		return (x1 || x2) && (y1 || y2);
	},
	
	/**
	 * return true if the sprite collide the rect (use bounding box)
	 */
	collideSprite: function (sprite)
	{
		return this.collideRect(
			sprite.rect.pos,
			sprite.rect.size
		);
	}
});
var SpriteGroup = Loader.extend(
{
	init: function () 
	{
	},
	
	loader: null,
	
	update: function(delay)
	{
		for (var i = 0; i < this.items.length; i++)
		{
			this.items[i]._update(delay);
		}
	},
	_update: function (delay) 
	{
		this.update(delay);
	},
	
	draw: function(canvas)
	{
		for (var i = 0; i < this.items.length; i++)
		{
			this.items[i]._draw(canvas);
		}
	},
	_draw: function (canvas) 
	{
		this.draw(canvas);
	},
	
	remove: function(item)
	{
		var pos = items.indexOf(item)
		if (pos >= 0)
		{
			items.splice(pos, 1);
		}
	}
});
function Text() 
{
	var self = this;
	var init = function () 
	{
		self.pos = new Vector();
	};
	
	this.TYPE_STROKE = 1;
	this.TYPE_FILL = 2;
	
	this.pos = null;
	this.text = '';
	this.type = this.TYPE_FILL;
	this.style = {fillStyle: "#fff", lineWidth:1, font:"12px sans-serif"};
	
	this.onload = function () {};
	this._onload = function () 
	{
		self.onload();
	};
	
	this.load = function ()
	{
		// nothing to load
		self.onload();
	};
	
	this.draw = function (canvas)
	{
		canvas.ctx.save();
		
		var s;
		for (s in self.style)
		{
			canvas.ctx[s] = self.style[s];
		}
		
		if (self.type == self.TYPE_FILL)
		{
			canvas.ctx.fillText(self.text, self.pos.x, self.pos.y);
		}
		else
		{
			canvas.ctx.strokeText(self.text, self.pos.x, self.pos.y);
		}
		
		canvas.ctx.restore();
	};
	this._draw = function (canvas)
	{
		self.draw(canvas);
	};
	
	this.update = function (delay) {}
	this._update = function (delay)
	{
		self.update();
	};
	
	this.move = function (vect)
	{
		this.pos.x += vect.x;
		this.pos.y += vect.y;
	};
	
	this.clone = function ()
	{
		var newone = new Text();
		newone.pos = self.pos;
		newone.text = self.text;
		newone.type = self.type;
		newone.style = self.style;
		
		return newone;
	};
	
	init();
}

function Scene(canvas) 
{
	var self = this;
	var init = function () 
	{
		//extend(this, new Loader());
		
		self.canvas = canvas;
		self.group = new SpriteGroup();
		
		self.last_time = new Date().getTime();
	};
	
	this.load = function()
	{
		self.group.onload = self._start;
		self.group.load();
	};
	
	this.background_color = null;
	
	this.canvas = null;
	this.group = null;
	
	this.REFRESH_RATE = 1000 / 30;
	this.interval_id = 0;
	this.last_time = 0;
	this.is_paused = false;
	
	this.start = function(){}
	this._start = function()
	{
		self.start();
		
		//self.interval_id = setInterval(self._update, self.REFRESH_RATE);
		self.is_paused = false;
		self.interval_id = self.set_time_out(0);
	};
	
	this.stop = function()
	{
		//clearInterval(self.interval_id);
		self.is_paused = true;
		clearTimeout(self.interval_id);
	};
	
	this.update = function(delay) {}
	this._update = function()
	{
		var now = new Date().getTime();
		var delay = now - self.last_time;
		
		self.canvas.clear(self.background_color);
		
		self.group.update(delay);
		self.group.draw(self.canvas);
		
		self.update();
		
		var now2 = new Date().getTime();
		self.interval_id = self.set_time_out(now2 - now);
		self.last_time = now;
	};
	
	this.set_time_out = function(frame_time)
	{
		if (self.is_paused != true)
		{
			var millisec = self.REFRESH_RATE - frame_time;
			return setTimeout(self._update, millisec)
		}
	};
	
	init(canvas);
}

/**
 * random number between min and max (both side inclusive)
 */
function rand_int(min, max)
{
	return min + Math.floor(Math.random()*(Math.abs(min)+max+1));
}

function getVectFromSpeedAndAngle(angle, speed)
{
	var vect = new Vector();
	
	vect.x = Math.cos(Math.PI * angle / 180) * speed;
	vect.y = -Math.sin(Math.PI * angle / 180) * speed;
	
	return vect;
}

function extend_array(src, dest)
{
	var k = null;
	for (k in dest)
	{
		if (src[k] === undefined)
		{
			src[k] = dest[k];
		}
	}
}

function getKeyNum(e)
{
	var keynum;

	if(window.event) // IE
	{
		keynum = e.keyCode;
	}
	else if(e.which) // Netscape/Firefox/Opera
	{
		keynum = e.which;
	}
	
	return keynum;
}
var jsgame = {
};


/*


var CLASSNAME = Class.extend({
	
	init: function()
	{
	}
});




*/