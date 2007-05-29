jQuery.merge = function(first, second) {
    // We have to loop this way because IE & Opera overwrite the length
    // expando of getElementsByTagName
    for ( var i = 0; second[i]; i++ ) {
    	second[i].$merge = true;
    	first.push(second[i]);
    }
    return first;
};

jQuery.unique = function(first) {
    var r = [];
    for ( var i = 0, fl = first.length; i < fl; i++ )
        if ( first[i].$merge ) {
 	      first[i].$merge = false;
 	      first[i].removeAttribute('$merge');
 	      r.push(first[i]);
 	    }
 	return r;
};
