function Loadable() 
{
	var self = this;
	var init = function () 
	{
	}
	
	this.load = function ()
	{
		self._onload();
	}
	
	this.onload = function () {}
	this._onload = function ()
	{
		self.onload();
	}
	
	init();
}
