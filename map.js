google.load('visualization', '1.0', {'packages':['corechart','table']});
$(function() {
var g = google.maps;
var zoom;
var lat;
var lng;
var iw = new g.InfoWindow();;
var ids ={"out":"1ec6BVaXU7xnCawVZvbh22ARd0KQ8bYs1LUMsCfk",
"in":"1c652Nh2j2SEGsi0ZDRzysEwf_yGEhsrUyC2miUA",
"status":""};
var l = ["Spanish","French","French Creole","Italian","Portuguese","Greek","Russian","Polish","Chinese","Korean","Cambodian","Vietnamese","Arabic"];
var c = l[0];
var hash = document.location.hash;
if(!hash){
 lat = 42.39405101407922;
 lng = -71.21063209765622;
 zoom = 8;
 ids.status="out";
 setHash(zoom,lat,lng);
}else if(!!hash){
   var h = hash.slice(1).split("/");
   zoom = parseInt(h[0]);
   lat = parseFloat(h[1]);
   lng=parseFloat(h[2]);
   c=h[3];
   ids.status=oi(zoom);
};
function oi(z){
var o="out";
if(z>9){
o="in" 
}
return o;
}
function setHash(zoom,lat,lng){
  zoom = zoom||m.getZoom();
  lat = lat||m.getCenter().lat();
  lng=lng||m.getCenter().lng();
  hash = "#"+zoom+"/"+lat+"/"+lng+"/"+c;
  document.location.hash=hash;
}
function changeHash(){
 setHash();
changeStatus();
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
var mainLayer = new g.FusionTablesLayer({map:m,suppressInfoWindows:true,
      query: {select: 'poly',from: ids[ids.status]},
      styles:getStyle(c)
     });
g.event.addListener(mainLayer,"click",infoW);
$('#tabs-2').append('<select id="Lang"></select>');
$.each(l,function(i,k){
if(k==c){
$('#Lang').append("<option value='" +k+"' selected='selected'>"+k+"</option>"); 
}else{
  $('#Lang').append("<option value='" +k+"'>"+k+"</option>"); 
  }
});
 $('#Lang').change(function(){
   mainLayer.setMap(null);  
   c=$('#Lang').val();
   mainLayer.setOptions({map:m,suppressInfoWindows:true,
      query: {select: 'poly',from: ids[ids.status]},
      styles:getStyle(c)
     });
      changeHash();
      changeLegend();
 });
function changeLegend(){
$('#legend').empty().append("<b>Percent who speak<br/>"+c+" but not English</b><ul><li class='o-lightblue'>Less Then 1%</li><li class='o-darkblue'>1%-2%</li><li class='o-yellow'>2%-3%</li><li class='o-green'>3%-4%</li><li class='o-orange'>4%-6%</li><li class='o-red'>Greater then 6%</li></ul>");
}
changeLegend();
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
function getStyle(c){
return [
          {where:"'Percent "+c+"' <0.06",
           polygonOptions:{
              fillColor:"#ff9900"}}
          ,
          {where:"'Percent "+c+"' <0.04",
           polygonOptions:{
              fillColor:"#006600"}},
              {where:"'Percent "+c+"' <0.03",
           polygonOptions:{
              fillColor:"#ffff00"}},
          {where:"'Percent "+c+"' <0.02",
           polygonOptions:{
              fillColor:"#0000ff"}},
              {where:"'Percent "+c+"' <0.01",
           polygonOptions:{
              fillColor:"#00ffff"}}
          ];

}
function changeStatus(){
var z = m.getZoom();
var s=oi(z);
if(ids.status!=s){
ids.status = s;
mainLayer.setOptions({map:m,
      query: {select: 'poly',from: ids[ids.status]},
      styles:getStyle(c)
     });
}
}
function infoW(d){

 var e= "<div id='iwindow'><select id='tog'><option value='chart'>Pie Chart</option><option value='table'>Sortable Grid</option></select><div id='iw'></div></div>";
iw.setOptions({

map:m,
content:e,
position:d.latLng}
);
g.event.addListener(iw, 'domready', function() {

var r = new google.visualization.DataTable();
r.addColumn('string','Language');
r.addColumn('number','Speakers');
r.addRow(['English',parseInt(d.row['English'].value)]);
$.each(l,function(i,n){
var p = parseInt(d.row[n].value);
if(p>0){
r.addRow([n,p]);

}
});

var t;
if(d.row.Name){
t=d.row.Name.value;}
else{
t='Languages';
}
var o = {'title':t,
                       'width':350,
                       'height':180,
                       'chartArea':{'left':0,
                       'width':'100%',
                       'height':'70%'},
                      'titleTextStyle':{
                      'fontSize':20
                      },
                       'is3D':true};
                       var oo={'width':350,
                       'height':180}

var chart = new google.visualization.PieChart(document.getElementById('iw'));

chart.draw(r,o); 
var table = new google.visualization.Table(document.getElementById('iw'));
var setInfo = {};
setInfo.table=function(){
chart.clearChart()
table.draw(r,oo)
}
setInfo.chart=function(){
table.clearChart()
chart.draw(r,o)
}
$('#tog').change(function(){
setInfo[$('#tog').val()]();

});
});
}
});
