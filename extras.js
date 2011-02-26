function getGmtOffset() {
	var d = new Date();
	var gmtOffset = d.getTimezoneOffset() * 60;	// minutes to seconds
	return gmtOffset;
}

function getUnixTime(strDate) {
	var d = new Date(strDate);
	var unixTime = (d.getTime() / 1000);
	return unixTime;
}

Array.prototype.uniqueByKey = function(array, key) {
	// unique = foo.uniqueByKey(bar, "key").sort();
	var r = [];
	for(var i = 0; i < array.length; i++) {
		if(r.indexOf(array[i][key]) == -1) {
			r.push(array[i][key]);
		}
	}
	return r;
}

Array.prototype.unique = function () {
	// unique = foo.unique().sort();
    var r = [];
    for(var i = 0, n = this.length; i < n; i++) {
        if (this.lastIndexOf(this[i]) == i) r.push(this[i]);
    }
    return r;
}

$.expr[':'].contentIs = function(el, idx, meta) {
    return $(el).text() === meta[3];
};

function isarray(input){
	return typeof(input)=='object'&&(input instanceof Array);
}
