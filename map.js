$(function() {
var g = google.maps;
var zoom;
var lat;
var lng;
var tid ="1c652Nh2j2SEGsi0ZDRzysEwf_yGEhsrUyC2miUA"
var l = ["Spanish","French","French Creole","Italian","Portuguese","Greek","Russian","Polish","Chinese","Korean","Cambodian","Vietnamese","Arabic"];
var c = l[0];
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
   c=h[3];
};

function setHash(zoom,lat,lng){
  zoom = zoom||m.getZoom();
  lat = lat||m.getCenter().lat();
  lng=lng||m.getCenter().lng();
  hash = "#"+zoom+"/"+lat+"/"+lng+"/"+c;
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
      query: {select: 'poly',from: tid},
      styles:[{
          polygonOptions:{
              fillColor:"#ff9900",
              strokeWeight:0
          }},
          {where:"'Percent "+c+"' >0.08",
           polygonOptions:{
              fillColor:"#ff0000"}}
          ,
          {where:"'Percent "+c+"' <0.04",
           polygonOptions:{
              fillColor:"#00ff00"}},
          {where:"'Percent "+c+"' <0.02",
           polygonOptions:{
              fillColor:"#0000ff"}}
          ]
     });
$('#tabs-2').append('<select id="Lang"></select>');
$.each(l,function(i,k){
  $('#Lang').append("<option value='" +k+"'>"+k+"</option>"); 
});
 $('#Lang').change(function(){
   mainLayer.setMap(null);  
   c=$('#Lang').val();
   mainLayer.setOptions({map:m,
      query: {select: 'poly',from: tid},
      styles:[{
          polygonOptions:{
              fillColor:"#ff9900",
              strokeWeight:0
          }},
          {where:"'Percent "+c+"' >0.08",
           polygonOptions:{
              fillColor:"#ff0000"}}
          ,
          {where:"'Percent "+c+"' <0.04",
           polygonOptions:{
              fillColor:"#00ff00"}},
          {where:"'Percent "+c+"' <0.02",
           polygonOptions:{
              fillColor:"#0000ff"}}
          ]
     });
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