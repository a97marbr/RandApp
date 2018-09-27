/*
* 
* RandApp, a simple psudo random number (PNG) library supporting 3 different 
*          distributions: uniform, normal (gaussian), chi-squared
*/
var RandAppCount = 0;
function RandApp(params) {    
    this.id=RandAppCount++;
    this.k = params.k;    

    // Linear Congruential generator
    // Using paramters from Numerical Recepies (see Wikipedia)
    this.a=1664525;
    this.c=1013904223;
    this.m=Math.pow(2,32);

    if(typeof params === "undefined"){
        params={};
    }

    if(typeof params.persistentSeed === "undefined"){
        params.persistentSeed=true;
    }
    var persistentSeed = params.persistentSeed;    

    if(typeof params.seed === "undefined"){
        params.seed=Math.floor(new Date() / 1000);
    }
    this._seed=null;
    if(persistentSeed){
        this._seed = params.seed;
    }else{
        this._seed=parseInt(window.localStorage.getItem("RandAppSeed"+this.id));
        if(this._seed!==parseInt(this._seed,10)){
            this._seed=params.seed;
        }else{
            this._seed=(this.a*this._seed+this.c)%this.m;
        }
    }
    window.localStorage.setItem("RandAppSeed"+this.id,this._seed);

    if(typeof params.distribution === "undefined"){
        params.distribution="uniform";
    }
    var distribution = params.distribution;

    if(typeof params.k === "undefined"){
        params.k=1;
    }
    
    this.nextRand=function(){
        this._seed=(this.a*this._seed+this.c)%this.m;
        return this._seed;
    }

    this.nextRandFloat=function(){
        return this.nextRand()/this.m;
    }

    this.bm_transform=function(){
        // Using Box–Muller transform
        // https://en.wikipedia.org/wiki/Box%E2%80%93Muller_transform
        var u = 0, v = 0;
        while(u === 0) u = this.nextRandFloat(); //Converting [0,1) to (0,1)
        while(v === 0) v = this.nextRandFloat();
        let num=Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
        num = num / 10.0 + 0.5; // Translate to 0 -> 1
        if (num > 1 || num < 0) return this.bm_transform(); // resample between 0 and 1
        return num;            
    }

    this.rand=function(){
          if(distribution==="uniform"){
              return this.nextRandFloat();
          }else if(distribution==="normal"||distribution==="gaussian"){
              return this.bm_transform();
          }else if(distribution==="uni-squared"){
              let r=this.nextRandFloat();
              return r*r;
          }else if(distribution==="chi-squared"){
              let sqr_sum=0;
              for(let i=0;i<this.k;i++){
                  let r=this.bm_transform();
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

    this.clearSeed=function(){
        window.localStorage.removeItem("RandAppSeed"+this.id);
        console.log("SEED CLEARED");
    }

    this.seed=function(s){
        if(s === parseInt(s,10)){
            this._seed=s;          
            window.localStorage.setItem("RandAppSeed"+this.id,this._seed);
            console.log("SEED SET", this._seed);
        }

        if(this._seed===parseInt(this._seed,10)){
            return this._seed;
        }else{
            return false;
        }
    }
}
