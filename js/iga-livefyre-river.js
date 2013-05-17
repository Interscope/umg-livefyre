/**
 * @file iga-livefyre-river.js
 * @author Malcolm.Poindexter@umusic.com
 * Prototype Livefyre River 
 */
if(typeof define === "function"){ define("IGA.livefyre.river",["fyre", "livefyre/backplane.dg.auth","jquery"],_iga_lf_river);}
else{window["LivefyreRiver"] = _iga_lf_river(fyre, window["_livefyre_authDelegate"], jQuery);}
/**  */
function _iga_lf_river(fyre, authDelegate, $){
  /**
   * @constructor
   * @param elt
   * @param collections
   * @param options
   * @returns river
   */
  function river(elt, collections, options){
	var r = this;
    this.$elt = $(elt);
    this.config = $.extend({},{el: this.$elt[0].id}, this._config || {});// delegate _config to inherit ex: {app:'sdk'}
    if(options && options.network){this.config.network = options.network;}
    this.collections = collections;
    
    if(options.hashchange){ //default tabbing behavior is no url fragment, options.hashchange will use fragment, pushState via History.js using state is custom.
    	this._hashchange = true;
    	$(window).bind('hashchange', function(){
    		r.changeCollection(r._getFragment(location.hash));
    	});
    }
    
    this.$elt.bind("changeCollection", this.changeCollection);
    this.$elt.bind("loadCollection", this.loadCollection);
    this.$elt.data("river", this);
    return this;
  }
  
  river.prototype._getFragment = function(f){ //Override to change how the river pages.
	  f = (f || location.hash).replace(/^[\!]/,"");
	  var m = /tab=(\w+)/.exec(f),
	      mf = (m && m.length > 1)? m[1]:"";
	  return mf;
  };
  
  river.prototype.loadCollection = function(c, callback){
	var r = this;
	if(this._hashchange){ c = this._getFragment(location.hash); }
    if(!c){ for(var _c in r.collections){ c = _c;break; } }    
    var config = $.extend({}, r.config, r.collections[c]);
    r._conv = c;
    
    function _onLoad(widget){ r.fyre = widget; }
    var _nconfig = { network: this.config.network || 'umg' };
    if(authDelegate){_nconfig.authDelegate = authDelegate;}
    r.conv = fyre.conv.load( _nconfig, [config], this.onLoad || _onLoad);//@todo delegate onLoad ex. loadMediaWall()
    if(callback){callback(this, config);}
    return this;
  };
  
  river.prototype.changeCollection = function(c, callback){
	var r = this,
	    config = $.extend({}, r.config, r.collections[c]);
    if(c && c != "" && c != r._conv && config.articleId  && r.fyre){
	    r.fyre.changeCollection(config);
    	r._conv = c;
    	if(callback){callback(this, config);}
    }
    return this;
  };
  
  return river;
}
/** @example
 *  @see http://fyre.umg.edrupalgardens.com/content/livefyre-river  

$(document).ready(function(){
	var river = new LivefyreRiver($('#livefyre-river'), {
		'jessicasanchez':{ siteId:304004, articleId:'sh_col_91_1368747617'},
		'scottymccreery':{siteId:304004, articleId:'sh_col_92_1368747692'},
		'nickiminaj':{siteId:304004, articleId:'sh_col_90_1368747562'} }, {network: 'umg-int-1.fyre.co', hashchange:true});
	river.loadCollection("jessicasanchez");
	$("#livefyre-river-tabs button").click(function(e){ river.changeCollection($(this).attr("data-fyre-collection")); });
});
*/