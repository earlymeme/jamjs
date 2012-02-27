var Scene = Class.extend(
{
	background_color: null,
	
	canvas: null,
	group: null,
	
	REFRESH_RATE: 1000 / 30,
	interval_id: 0,
	last_time: 0,
	is_paused: false,
	
	init : function (canvas) 
	{
		this.canvas = canvas;
		this.group = new SpriteGroup();
		
		this.last_time = new Date().getTime();
	},
	
	load : function()
	{
		var self = this;
		
		this.group.onload = function() {self._start.apply(self, arguments)};
		this.group.load();
	},
	
	start : function(){},
	_start : function()
	{
		this.start();
		
		//this.interval_id = setInterval(this._update, this.REFRESH_RATE);
		this.is_paused = false;
		this.interval_id = this.set_time_out(0);
	},
	
	stop : function()
	{
		//clearInterval(this.interval_id);
		this.is_paused = true;
		clearTimeout(this.interval_id);
	},
	
	update : function(delay) {},
	_update : function()
	{
		var now = new Date().getTime();
		var delay = now - this.last_time;
		
		this.canvas.clear(this.background_color);
		
		this.group.update(delay);
		this.group.draw(this.canvas);
		
		this.update(delay);
		
		var now2 = new Date().getTime();
		this.interval_id = this.set_time_out(now2 - now);
		this.last_time = now;
	},
	
	set_time_out : function(frame_time)
	{
		if (this.is_paused != true)
		{
			var self = this;
			var millisec = this.REFRESH_RATE - frame_time;
			return this._requestAnimFrame(
				function() {self._update.apply(self, arguments);}
			)
		}
	},
	
	_requestAnimFrame : function (callback, time)
	{
		var rAF = window.requestAnimationFrame       || 
				window.webkitRequestAnimationFrame || 
				window.mozRequestAnimationFrame    || 
				window.oRequestAnimationFrame      || 
				window.msRequestAnimationFrame     || 
				function( callback ){
					window.setTimeout(callback, time);
				};
		return rAF(callback);
	}
});
