/*global jQuery, window, document, self, _gaq, Drupal, google */
(function($) {

  Drupal.behaviors.metabio_map = {

    map: {}, map_center: {}, marker_icon: {}, polygon_icon: {},
    id: 0,
    markers: [], polygon_paths: [],
    geography: {},

    attach: function() {
      this.geography = $("input[name='geography']");
      this.createMap();
      this.buildMapElements();
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

    buildMapElements: function() {
      var self = this,
      geoarr = this.geography.val().split('\n'),
      coord = [],
      next_id = -1,
      prev_id = -1;

      if(geoarr.length > 1) {
        $.each(geoarr, function(i) {
          coord = this.split(',');
          next_id = (geoarr[i+1]) ? geoarr[i+1].split(',')[0] : -1;
          prev_id = (geoarr[i-1]) ? geoarr[i-1].split(',')[0] : -1;
          if (coord[0] !== prev_id && coord[0] !== next_id) { //add markers
            self.addMarker(self.createPoint(coord));
          } else if (coord[0] !== prev_id && coord[0] === next_id) { //create a polygon and add first vertex
            self.createPolygon();
            self.addVertex(self.createPoint(coord), self.id);
          } else if (coord[0] === prev_id && coord[0] === next_id) { //add vertices, last vertex is same as first so not needed
            self.addVertex(self.createPoint(coord), self.id);
          }
        });
      }
    },

    attachEvents: function() {
      var self = this;

      $('#edit-site-details').find("legend a").click(function() {
        google.maps.event.trigger(self.map, "resize");
        self.map.setCenter(self.map_center);
      });
      $(window).resize(function() {
        google.maps.event.trigger(self.map, "resize");
      });
      $('#inputcoordsbut').click(function(e) {
        e.preventDefault();
        coordinate_list=$('#inputcoords').val();
        $.ajax({
          url: Drupal.settings.metabio_callback_base_url + "/coordinate_conversion/",
          data: { coordinates:coordinate_list },
          dataType: "json",
          type: "POST",
          success: function(result){
            $.each(result,function(){
              self.addMarker(self.createPoint([this.split(', ')[1], this.split(', ')[0]]));
            });
          }});
      });
      $('#polybut').click(function(e) {
        e.preventDefault();
        self.changeCursor();
        self.createPolygon();
        self.startPolygon();
      });
      $('#pointbut').click(function(e) {
        e.preventDefault();
        self.changeCursor();
        self.startPoint();
      });
    },
    
    changeCursor: function() {
      this.map.setOptions({draggableCursor:'crosshair'});
    },

    createPoint: function(coord) {
      return new google.maps.LatLng(coord[1],coord[2]);
    },

    createPolygon: function() {
      var polygon = {};

      this.incrementID();
      this.polygon_paths[this.id] = new google.maps.MVCArray();
      this.polygon_paths[this.id].metabio_title = this.id;

      polygon = new google.maps.Polygon({
        strokeWeight: 3,
        fillColor: '#5555FF',
        editable: false
      });
      polygon.setMap(this.map);
      polygon.setPaths(new google.maps.MVCArray([this.polygon_paths[this.id]]));
    },

    startPolygon: function() {
      var self = this;

      google.maps.event.clearListeners(this.map, 'click');
      google.maps.event.addListener(this.map, 'click', function(e) { self.addVertex(e.latLng); });
    },

    startPoint: function() {
      var self = this,
      mark = new google.maps.Marker({});

      mark.setMap(this.map);
      google.maps.event.clearListeners(this.map, 'click');
      google.maps.event.addListener(this.map, 'click', function(e) { self.addMarker(e.latLng); });
    },

    recordCoordinates: function() {
      var self = this, metabio_title = "", coords = [], first = {};

      $.each(this.markers, function() {
        coords.push(self.buildCoordinate(this));
      });

      $.each(this.polygon_paths, function() {
        if(this.hasOwnProperty('metabio_title')) {
          metabio_title = this.metabio_title;
          $.each(this.getArray(), function() {
            this.metabio_title = metabio_title;
            coords.push(self.buildCoordinate(this));
          });
          if(this.length > 1) {
            first = this.getArray()[0];
            first.metabio_title = metabio_title;
            coords.push(self.buildCoordinate(first));
          }
        }
      });
      this.geography.val(coords.join("\n"));
    },

    buildCoordinate: function(data) {
      var lat = (data.hasOwnProperty('position')) ? data.position.lat() : data.lat(),
      lng = (data.hasOwnProperty('position')) ? data.position.lng() : data.lng();

      return data.metabio_title + ',' + lat + ',' + lng;
    },

    incrementID: function() {
      this.id = (this.markers.length + this.polygon_paths.length === 0) ? 1 : this.id + 1;
    },

    addVertex: function(position) {
      var vertex = this.createMarker(position, this.polygon_icon),
      path_index = this.polygon_paths[this.id].length;

      this.polygon_paths[this.id].insertAt(path_index, position);
      this.recordCoordinates();

      this.addVertexListener(this.id, vertex, path_index, 'drag');
      this.addVertexListener(this.id, vertex, path_index, 'dblclick');
    },

    addVertexListener: function(path, vertex, index, type) {
      var self = this;

      switch(type) {
        case 'drag':
        google.maps.event.addListener(vertex, 'drag', function() {
          self.polygon_paths[path].setAt(index, vertex.getPosition());
          self.recordCoordinates();
        });
        break;

        case 'dblclick':
        google.maps.event.addListener(vertex, 'dblclick', function() {
          vertex.setMap(null);
          self.polygon_paths[path].removeAt(index);
          self.recordCoordinates();
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

      this.incrementID();
      marker = this.createMarker(position, this.marker_icon);
      marker.metabio_title = this.id;
      this.markers.push(marker);
      this.recordCoordinates();

      this.addMarkerListener(marker);
    },

    addMarkerListener: function(marker) {
      var self = this;

      google.maps.event.addListener(marker, 'click', function() {
        marker.setMap(null);
        $.each(self.markers, function(i) {
          if(marker === this) {
            self.markers.splice(i,1);
            self.recordCoordinates();
          }
        });
      });
    }

  };

}(jQuery));