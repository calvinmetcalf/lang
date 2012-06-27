google.load('visualization', '1.0', {'packages':['corechart','table']});
var r;
$(function() {
var w = google.visualization;
$.get("https://otp.iriscouch.com/lang/_design/stats/_view/Unique?group=true",table,"JSONP");
function table(d){
var k=$.map(d.rows,function(r){
    return r.key;
});
$("#chart").append("<input id='towns' type='text' /><input id='sub' type='submit' value='Go' /><div id='viz'></div>");
$( "#tabs" ).tabs({collapsible: true,selected: -1});
var kcap = $.map(k,function(v){
var u = v.trim().split(" ");
var up =$.map(u,function(uu){
 uuu = uu.slice(0,1).toUpperCase() + uu.slice(1);
 return uuu;
});
return up.join(" ");
});
$( "#towns" ).autocomplete({
    		source: kcap
		});
$('#sub').click(function(){
   var t = $( "#towns" ).val().toLowerCase();
   $.get( "https://otp.iriscouch.com/lang/"+t, function(d){
    makeChart(d,t);   
   },"JSONP");
});
}
function makeChart(data,town){
     r = new w.DataTable();
r.addColumn('string','Language');
r.addColumn('number','Speakers');
$.each(data,function(k,v){
   if((k!='_id')&&(k!='_rev')&&(k!='Total')){
       r.addRow([k,v]);
   }
});
var table = new w.Table(document.getElementById('viz'));
table.draw(r);    
}
});