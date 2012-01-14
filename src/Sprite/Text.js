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
