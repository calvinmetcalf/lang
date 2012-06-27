var d;
$(function() {
var key = "AIzaSyBvl2Lx_Tj-9N_fT9arfnl8utRkVPe50uA";
var table = "1ec6BVaXU7xnCawVZvbh22ARd0KQ8bYs1LUMsCfk";

function ft(table,key){
 var _this=this;
 _this.name="Fusion Table";
 _this.tkey=table;
 _this.id=key;
 _this.base = "https://www.googleapis.com/fusiontables/v1/tables/"+_this.tkey;
 _this.p2 = "?"+"key="+_this.id;
 _this.info = function(cb){
     $.get(_this.base+_this.p2,cb,"JSONP");
 };
 _this.columns = function(cb){
     $.get(_this.base+"/columns"+_this.p2,cb,"JSONP");
 };
 _this.select=function(cb,c,w){
  c = c||"*";
  if(w){
   w="+WHERE+"+w;   
  }else{w="";}
  $.get("https://www.googleapis.com/fusiontables/v1/query?sql=SELECT+"+c+"+FROM+"+_this.tkey+w+"&key="+_this.id,cb,"JSONP");
 }
};
var f = new ft(table,key);
 var c
var col = function(d){
   var r = [];
$.each(d.items,function(i,v){
  r.push("'"+v.name+"'");  
});
c= $.map(r,function(v){
   if($.inArray(v,["'poly'","'ID'","'uid'"])==-1){
       return v;   
   }
    
});
f.select(b,c.join());

    }
f.columns(col);
  
function b(dd){
    
 d=dd;   
}
});