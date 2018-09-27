/*
* 
* RandApp, a simple psudo random number (PRNG) library supporting 3 different 
*          distributions: uniform, normal (gaussian), chi-squared
*/
var RandApp={
    // Linear Congruential Generator
    // Using paramters from Numerical Recepies (see Wikipedia)
    a:1664525,
    c:1013904223,
    m:Math.pow(2,32),
    k:1,

    _isPersistent:true,
    _seed:null,
    _distribution:"uniform",
    _supportedDistributions:["uniform","normal","chi-squared","uni-squared"],

    persistence:function(p){
        if(typeof(p) === "boolean"){
            this._isPersistent=p;
        }
        return this._isPersistent;
    },

    seed:function(newSeed){
        if(newSeed === parseInt(newSeed,10)){
            this._seed=newSeed; 
            if(this._isPersistent){         
                window.localStorage.setItem("RandAppSeed",this._seed);
            }
            console.log("SEED SET", this._seed);
        }

        if(this._isPersistent){         
            this._seed=parseInt(window.localStorage.getItem("RandAppSeed"));
        }

        if(this._seed!==parseInt(this._seed,10)){
            this._seed=Math.floor(new Date() / 1000);
        }
            
        return this._seed;
    },

    distribution:function(newDistribution){
        if(typeof(newDistribution)==="string"){
            if(this._supportedDistributions.indexOf(newDistribution)>=0){
                this._distribution=newDistribution;
                if(this._isPersistent){
                    window.localStorage.setItem("RandAppDistribution",this._distribution);
                }
                console.log("SEED DISTRIBUTION", this._distribution);  
            }else{
                console.log(newDistribution+" is not a supported distribution! Will use 'uniform' distribution.");
                return this._supportedDistributions[0];
            }
        }else{
            if(this._isPersistent){
                this._distribution=window.localStorage.getItem("RandAppDistribution");
                if(this._supportedDistributions.indexOf(this._distribution)<0){
                    this._distribution=this._supportedDistributions[0];
                    window.localStorage.setItem("RandAppDistribution",this._distribution);
                }
            }  
        }
        return this._distribution;
    },

    clear:function(){
        window.localStorage.removeItem("RandAppSeed");
        window.localStorage.removeItem("RandAppDistribution");
        console.log("SEED/DISTRIBUTION CLEARED");
    },

    nextRand:function(){
        if(this._isPersistent){
            this._seed=parseInt(window.localStorage.getItem("RandAppSeed"));
        }

        if(this._seed!==parseInt(this._seed,10)){
            this._seed=Math.floor(new Date() / 1000);
        }
        
        this._seed=(this.a*this._seed+this.c)%this.m;

        if(this._isPersistent){
            window.localStorage.setItem("RandAppSeed",this._seed);
        }

        return this._seed;
    },

    nextRandFloat:function(){
        return this.nextRand()/this.m;
    },

    bm_transform:function(){
        // Using Box–Muller transform
        // https://en.wikipedia.org/wiki/Box%E2%80%93Muller_transform
        var u = 0, v = 0;
        while(u === 0) u = this.nextRandFloat(); //Converting [0,1) to (0,1)
        while(v === 0) v = this.nextRandFloat();
        let num=Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
        num = num / 10.0 + 0.5; // Translate to 0 -> 1
        if (num > 1 || num < 0) return this.bm_transform(); // resample between 0 and 1
        return num;            
    },

    rand:function(){
        if(this._isPersistent){
            this._distribution=RandApp.distribution();
        }

        if(this._distribution==="uniform"){
            return this.nextRandFloat();
        }else if(this._distribution==="normal"||this.distribution==="gaussian"){
            return this.bm_transform();
        }else if(this._distribution==="uni-squared"){
            let r=this.nextRandFloat();
            return r*r;
        }else if(this._distribution==="chi-squared"){
            let sqr_sum=0;
            for(let i=0;i<this.k;i++){
                let r=this.bm_transform();
                sqr_sum+=r*r;
            }              
            return sqr_sum;
        }else{
            alert(this._distribution+ " : Unknown density function! Only 'uniform','normal', 'uni-squared', and 'chi-squared' are supported.");
        }
    },

    randIntFromInterval:function(min,max){
        return Math.floor(this.rand() * (max - min)) + min;
    }
}
