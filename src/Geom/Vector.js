function Vector(x, y)
{
	var self = this;
	var init = function () 
	{
		if (x) self.x = x;
		else self.x = 0;
		
		if (y) self.y = y;
		else self.y = 0;
	};
	
	this.x = 0;
	this.y = 0;
	
	this.toString = function ()
	{
		return self.x +'/'+ self.y;
	};
	
	init(x, y);
}
