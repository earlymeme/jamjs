function Canvas(canvas_elem, size) 
{
	var self = this;
	var init = function (canvas_elem, size) 
	{
		self.ctx = canvas_elem.getContext("2d");
		self.size = size;
	};
	
	this.ctx = null;
	this.size = null;
	
	this.clear = function (color)
	{
		if (color)
		{
			self.ctx.fillStyle = color;
			self.ctx.fillRect(0, 0, self.size.x, self.size.y);
		}
		else
		{
			self.ctx.clearRect(0, 0, self.size.x, self.size.y);
		}
	};
	
	init(canvas_elem, size);
}
