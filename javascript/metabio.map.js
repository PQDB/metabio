/*global jQuery, window, document, self, _gaq, Drupal, google */
(function($) {

  Drupal.behaviors.metabio_map = {

    map: {}, map_center: {}, marker_icon: {}, polygon_icon: {},
    markers: [], polygons: [], polygon_vertices: [],infowindows: [],
    geography: "", polybounds:[],

    attach: function() {
      this.geography = $("input[name='geography']");
      this.createMap();
      this.readGeoJSON();
      this.attachEvents();
    },

    createMap: function() {
      this.map_center = new google.maps.LatLng(50, -73);
      maptype=(this.isEditMode())?google.maps.MapTypeId.HYBRID:google.maps.MapTypeId.ROADMAP;
      this.map = new google.maps.Map($("#map")[0], {
        zoom: 5,
        center: this.map_center,
        mapTypeId: maptype,
        disableDoubleClickZoom: (this.isEditMode())?true:false,
      });
      this.bounds = new google.maps.LatLngBounds();
      this.marker_icon = {
        url: Drupal.settings.metabio_path + '/images/database.png',
        origin: new google.maps.Point(0,0)
      };
      this.polygon_icon = {
        url: Drupal.settings.metabio_path + '/images/icon.png',
        size: new google.maps.Size(12, 12),
        origin: new google.maps.Point(0,0),
        anchor: new google.maps.Point(6, 6)
      };
      this.polygon_icon_view = {
        url: Drupal.settings.metabio_path + '/images/icon_view.png',
        size: new google.maps.Size(3, 3),
        origin: new google.maps.Point(0,0),
        anchor: new google.maps.Point(2, 2)
      };
    },

    readGeoJSON: function() {
      var self = this,
          geojson = (this.geography.val().length > 0) ? $.parseJSON(this.geography.val()) : { features : []};
          /*polygon = {};*/
      $.each(geojson.features, function() {
        contentString=this.properties.infowin;

        switch (this.geometry.type) {
          case 'Point':
            self.addMarker(self.createPoint(this.geometry.coordinates),contentString,false,false);
          break;
          case 'Polygon':
            polygon = self.createPolygon();
            this.geometry.coordinates[0].pop();
            self.polybounds = new google.maps.LatLngBounds();
            $.each(this.geometry.coordinates[0], function() {
               self.addVertex(polygon, self.createPoint(this),false);
            });
            //self.createPolyInfoWindow(polygon,contentString);
            self.addMarker(self.createPoint([self.polybounds.getCenter().lng(),self.polybounds.getCenter().lat()]),contentString,polygon,false);
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
      $('li.vertical-tab-button').find("a").click(function() {
        google.maps.event.trigger(self.map, "resize");
        self.map.setCenter(self.map_center);
        self.map.fitBounds(self.bounds);
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
      $('#addbynamebut').click(function(e) {
        e.preventDefault();
        self.addByName();
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
      if(this.isEditMode()) {
        strokeColor= '#000000';
        strokeOpacity= 3;
        fillOpacity=0.6;
      } else {
        strokeColor= '#ffc600';
        strokeOpacity= 2;
        fillOpacity=0.6;
      }
      polygon = new google.maps.Polygon({
        strokeWeight: 3,
        strokeColor: strokeColor,
        strokeOpacity: strokeOpacity,
        fillColor: '#ffc600',
        fillOpacity: fillOpacity,
        editable: false
      });
      if (this.isEditMode() | !this.isGlobalMap()){
        polygon.setMap(this.map);
      }
      polygon.setPaths(new google.maps.MVCArray([paths]));
      this.polygons.push(polygon);
      return polygon;
    },

    startPolygon: function(polygon) {
      var self = this;
      google.maps.event.clearListeners(this.map, 'click');
      google.maps.event.addListener(this.map, 'click', function(e) { self.addVertex(polygon, e.latLng,true); });
    },

    startPoint: function() {
      var self = this,
      mark = new google.maps.Marker({});

      mark.setMap(this.map);
      google.maps.event.clearListeners(this.map, 'click');
      google.maps.event.addListener(this.map, 'click', function(e) { self.addMarker(e.latLng,null,false,true); });
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

    addVertex: function(polygon, position, click_button) {
      if(this.isEditMode()){
        icon=this.polygon_icon;
       var vertex = this.createMarker(position, icon);
       this.polygon_vertices.push(vertex);
     }
     path = polygon.getPath();
     path.insertAt(path.length, position);

      if(this.isEditMode()) {
        if(click_button===true){
        this.buildGeoJSON();
        }
        this.addVertexListener(path, vertex, path.length-1, 'drag');
        this.addVertexListener(path, vertex, path.length-1, 'dblclick');
      }
      this.bounds.extend(position);
      this.polybounds.extend(position);
      this.map.fitBounds(this.bounds);
      return this.polybounds;
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
        draggable: (this.isEditMode()) ? true : false,
        icon: icon
      });
    },

    createInfoWindow: function(contentString) {
      return new google.maps.InfoWindow({
        content: contentString,
        maxWidth: 250
      });
    },

    addMarker: function(position,contentString,poly,click_button) {
      var marker = {};
      var infowindow = {};
      infowindow = this.createInfoWindow(contentString);
      marker = this.createMarker(position, this.marker_icon);
      this.markers.push(marker);
      this.infowindows.push(infowindow);
      this.bounds.extend(position);
      this.map.fitBounds(this.bounds);
      if(this.isEditMode()) {
        if(click_button==true){
          this.buildGeoJSON();
        }
        this.addMarkerListener(marker);
      }else{
        this.addMarkerInfoWindowListener(marker,infowindow);
        if(poly && this.isGlobalMap()){
          this.addPolygonMarkerListener(marker,poly);
        }
      }
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

    addPolygonMarkerListener: function(marker,poly) {
      var self = this;
      google.maps.event.addListener(marker, 'mouseover', function() {
        poly.setMap(this.map);
      });
      google.maps.event.addListener(marker, 'mouseout', function() {
        poly.setMap(null);
      });
    },


    addMarkerInfoWindowListener: function(marker,infowindow) {
      var self = this;
      google.maps.event.addListener(marker, 'click', function() {
        $.each(self.infowindows, function() {
           this.close();
        });
        $.each(self.polygons, function() {
            this.setOptions({fillColor: "#ffff00",fillOpacity:0.5})
          });
        infowindow.open(this.map,marker);
      });
    },

    createPolyInfoWindow: function (poly,content) {
        var self = this;
        poly.set("Info", content);
        google.maps.event.addListener(poly, 'click', function(event) {
          $.each(self.infowindows, function() {
            this.close();
          });
          $.each(self.polygons, function() {
            this.setOptions({fillColor: "#ffff00",fillOpacity:0.5})
          });
          this.setOptions({fillColor: "#ffff00",fillOpacity:0.8});
          var infoWindow = new google.maps.InfoWindow();
          infoWindow.setContent(poly.get("Info"));
          infoWindow.setPosition(event.latLng);     
          infoWindow.open(this.map);
          self.infowindows.push(infoWindow);
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
              self.addMarker(self.createPoint(value.converted.reverse()),null,false,true);
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
    },

    isEditMode: function() {
      if(Drupal.settings.hasOwnProperty('metabio_mode') && Drupal.settings.metabio_mode === 'edit') {
        return true;
      } else {
        return false;
      }
    },

    isGlobalMap: function() {
      if(Drupal.settings.hasOwnProperty('metabio_globalmap') && Drupal.settings.metabio_globalmap === 'yes') {
        return true;
      } else {
        return false;
      }
    },

    addByName: function() {
      var geocoder = new google.maps.Geocoder(),
          locname = $("input[name='location_name']").val();

      this.geocodePosition(locname,geocoder);
    },

    geocodePosition: function(address,geocoder) {
      var self = this,
      noloc = $('#noloc');

      geocoder.geocode( {'address': address}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          noloc.hide();
          self.addMarker(results[0].geometry.location,null,false,true);
        } else {
          noloc.show(); 
        }
      });
    }

  };

}(jQuery));