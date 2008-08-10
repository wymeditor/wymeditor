Array.prototype.has = function(needle) {
    return $.inArray(needle, this) != -1;
};

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
