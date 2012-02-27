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
	},
	
		/**
	 * return true if the sprite collide the rect (use bounding box)
	 */
	collide: function (rect2)
	{
		var x1 = (this.pos.x <= rect2.pos.x && this.pos.x + this.size.x >= rect2.pos.x);
		var y1 = (this.pos.y <= rect2.pos.y && this.pos.y + this.size.y >= rect2.pos.y);
		var x2 = (rect2.pos.x <= this.pos.x && rect2.pos.x + rect2.size.x >= this.pos.x);
		var y2 = (rect2.pos.y <= this.pos.y && rect2.pos.y + rect2.size.y >= this.pos.y);
		
		return (x1 || x2) && (y1 || y2);
	}
});
