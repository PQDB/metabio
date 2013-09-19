/*global jQuery, window, document, self, _gaq, Drupal, google */
(function($) {

  Drupal.behaviors.metabio_map = {

    map: {}, map_center: {}, marker_icon: {}, polygon_icon: {},
    markers: [], polygons: [], polygon_vertices: [],
    geography: "",

    attach: function() {
      this.geography = $("input[name='geography']");
      this.createMap();
      this.readGeoJSON();
      this.attachEvents();
    },

    createMap: function() {
      this.map_center = new google.maps.LatLng(50, -73);
      this.map = new google.maps.Map($("#map")[0], {
        zoom: 5,
        center: this.map_center,
        mapTypeId: google.maps.MapTypeId.HYBRID,
        disableDoubleClickZoom: true
      });
      this.marker_icon = {
        url: Drupal.settings.metabio_path + '/images/red-dot.png',
        origin: new google.maps.Point(0,0)
      };
      this.polygon_icon = {
        url: Drupal.settings.metabio_path + '/images/icon.png',
        size: new google.maps.Size(12, 12),
        origin: new google.maps.Point(0,0),
        anchor: new google.maps.Point(6, 6)
      };
    },

    readGeoJSON: function() {
      var self = this,
      geojson = (this.geography.val().length > 0) ? $.parseJSON(this.geography.val()) : { features : []},
      polygon = {};

      $.each(geojson.features, function() {
        switch (this.geometry.type) {
          case 'Point':
          self.addMarker(self.createPoint(this.geometry.coordinates));
          break;

          case 'Polygon':
          polygon = self.createPolygon();
          this.geometry.coordinates[0].pop();
          $.each(this.geometry.coordinates[0], function() {
            self.addVertex(polygon, self.createPoint(this));
          });
          break;
        }
      });
    },

    attachEvents: function() {
      var self = this,
      polygon = {};

      $('#edit-site-details').find("legend a").click(function() {
        google.maps.event.trigger(self.map, "resize");
        self.map.setCenter(self.map_center);
      });
      $(window).resize(function() {
        google.maps.event.trigger(self.map, "resize");
      });
      $('#polybut').click(function(e) {
        e.preventDefault();
        self.changeCursor();
        polygon = self.createPolygon();
        self.startPolygon(polygon);
      });
      $('#pointbut').click(function(e) {
        e.preventDefault();
        self.changeCursor();
        self.startPoint();
      });
      $('#inputcoordsbut').click(function(e) {
        e.preventDefault();
        self.addCoordinates();
      });
      $('#metabio-clear').click(function(e) {
        e.preventDefault();
        self.clearOverlays();
      });
    },
    
    changeCursor: function() {
      this.map.setOptions({draggableCursor:'crosshair'});
    },

    createPoint: function(coord) {
      return new google.maps.LatLng(coord[1],coord[0]);
    },

    createPolygon: function() {
      var polygon = {},
      paths = new google.maps.MVCArray();

      polygon = new google.maps.Polygon({
        strokeWeight: 3,
        fillColor: '#5555FF',
        editable: false
      });
      polygon.setMap(this.map);
      polygon.setPaths(new google.maps.MVCArray([paths]));
      this.polygons.push(polygon);
      return polygon;
    },

    startPolygon: function(polygon) {
      var self = this;

      google.maps.event.clearListeners(this.map, 'click');
      google.maps.event.addListener(this.map, 'click', function(e) { self.addVertex(polygon, e.latLng); });
    },

    startPoint: function() {
      var self = this,
      mark = new google.maps.Marker({});

      mark.setMap(this.map);
      google.maps.event.clearListeners(this.map, 'click');
      google.maps.event.addListener(this.map, 'click', function(e) { self.addMarker(e.latLng); });
    },

    buildGeoJSON: function() {
      var self = this,
      geojson = {
        type : "FeatureCollection",
        features: []
      };

      $.each(this.markers, function() {
        geojson.features.push(self.buildFeature(this, "Point"));
      });

      $.each(this.polygons, function() {
        geojson.features.push(self.buildFeature(this.getPath().getArray(), "Polygon"));
      });

      this.geography.val(JSON.stringify(geojson));
    },

    buildFeature: function(data, type) {
      var coords = [];
      
      switch(type) {
        case 'Point':
        coords.push(data.position.lng());
        coords.push(data.position.lat());
        break;
        
        case 'Polygon':
        coords.push([]);
        $.each(data, function() {
          coords[0].push([this.lng(), this.lat()]);
        });
        coords[0].push([data[0].lng(), data[0].lat()]);
        break;
      }

      return { type: "Feature", geometry: { type : type, coordinates : coords }, properties: {} };
    },

    addVertex: function(polygon, position) {
      var vertex = this.createMarker(position, this.polygon_icon),
      path = polygon.getPath();

      path.insertAt(path.length, position);
      this.polygon_vertices.push(vertex);
      this.buildGeoJSON();

      this.addVertexListener(path, vertex, path.length-1, 'drag');
      this.addVertexListener(path, vertex, path.length-1, 'dblclick');
    },

    addVertexListener: function(path, vertex, index, type) {
      var self = this;

      switch(type) {
        case 'drag':
        google.maps.event.addListener(vertex, 'drag', function() {
          path.setAt(index, vertex.getPosition());
          self.buildGeoJSON();
        });
        break;

        case 'dblclick':
        google.maps.event.addListener(vertex, 'dblclick', function() {
          vertex.setMap(null);
          path.removeAt(index);
          self.buildGeoJSON();
        });
        break;
      }
    },

    createMarker: function(position, icon) {
      return new google.maps.Marker({
       position: position,
       map: this.map,
       draggable: true,
       icon: icon
     });
    },

    addMarker: function(position) {
      var marker = {};

      marker = this.createMarker(position, this.marker_icon);
      this.markers.push(marker);
      this.buildGeoJSON();
      this.addMarkerListener(marker);
    },

    addMarkerListener: function(marker) {
      var self = this;

      google.maps.event.addListener(marker, 'click', function() {
        marker.setMap(null);
        $.each(self.markers, function(i) {
          if(marker === this) {
            self.markers.splice(i,1);
            self.buildGeoJSON();
          }
        });
      });
    },

    addCoordinates: function() {
      var self = this,
          coordinate_list = $('#inputcoords'),
          coordinate_error = $('#coorderror').hide();

      coordinate_error.find("span").remove();
      $.ajax({
        url: Drupal.settings.metabio_callback_base_url + "/coordinate_conversion/",
        data: { coordinates : coordinate_list.val() },
        type: "POST",
        success: function(result){
          $.each(result, function(key,value) {
            if(this.status === "fail") {
              coordinate_error.append("<span>"+key+"</span>").show();
            } else {
              self.addMarker(self.createPoint(value.converted.reverse()));
            }
          });
          coordinate_list.val("");
        }
      });
    },
    
    clearOverlays: function() {
      var self = this;
      
      $.each(this.markers, function() {
        this.setMap(null);
      });
      
      $.each(this.polygons, function() {
        this.getPath().clear();
      });
      
      $.each(this.polygon_vertices, function() {
        this.setMap(null);
      });
      
      this.markers = [];
      this.polygons = [];
      this.polygon_vertices = [];
      this.geography.val("");
    }

  };

}(jQuery));