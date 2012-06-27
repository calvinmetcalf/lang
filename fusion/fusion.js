var d;
$(function() {
var url = "https://www.googleapis.com/fusiontables/v1/query?sql=SELECT%20*%20FROM%201OVdX4hRNuUrDJVLt02MXfTG0MMV4kB_EI6sKejg&key=AIzaSyAm9yWCV7JPCTHCJut8whOjARd7pwROFDQ";
$.get(url,dc,"JSONP");
function dc(data){
d={};
$.each(data.rows,function(i,v){
    var o= {"English":{},
    "Other":{}};
    $.each(v,function(n,a){
     
        var value;
        if((a>0)&&(n>0)){
         value=parseInt(a);
         if(n==3){
           o.English.Only=value;  
         }else if(n==4){
           o.English.Bilingual=value;  
         }else if(n>32){
             o.Other[data.columns[n].slice(6)]=value;
       }else{
        o[data.columns[n]]=value;
       }
        }
        });
    if(Object.keys(o.Other).length===0){
        delete o.Other;
        
    }
    
    d[v[1]]=o;
    });    
    
}
});