;(function($) {

  Drupal.behaviors.metabio = {

    markers: [], vertices: [], path: [],
    id: 0,
    map: {}, map_center: {},

    attach: function() {
      this.prepareMap();
      this.createMap();
      this.attachEvents();
      this.addTaxonomy();
      this.fillTaxoTable();
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

      $('.fieldset-title').click(function() {
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
      var self = this,
      marker = new google.maps.Marker({
       position: e.latLng,
       map: this.map,
       draggable: true
     });

      marker.title = this.id;

      this.markers.push(marker);
      this.addMarkerListener(marker);
      this.incrementID();
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

    addTaxonomy: function(){
      $('#edit-taxonomic-details-input').keypress(function(event) {
        e=event;
        var keyCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
        if( keyCode == 13 ) {
          sp=$('#edit-taxonomic-details-input').val();
          $('#taxotbl').append('<tr><td><input type="hidden" name="taxo[]" value="'+sp+'">' + sp + '</td><td><button class="taxodel" type="button" style="border:none;">x</button> </td></tr>');
          $('.taxodel').click(function(){
            $(this).parent('td').parent('tr').remove();
            refreshTaxonomy();
          })
          $('#edit-taxonomic-details-input').val('');
          refreshTaxonomy();
          if(!e) var e = window.event;
          e.cancelBubble = true;
          e.returnValue = false;
          if (e.stopPropagation) {
            e.stopPropagation();
            e.preventDefault();
          }
          return false;
        }

      })
    },

    fillTaxoTable: function(){
      taxoin=$("input[name='taxonomic_details']").val().split('|');
      if(taxoin!=""){
        lt=taxoin.length;
        for(i=0;i<lt;i++){
          $('#taxotbl').append('<tr><td><input type="hidden" name="taxo[]" value="'+taxoin[i]+'">' + taxoin[i] + '</td><td><button class="taxodel" type="button" style="border:none;">x</button> </td></tr>'); 
        }
      }
      $('.taxodel').click(function(){
        $(this).parent('td').parent('tr').remove();
        refreshTaxonomy();
      })
    }
  };
  function refreshTaxonomy(){
    taxod = $("input[name='taxo\\[\\]']").map(function(){ return $(this).val(); }).get().join('|');
    $("input[name='taxonomic_details']").val(taxod);
  }


}(jQuery));