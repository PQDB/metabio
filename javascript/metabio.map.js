;(function($) {

  Drupal.behaviors.metabio_map = {

    markers: [], vertices: [], path: [],
    id: 0,
    map: {}, map_center: {},

    attach: function() {
      this.prepareMap();
      this.createMap();
      this.attachEvents();
      this.fillMap();
    },

    prepareMap: function() {
      var self = this;

      $('#polybut').click(function() { self.startPoly(); });
      $('#pointbut').click(function() { self.startPoint(); });
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
    
    attachEvents: function() {
      var self = this;

      $('#edit-site-details').find("legend a").click(function() {
        google.maps.event.trigger(self.map, "resize");
        self.map.setCenter(self.map_center);
      });
      $(window).resize(function() {
        google.maps.event.trigger(self.map, "resize");
      });
    },

    startPoly: function() {
      var vertex = [],
      pid = 0,
      poly = {},
      self = this;

      if(this.vertices.length > 0) { pid += 1; }
      this.vertices[pid] = [];
      this.path[pid] = new google.maps.MVCArray;
      this.incrementID();

      poly = new google.maps.Polygon({
        strokeWeight: 3,
        fillColor: '#5555FF',
        editable: false
      });
      poly.setMap(this.map);
      poly.setPaths(new google.maps.MVCArray([this.path[pid]]));
      google.maps.event.clearListeners(this.map,'click');
      google.maps.event.addListener(this.map, 'click', function(e) { self.addPoly(e, pid); });
    },

    startPoint: function() {
      var self = this,
      mark = new google.maps.Marker({});

      mark.setMap(this.map);
      google.maps.event.clearListeners(this.map,'click');
      google.maps.event.addListener(this.map, 'click', function(e) { self.addMarker(e); });
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

    addPoly: function(e, pid) {
      var self = this, icon = {}, vertex = {}, ispt = 0;

      icon = new google.maps.MarkerImage(Drupal.settings.metabio_path + '/images/icon.png',
        new google.maps.Size(12, 12),
        new google.maps.Point(0,0),
        new google.maps.Point(6, 6)
        );

      vertex = new google.maps.Marker({
        position: e.latLng,
        map: this.map,
        draggable: true,
        icon: icon
      });
      
      this.path[pid].insertAt(this.path[pid].length, e.latLng);

      vertex.title = this.id;
      this.vertices[pid].push(vertex);
      this.displayCoordinates();
      
      this.addVertexListener(vertex, 'drag');
      this.addVertexListener(vertex, 'dblclick');
    },
    
    addVertexListener: function(vertex, type) {
      var self = this;
      
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

    addMarker: function(e) {
      this.incrementID();
      var self = this,
      marker = new google.maps.Marker({
       position: e.latLng,
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
    },

    fillMap: function(){
      self=this;
      geoarr=$("input[name='geography']").val().split(';');
      if (geoarr[0]!=''){
        k=0;
        kk=0;
        $.each(geoarr,function() {
          this.id=geoarr[k].split(',')[0];
            if (this.split(',')[0]!=geoarr[k+1].split(',')[0] & kk==0) {  //marker
              $('#pointbut').trigger('click');
              kk=0;
              add=1;
            }else if (this.split(',')[0]==geoarr[k+1].split(',')[0] & kk==0){ // new polygon
              $('#polybut').trigger('click');
              kk=1;
              add=1;
            }else if (this.split(',')[0]!=geoarr[k+1].split(',')[0] & kk==1){ //end of polygon
              kk=0;
              add=0; // don't add vertex
            }else{ // middle of polygon
              add=1;
            }
            if (add==1){
              var event = jQuery.Event("click");
              event.latLng=new google.maps.LatLng(geoarr[k].split(',')[1],geoarr[k].split(',')[2]);
              google.maps.event.trigger(self.map,"click",event);
            }
            k=k+1;
          });
        google.maps.event.clearListeners(this.map,'click');
      }
    }
  }
}(jQuery));