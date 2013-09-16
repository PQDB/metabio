/*global jQuery, window, document, self, _gaq, Drupal, google */
(function($) {

  Drupal.behaviors.metabio_map = {

    markers: [], vertices: [], path: [],
    id: 0,
    map: {}, map_center: {},

    attach: function() {
      this.createMap();
      this.loadData();
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
    },

    loadData: function() {
      var self = this,
          geoarr = $("input[name='geography']").val().split(';'),
          coord = [],
          next_id = -1,
          prev_id = -1;

      if(geoarr.length > 1) {
        $.each(geoarr, function(i) {
          coord = this.split(',');
          next_id = (geoarr[i+1]) ? geoarr[i+1].split(',')[0] : -1;
          prev_id = (geoarr[i-1]) ? geoarr[i-1].split(',')[0] : -1;
          if (coord[0] !== prev_id && coord[0] !== next_id) {
            self.addMarker(self.createPoint(coord));
          } else if (coord[0] !== prev_id && coord[0] === next_id) {
            self.createPolygon();
            self.addVertex(self.createPoint(coord), self.id);
          } else if (coord[0] === prev_id && coord[0] === next_id) {
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

      $('#polybut').click(function() { self.createPolygon(); self.startPolygon(); });
      $('#pointbut').click(function() { self.startPoint(); });
    },

    createPoint: function(coord) {
      return new google.maps.LatLng(coord[1],coord[2]);
    },

    createPolygon: function() {
      var polygon = {};

      this.incrementID();
      this.vertices[this.id] = [];
      this.path[this.id] = new google.maps.MVCArray();

      polygon = new google.maps.Polygon({
        strokeWeight: 3,
        fillColor: '#5555FF',
        editable: false
      });
      polygon.setMap(this.map);
      polygon.setPaths(new google.maps.MVCArray([this.path[this.id]]));
    },

    startPolygon: function() {
      var self = this;

      google.maps.event.clearListeners(this.map,'click');
      google.maps.event.addListener(this.map, 'click', function(e) { self.addVertex(e.latLng, self.id); });
    },

    startPoint: function() {
      var self = this,
          mark = new google.maps.Marker({});

      mark.setMap(this.map);
      google.maps.event.clearListeners(this.map,'click');
      google.maps.event.addListener(this.map, 'click', function(e) { self.addMarker(e.latLng); });
    },

    displayCoordinates: function() {
      var coordinates = $('#tbl').html(""), rows = "", coords = "", self = this;

      $.each(this.markers, function() {
        rows += self.buildCoordinateRow(this);
      });
      $.each(this.vertices, function() {
        $.each(this, function() {
          rows += self.buildCoordinateRow(this);
        });
        if(this.length > 1) {
          rows += self.buildCoordinateRow(this[0]);
        }
      });
      coordinates.append(rows);
      coords = $("input[name='coordinates\\[\\]']").map(function(){ return $(this).val(); }).get().join(';');
      $("input[name='geography']").val(coords);
    },

    buildCoordinateRow: function(data) {
      return '<tr><td><input type="hidden" name="coordinates[]" value="'+data.title +','+data.position.lat()+','+data.position.lng()+'">'+data.title +','+data.position.lat()+','+data.position.lng() + '</td></tr>';
    },

    incrementID: function() {
      this.id = (this.vertices.length + this.markers.length === 0) ? 1 : this.id + 1;
    },

    addVertex: function(position, pid) {
      var icon = {}, vertex = {};

      icon = new google.maps.MarkerImage(Drupal.settings.metabio_path + '/images/icon.png',
        new google.maps.Size(12, 12),
        new google.maps.Point(0,0),
        new google.maps.Point(6, 6)
        );

      vertex = new google.maps.Marker({
        position: position,
        map: this.map,
        draggable: true,
        icon: icon
      });
      
      this.path[pid].insertAt(this.path[pid].length, position);

      vertex.title = this.id;
      this.vertices[pid].push(vertex);
      this.displayCoordinates();

      this.addVertexListener(vertex, 'drag');
      this.addVertexListener(vertex, 'dblclick');
    },

    addVertexListener: function(vertex, type) {
      var self = this, ispt = "";

      switch(type) {
        case 'drag':
          google.maps.event.addListener(vertex, 'drag', function() {
            self.displayCoordinates();
            $.each(self.path, function(i) {
              $.each(this, function(j) {
                if(self.vertices[i][j] === vertex) { self.path[i].setAt(j, vertex.getPosition()); }
              });
            });
          });
        break;

        case 'dblclick':
          google.maps.event.addListener(vertex, 'dblclick', function() {
            vertex.setMap(null);
            $.each(self.vertices, function(i) {
              $.each(this, function(j) {
                if(vertex === this) {
                  self.vertices[i].splice(j, 1);
                  ispt = i;
                }
              });
            });
            self.displayCoordinates(); 
            $.each(self.path[ispt], function(i) {
              if(self.path[ispt].getAt(i) && self.path[ispt].getAt(i).lat() === vertex.position.lat()) {
                self.path[ispt].removeAt(i);
              }
            });
          });
        break;
      }
    },

    addMarker: function(position) {
      var marker = {};

      this.incrementID();
      marker = new google.maps.Marker({
       position: position,
       map: this.map,
       draggable: true
     });

      marker.title = this.id;

      this.markers.push(marker);
      this.addMarkerListener(marker);
      this.displayCoordinates();
    },

    addMarkerListener: function(marker) {
      var self = this;

      google.maps.event.addListener(marker, 'click', function() {
        marker.setMap(null);
        $.each(self.markers, function(i) {
          if(marker === this) { self.markers.splice(i,1); }
        });
        self.displayCoordinates();
      });
    }

  };

}(jQuery));