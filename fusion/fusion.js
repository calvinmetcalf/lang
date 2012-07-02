google.load('visualization', '1.0', {'packages':['corechart','table']});
$(function() {

var base ="https://www.googleapis.com/fusiontables/v1/query?sql=SELECT%20Total,'English Bilingual','English Only','Other African',Arabic,Armenian,Chinese,French,'Haitian Creole',German,Greek,Gujarati,Hebrew,Hindi,Hmong,Hungarian,Italian,Japanese,Korean,Laotian,Cambodian,'Other Misc','Other Asian','Other Indic','Other Indo-European','Other Native','Other Pacific Island','Other Slavic','Other West Germanic',Persian,Polish,Portuguese,Russian,'Other Scandinavian','Serbo-Croatian',Spanish,Tagalog,Thai,Urdu,Vietnamese,Yiddish%20FROM%201Nmn4ITGyXRucIE52dt55mEhy7RWKm_s55f3dOhg+ORDER%20BY%20ST_DISTANCE(poly,%20LATLNG(";
//var latlng = "42.351694,-71.062317";
var end ="))%20LIMIT%201&key=AIzaSyAm9yWCV7JPCTHCJut8whOjARd7pwROFDQ";
function getTract(lat,lng){
    var latlng =[lat,lng].join(",");
$.get(base+latlng+end,dc,"JSONP");
}
function dc(data){
    var d={};
   $.each(data.rows[0],function(i,v){
    if(v>0){
     d[data.columns[i]]=v   
    }
   });
 makeChart(d);
}
function gc(a){
var g = google.maps;
var geoc = new g.Geocoder();
geoc.geocode( { 'address': a}, function(results, status) {
     if (status == g.GeocoderStatus.OK) {
          cb(results[0]);
     }
});
};
function cb(r){
 var lat = r.geometry.location.lat();
var lng = r.geometry.location.lng();
getTract(lat,lng);
}

$( "input:submit" ).button();
$('input, textarea').placeholder();
$( "#tabs" ).tabs();
$("#srch").click(function(){
    gc(
        $("#adr").val()
        )
    });
function makeChart(d){
    var r = new google.visualization.DataTable();
r.addColumn('string','Language');
r.addColumn('number','Speakers');

$.each(d,function(k,v){
   if(k!="Total"){
    r.addRow([k,parseInt(v)]);  
   
   } 
});
var t= new google.visualization.Table(document.getElementById('tabs-1'));
var c= new google.visualization.PieChart(document.getElementById('tabs-2'));
t.draw(r);
var o = {'width':900,
                      'height':400,
                       'chartArea':{'left':0,
                       'width':'100%',
                       'height':'80%'},
                      'titleTextStyle':{
                      'fontSize':20
                      },
                       'is3D':true};
c.draw(r,o);
}
});