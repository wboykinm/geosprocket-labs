
//Requires jquery for jsonp
//test
L.AgsFeatureLayer = L.FeatureGroup.extend({
    includes: L.Mixin.Events,

    options: {
        definitionQuery: '' //not implemented
    },

    initialize: function (url, options) {
        L.Util.setOptions(this, options);
        //always ask for OBJECTID
        if (this.options.outFields.indexOf() === -1) { this.options.outFields.push('OBJECTID'); }
        this._url = url;
        this._layers = {};
        this._pointToLayerFunc = options.pointToLayerFunc || function (point) { return new L.Marker(point); };
    },

    onAdd: function (map) {
        this._map = map;

        if (this.options.visible) {

            this._updateLayer();

            //map.on('viewreset', this._reset, this);
            map.on('moveend', this._moveEnd, this);
            map.on('zoomend', this._zoomEnd, this);
        }
    },

    onRemove: function (map) {
        this._reset();
        //map.off('viewreset', this._reset, this);
        map.off('moveend', this._moveEnd, this);
        map.off('zoomend', this._zoomEnd, this);
    },

    openPopup: function (oid) {
        //find the marker
        var marker = this._findLayer(oid);

        //open its popup
        if (marker) {
            marker.openPopup();
        }
    },

    show: function () {
        this._updateLayer();

        //this._map.on('viewreset', this._reset, this);
        this._map.on('moveend', this._moveEnd, this);
        this._map.on('zoomend', this._zoomEnd, this);
    },

    hide: function () {
        //this._map.off('viewreset', this._reset, this);
        this._map.off('moveend', this._moveEnd, this);
        this._map.off('zoomend', this._zoomEnd, this);

        this.clearLayers();
    },

    _reset: function () {
        this.clearLayers();
    },

    _findLayer: function (oid) {
        //NOTE: this doesn't work in mobile safari
        var result;
        for (var l in this._layers) {
            if (this._layers.hasOwnProperty(l)) {
                result = this._layers[l];
                if (l.oid === oid) {
                    break;
                }
            }
        }
        return result;
    },

    _updateLayerCallback: function (data, status, jqXhr) {
        var feat;
        if (data.features) {
            for (var i = 0, len = data.features.length; i < len; i++) {
                feat = data.features[i];
                //todo: keep track of which one's we have and only add new ones (get rid of clearLayers call in _updateLayer)
                if (feat.geometry) {
                    var layer = this._pointToLayer(feat, data.fields);
                    layer.oid = feat.attributes.OBJECTID;
                    this.addLayer(layer);
                }
            }
        }
    },

    _updateLayer: function () {
        this.clearLayers();

        var bnds = this._map.getBounds();
        //bboxsr & imagesr params need to be specified like so to avoid alignment problems on some map services - not sure why
        var geometry = 'geometry=' + bnds.getSouthEast().lng + ',' + bnds.getSouthEast().lat + ',' + bnds.getNorthWest().lng + ',' + bnds.getNorthWest().lat + '&geometrytype=esriGeometryEnvelope&inSr=4326&outSR=4326&returnGeometry=true';

        var outFields = '&outFields=' + this.options.outFields.join();

        var url = this._url + '/query?' + geometry + outFields + '&f=json';

        //todo: use leaflet methods for this... if there are any
        $.ajax({
            url: url,
            dataType: 'jsonp',
            success: this._updateLayerCallback,
            error: function (jqXhr, status, err) { alert('error getting feature json.'); },
            context: this
        });
    },

    _moveEnd: function () {
        this._updateLayer();
    },

    _zoomEnd: function () {
        this._updateLayer();
    },

    _pointToLayer: function (feature, fields) {
        var point = new L.LatLng(feature.geometry.y, feature.geometry.x);
        return this._pointToLayerFunc(point, feature, fields);
    }
});