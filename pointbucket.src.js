if (! info){
    var info = {};
}

if (! info.aaronland){
    info.aaronland = {};
}

if (! info.aaronland.geo){
    info.aaronland.geo = {};
}

info.aaronland.geo.Pointbucket = function(args){
    this.args = args;
    this.bucket_name = args['bucket'];
};

info.aaronland.geo.Pointbucket.prototype.bucket_label = function(label){
    return this.bucket_name + '.' + label;
};

info.aaronland.geo.Pointbucket.prototype.store = function(data){

    if ((! data['latitude']) || (! data['longitude'])){
	return 0;
    }

    var l_coords = this.bucket_label('coords');
    var l_lastloc = this.bucket_label('lastloc');
    var l_lastseen = this.bucket_label('lastseen');

    var lat = Number(data['latitude']).toFixed(6);
    var lon = Number(data['longitude']).toFixed(6);

    var lat_short = Number(lat).toFixed(4);
    var lon_short = Number(lon).toFixed(4);

    var current_loc = lat_short + ',' + lon_short;

    if (! data['timestamp']){
	var d = new Date();
	data['timestamp'] = d.getTime();
    }

    try {

	var last_loc = localStorage.getItem(l_lastloc);

	if (! this.args['force']){

	    if ((last_loc != '') && (last_loc == current_loc)){
		return 1;
	    }
	}

	var coords = this.expand_coords(localStorage.getItem(l_coords));
	coords.push(data);

	if (this.args['debug']){
	    // console.log('store ' + coords);
	    return;
	}

	localStorage.setItem(l_coords, this.collapse_coords(coords));
	localStorage.setItem(l_lastloc, current_loc);
	localStorage.setItem(l_lastseen, this['timestamp']);
    }

    catch(e){
	return 0;
    }

    return 1;
};

info.aaronland.geo.Pointbucket.prototype.expand_coords = function(coords){

    if (! coords){
	return new Array();
    }

    return JSON.parse(coords);
};

info.aaronland.geo.Pointbucket.prototype.collapse_coords = function(coords){

    return JSON.stringify(coords);
}

info.aaronland.geo.Pointbucket.prototype.export = function(label){

    var l_coords = this.bucket_label('coords');
    var result = '';

    try{
	var coords = localStorage.getItem(l_coords);
	return coords;
    }

    catch (e){
	return 0;
    }

    return 1;
};

info.aaronland.geo.Pointbucket.prototype.purge = function(label){

    var ok = 0;

    try{

	var l_coords = this.bucket_label('coords');
	var l_lastloc = this.bucket_label('lastloc');
	var l_lastseen = this.bucket_label('lastseen');

	localStorage.setItem(l_coords, null);
	localStorage.setItem(l_lastloc, null);
	localStorage.setItem(l_lastseen, null);

	ok = 1;
    }

    catch (e){
	return 0;
    }

    return 1;
};