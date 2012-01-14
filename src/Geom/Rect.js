function Rect(pos, size) 
{
	var self = this;
	var init = function (pos, size) 
	{
		if (pos) self.pos = pos;
		else self.pos = new Vector();
		
		if (size) self.size = size;
		else self.size = new Vector();
	};
	
	this.pos = null;
	this.size = null;
	
	this.left = function ()
	{
		return self.pos.x;
	};
	
	this.right = function ()
	{
		return self.pos.x + self.size.x;
	};
	
	this.top = function ()
	{
		return self.pos.y;
	};
	
	this.bottom = function ()
	{
		return self.pos.y + self.size.y;
	};
	
	this.center = function (pos)
	{
		if(pos)
		{
//			self.pos.x = pos.x - size.x/2;
//			self.pos.y = pos.y - size.y/2;
			self.pos.x = pos.x - self.size.x/2;
			self.pos.y = pos.y - self.size.y/2;
		}
		
		return new Vector(
			self.pos.x + self.size.x/2,
			self.pos.y + self.size.y/2
		);
	};
	
	this.clone = function ()
	{
		return new Rect(
			new Vector(self.pos.x, self.pos.y),
			new Vector(self.size.x, self.size.y)
		);
	};
	
	this.toString = function ()
	{
		return self.pos.toString() +' - '+ self.size.toString();
	};
	
	init(pos, size);
}
