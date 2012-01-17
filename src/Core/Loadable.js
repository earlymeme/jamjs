var Loadable = Class.extend(
{
	init: function () 
	{
	},
	
	load: function ()
	{
		this._onload();
	},
	
	onload: function () {},
	_onload: function ()
	{
		this.onload();
	}
});
