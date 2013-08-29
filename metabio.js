jQuery(document).ready(function($) {
  markers = [];
  vertices = new Array ( );
  path = new Array ( );
  id=0;
  $('#polybut').click(startPoly);
  $('#pointbut').click(startPoint);
  $('.fieldset-title').click(function(){google.maps.event.trigger(map, "resize");map.setCenter(Quebec);});
  $(window).resize(function(){google.maps.event.trigger(map, "resize")});
  Quebec = new google.maps.LatLng(50, -73);
  map = new google.maps.Map(document.getElementById("map"), {
      zoom: 5,
      center: Quebec,
      mapTypeId: google.maps.MapTypeId.HYBRID,
      disableDoubleClickZoom: true
    });

   $('#test')
    .bind('afterShow', function() {
      alert('afterShow');
    })
    .show(1000, function() {
      alert('in show callback');
    })
    .show();
});

function startPoly(){
	 var vertex = [];
	 if (vertices.length!=0){pid=pid+1;}else{pid=0;};
    vertices[pid]=new Array ( );
	 path[pid] = new google.maps.MVCArray;
	 if (vertices.length+markers.length==0){
	 id=1;
	 }else{
	 id=id+1;
	 }
    poly = new google.maps.Polygon({
      strokeWeight: 3,
      fillColor: '#5555FF',
      editable: false
    });
    poly.setMap(map);
    poly.setPaths(new google.maps.MVCArray([path[pid]]));
    google.maps.event.clearListeners(map,'click');
    google.maps.event.addListener(map, 'click', addPoly);
    function addPoly(event) {
    path[pid].insertAt(path[pid].length, event.latLng);
    
  var icon = new google.maps.MarkerImage('http://quebio.ca/misc/icon.png',
      // This marker is 12 pixels wide by 12 pixels tall.
      new google.maps.Size(12, 12),
      // The origin for this image is 0,0.
      new google.maps.Point(0,0),
      // The anchor for this image is the base of the flagpole at 0,32.
      new google.maps.Point(6, 6));    
    
    var vertex = new google.maps.Marker({
      position: event.latLng,
      map: map,
      draggable: true,
      icon: icon
    });
    vertex.title=id;
    vertices[pid].push(vertex);
	 getCoordinates();
    google.maps.event.addListener(vertex, 'dblclick', function() {
    vertex.setMap(null);
    for (var a=0, A=vertices.length;a<A;++a){
        for (var i = 0, I = vertices[a].length; i < I; ++i){
        if (vertices[a][i] == vertex){
        vertices[a].splice(i, 1);
        ispt=a;
        }
       }
       }
       getCoordinates(); 
     for (var i = 0, I = path[ispt].length; i < I; ++i){
       if (path[ispt].getAt(i).lat()==vertex.position.lat()){
        path[ispt].removeAt(i);
        }
       }

     });
    google.maps.event.addListener(vertex, 'drag', function() {
    getCoordinates();  
    for (var b=0; b<path.length;++b){
      for (var i=0; i<path[b].length; ++i){
           if (vertices[b][i] == vertex){
              path[b].setAt(i, vertex.getPosition());
         }
      }
    }
    }
    );
  }
}

function startPoint(){
    mark = new google.maps.Marker({
    });
    mark.setMap(map);
    google.maps.event.clearListeners(map,'click');
    google.maps.event.addListener(map, 'click', addPoint);
}

function addPoint(event) {
     var marker = new google.maps.Marker({
      position: event.latLng,
      map: map,
      draggable: true
    });
	 if (vertices.length+markers.length==0){
	 id=1;
	 }else{
	 id=id+1;
	 }
    marker.title=id;
    markers.push(marker);
    getCoordinates();
    google.maps.event.addListener(marker, 'click', function() {
      marker.setMap(null);
      for (var i = 0, I = markers.length; i < I && markers[i] != marker; ++i);
      markers.splice(i, 1);
      getCoordinates();
      }
);
  }



function getCoordinates(){
document.getElementById('tbl').innerHTML="";
for (var i = 0; i < markers.length; i++ ){
 var tblBody=document.getElementById('tbl');
 var newRow=tblBody.insertRow(-1);
 var newCell0 = newRow.insertCell(0);
 newCell0.innerHTML='<input type="hidden" name="coordinates[]" value="'+markers[i].title +','+markers[i].position.lat()+','+markers[i].position.lng()+'">'+markers[i].title +','+markers[i].position.lat()+','+markers[i].position.lng()+'<br>';
}
for (var i = 0; i < vertices.length; i++ ){
 for (var p =0; p<vertices[i].length;p++){
 var tblBody=document.getElementById('tbl');
 var newRow=tblBody.insertRow(-1);
 var newCell0 = newRow.insertCell(0);
 newCell0.innerHTML='<input type="hidden" name="coordinates[]" value="'+vertices[i][p].title +','+vertices[i][p].position.lat()+','+vertices[i][p].position.lng()+'">'+vertices[i][p].title +','+vertices[i][p].position.lat()+','+vertices[i][p].position.lng()+'<br>';
}
}
var coords = jQuery("input[name='coordinates\\[\\]']").map(function(){return jQuery(this).val();}).get().join(';');
jQuery("input[name='geography']").val(coords);
}

