L.TileLayer.AGSDynamic = L.TileLayer.extend({
	defaultAgsParams: {
		minZoom: 0,
        maxZoom: 18,
        attribution: '',
        opacity: 1,
        layers: null,
        format: 'PNG8',
        transparent: 'true',
        defintionQuery: '',
		cacheBuster:false
	},

	initialize: function(/*String*/ url, /*Object*/ options) {
		this._url = url;
		
		this.agsDynamicParams = L.Util.extend({}, this.defaultAgsParams);
		this.agsDynamicParams.width = this.agsDynamicParams.height = this.options.tileSize;
		
		for (var i in options) {
			// all keys that are not TileLayer options go to WMS params
			if (!this.options.hasOwnProperty(i)) {
				this.agsDynamicParams[i] = options[i];
			}
		}

		L.Util.setOptions(this, options);
	},
	
	onAdd: function(map) {
		L.TileLayer.prototype.onAdd.call(this, map);
	},
	
	getTileUrl: function(/*Point*/ tilePoint, /*Number*/ zoom)/*-> String*/ {
		var tileSize = this.options.tileSize,
			nwPoint = tilePoint.multiplyBy(tileSize),
			sePoint = nwPoint.add(new L.Point(tileSize, tileSize)),
			nwMap = this._map.unproject(nwPoint, this._zoom, true),
			seMap = this._map.unproject(sePoint, this._zoom, true),
			nw = this._map.options.crs.project(nwMap),
			se = this._map.options.crs.project(seMap),
			bbox = [nw.x, se.y, se.x, nw.y].join(',');
			
		var size = '&size=' + this.options.tileSize + ',' + this.options.tileSize;
		var format = '&format=' + this.agsDynamicParams.format;
        var transparent = '&transparent=' + this.agsDynamicParams.transparent;
        var imageSr = '&imageSR=' + this._map.options.crs.code.substr(5);
        var bboxSr = '&bboxSR=' + this._map.options.crs.code.substr(5);
        var url = this._url + '/export?' + 'bbox=' + bbox + size + format + transparent + imageSr + bboxSr + '&f=image';
        if (this.options.layers) {
            var layers = '&layers=' + this.agsDynamicParams.layers;
            url += layers;
        }
		if(this.agsDynamicParams.cacheBuster === true){
			url += '&rnd=' + Math.random()*10000000000000000;
		}

        return url;		
	}
});