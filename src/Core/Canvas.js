var Canvas = Class.extend({
	
	ctx: null,
	size: null,
	
	init: function(canvas_elem, size)
	{
		this.ctx = canvas_elem.getContext('2d');
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
