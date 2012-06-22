//google.load('visualization', '1', {});
$(function() {
var g = google.maps;
var zoom;
var lat;
var lng;
var langs = {
    "Spanish":{"id":"1KhAGPhfDsMVHYckfcySZ9RUZiSuE3qgHrsj8YbY"},
"French":{"id":"1xpbIRbpvruYQbnZ1oyH61L9CNNEdRQ5Vq0AuyK4"},
"Portuguese":{"id":"1Wbb-7oIrLUMZ60r9DEn3zAuzjW0SHP2venVyHD4"},
"Chinese":{"id":"1pFgXzqn0jwsEEQQmlKSPSQRpB_Q2Xj5NvbTtBMc"},
"Italian":{"id":"1shFONnSwa1Fc8HUOdOdGmY8ieTAIuO6onAm2OVc"}
};
var l = "Spanish";
var hash = document.location.hash;
if(!hash){
 lat = 41.914541;
 lng = -71.592407;
 zoom = 8;
 setHash(zoom,lat,lng);
}else if(!!hash){
   var h = hash.slice(1).split("/");
   zoom = parseInt(h[0]);
   lat = parseFloat(h[1]);
   lng=parseFloat(h[2]);
   l=h[3];
};

function setHash(zoom,lat,lng){
  zoom = zoom||m.getZoom();
  lat = lat||m.getCenter().lat();
  lng=lng||m.getCenter().lng();
  hash = "#"+zoom+"/"+lat+"/"+lng+"/"+l;
  document.location.hash=hash;
}
function changeHash(){
 setHash();   
}
$( "#tabs" ).tabs({
    collapsible: true,
    selected: -1
});
          
$( "input:submit,input:reset" ).button();

$('input, textarea').placeholder();

var m = new g.Map(document.getElementById('map'), {
    center: new g.LatLng(lat,lng),
    zoom: zoom,
    mapTypeId: 'roadmap'
});
g.event.addListener(m, 'center_changed',changeHash);
g.event.addListener(m, 'zoom_changed',changeHash);
var mainLayer = new g.FusionTablesLayer({map:m,
      query: {select: 'poly',from: langs[l].id}
     });
$('#tabs-2').append('<select id="Lang"></select>');
$.each(langs,function(k){
  $('#Lang').append("<option value='" +k+"'>"+k+"</option>"); 
});
 $('#Lang').change(function(){
   mainLayer.setMap(null);  
   l=$('#Lang').val();
   mainLayer.setOptions({
      query: {select: 'poly',from: langs[l].id}
     });
     mainLayer.setMap(m);
     changeHash();
 });
geocoder();
function geocoder(geof,addrf,resetf){
    var ozoom = m.getZoom();
    var ocenter = m.getCenter();
    var gc = new g.Geocoder();
    geof = geof||'geocode';
    addrf = addrf||'address';
    resetf = resetf||'resetgeo';
    gc.geomarker = new g.Marker();
    var geoinfo = new g.InfoWindow();
    $('#' + geof).click(function(){
        gc.geocode( { 'address': $("#" + addrf).val()}, function(results, status) {
            if (status == g.GeocoderStatus.OK) {
                var r = results[0];
                m.setCenter(r.geometry.location);
                m.setZoom(14);
                gc.geomarker.content = "<div class='geoinfo'>Formatted address:<br/>"+r.formatted_address+"</div>";
                gc.geomarker.setPosition(r.geometry.location); 
                gc.geomarker.setMap(m);
                g.event.addListener(gc.geomarker, 'click',function(){
                                geoinfo.setContent(gc.geomarker.content);
                              geoinfo.open(m,gc.geomarker);
        					});
            } else {
                alert("Geocode was not successful for the following reason: " + status);
            }
        });
    });

    $('#' + resetf).click(function(){
        m.setCenter(ocenter);
        m.setZoom(ozoom);
        gc.geomarker.setMap(null);
    });
};

});