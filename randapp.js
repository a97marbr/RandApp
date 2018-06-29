/*
* 
* RandApp, a simple psudo random number (PNG) library supporting 3 different 
*          distributions: uniform, normal (gaussian), chi-squared
*/
function RandApp(params) {    
    if(typeof params === "undefined"){
        params={};
    }
    
    if(typeof params.seed === "undefined"){
        params.seed=Math.floor(new Date() / 1000);
    }
    var seed = params.seed;
    
    if(typeof params.distribution === "undefined"){
        params.distribution="uniform";
    }
    var distribution = params.distribution;

    if(typeof params.k === "undefined"){
        params.k=1;
    }
    var k = params.k;

    // Linear Congruential generator
    // Using paramters from Numerical Recepies (see Wikipedia)
    var a=1664525;
    var c=1013904223;
    var m=Math.pow(2,32);
    
    var nextRand=function(){
        seed=(a*seed+c)%m;
        return seed;
    }

    var nextRandFloat=function(){
        return nextRand()/m;
    }

    var bm_transform=function(){
        // Using Box–Muller transform
        // https://en.wikipedia.org/wiki/Box%E2%80%93Muller_transform
        var u = 0, v = 0;
        while(u === 0) u = nextRandFloat(); //Converting [0,1) to (0,1)
        while(v === 0) v = nextRandFloat();
        let num=Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
        num = num / 10.0 + 0.5; // Translate to 0 -> 1
        if (num > 1 || num < 0) return bm_transform(); // resample between 0 and 1
        return num;            
    }

    this.rand=function(){
          if(distribution==="uniform"){
              return nextRandFloat();
          }else if(distribution==="normal"||distribution==="gaussian"){
              return bm_transform();
          }else if(distribution==="uni-squared"){
              let r=nextRandFloat();
              return r*r;
          }else if(distribution==="chi-squared"){
              let sqr_sum=0;
              for(let i=0;i<k;i++){
                  let r=bm_transform();
                  sqr_sum+=r*r;
              }              
              return sqr_sum;
          }else{
              alert("Unknown density function! Only 'uniform','normal', 'uni-squared', and 'chi-squared' are supported.");
          }
    }
    
    this.randIntFromIntervall=function(min,max){
        return Math.floor(this.rand() * (max - min)) + min;
    }
}
