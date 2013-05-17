umg-livefyre
============

UMG Livefyre Integration and Sample Interfaces


#Livefyre River
/js/iga-livefyre-river.js

A prototype "river" experience utilizing the Livefyre [Change Collection Function] (https://github.com/Livefyre/livefyre-docs/wiki/JavaScript-API#wiki-change-collection). The river is not tied to any specific ui elements, but can be easily bound to click events via jquery. A hashchange event callback is also supported.

##Example
http://jsfiddle.net/Interscope/C2AAG/

	$(document).ready(function(){
		var river = new LivefyreRiver($('#livefyre-river'), {
			'jessicasanchez':{ siteId:304004, articleId:'sh_col_91_1368747617'},
			'scottymccreery':{siteId:304004, articleId:'sh_col_92_1368747692'},
			'nickiminaj':{siteId:304004, articleId:'sh_col_90_1368747562'} }, {network: 'umg-int-1.fyre.co', hashchange:true});
		river.loadCollection("jessicasanchez");
		$("#livefyre-river-tabs button").click(function(e){ river.changeCollection($(this).attr("data-fyre-collection")); });
	});