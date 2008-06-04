Object.prototype._toString = function() {
    this.str = '';
    for (var prop in this)
    {
        try
        {
            if (typeof(this[prop]) != "undefined")
			{
				this.str += prop + ': ' + this[prop] + "\n";
			}
			else
			{
				this.str += prop + ': "",' + "\n";
			}
        } catch(e) {}
    }    
    return this.str;
};

(function($) {

	var log = function(editor) {
		$.extend(editor, {log: this});
		// editor.log.init();
	};
	
	log.prototype = {
	    init: function() {
	        if (!this.win) this.win = window.open();
	    },
	    write: function(what) {
			if (!this.win) return false;
			try
			{
				if (typeof(what) == "array" || 
					typeof(what) == "object")
				{
					what = '<pre>' + what._toString() + '</pre>';
				}
				this.win.document.write(what);
				this.win.document.close();
			}
			catch(e) 
			{
			    if (this.win.document)
			    {
			        this.win.document.close();
			    }
			}
		}
	};

    WYMeditor.subscribe('Start', log);
})(jQuery);