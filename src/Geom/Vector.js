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
