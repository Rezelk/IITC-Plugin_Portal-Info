// ==UserScript==
// @id			  iitc-plugin-show-portal-info@rezelk
// @name		  IITC plugin: Show portal info
// @version		  0.1.0.20130602.131100
// @namespace	  https://github.com/jonatkins/ingress-intel-total-conversion
// @description	  listing portal information (beta)
// @include		  http://www.ingress.com/intel*
// @match		  https://www.ingress.com/intel*
// @match		  http://www.ingress.com/intel*
// ==/UserScript==

function wrapper() {
// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function() {};


// PLUGIN START ////////////////////////////////////////////////////////

// use own namespace for plugin
window.plugin.showPortalInfo = function() {};

window.plugin.showPortalInfo.portalAdded = function(data) {
	
    // get portal object
    var d = data.portal.options.details;
    console.log(data.portal);
    // get portal parameters
    var guid = data.portal.options.guid;
    var lat = d.locationE6.latE6 / 1000000.0;
    var lng = d.locationE6.lngE6 / 1000000.0;
    var level = getPortalLevel(d).toFixed(2);
    var name = d.portalV2.descriptiveText.TITLE;
    var team = (getTeam(d) === 0) ? "X" : (getTeam(d) === 1) ? "R" : (getTeam(d) === 2) ? "E" : "U";
	var address = d.portalV2.descriptiveText.ADDRESS;
    var imageUrl = d.imageByUrl.imageUrl;
    var resonators = d.resonatorArray.resonators;
    var mods = d.portalV2.linkedModArray;
    
    var jsText = "{"
               + "guid:'" + guid + "'"
               + ", team:'" + team + "'"
               + ", level:" + level
               + ", name:'" + escapeText(name) + "'"
               + ", lat:" + lat
               + ", lng:" + lng
               + ", address:'" + address + "'"
               + ", imageUrl:'" + imageUrl + "'"
               + ", resonators:" + resonatorsToString(resonators)
               + ", mods:" + modsToString(mods)
               + "},";
    
    $("ul#portalIndoList>li").each(function() {
        if ($(this).attr("guid") == guid) {
        	$(this).remove();
        }
    });
    
    $("ul#portalIndoList").append(
        $("<li>").attr("guid", guid).text(jsText)
    );
    $("div#portalInfoCount").text("// " + $("ul#portalIndoList>li").length + " portals");
};

// resonators to string
var resonatorsToString = function(resonators) {
	var params = {};

	// resonators detail
    var resParams = [];
    var resCount = 0;
	for (var i = 0; i < 8; i++) {
		var distance = 0;
		var energy = 0;
		var level = 0;
		var ownerGuid = "''";
		if (resonators[i] != null) {
			distance = resonators[i].distanceToPortal;
			energy = resonators[i].energyTotal;
			level = resonators[i].level;
			ownerGuid = "'" + resonators[i].ownerGuid + "'";
            resCount++;
		}
        resParams[i] = "{distance:" + distance + ", energy:" + energy + ", level:" + level + ", ownerGuid:" + ownerGuid + "}";
    }
    params['details'] = "[" + resParams.join(", ") + "]";
	// resonator count
	params['count'] = resCount;
	
	return MapToString(params);
};

// mods to string
var modsToString = function(mods) {
    var params = {};
    // mods detail
    var modParams = [];
    var modCount = 0;
    for (var i = 0; i < 4; i++) {
    	var name = "''";
        var type = "''";
        var rarity = "''";
        var ownerGuid = "''";
        if (mods[i] != null) {
        	name = "'" + mods[i].displayName + "'";
            type = "'" + mods[i].type + "'";
            rarity = "'" + mods[i].rarity + "'";
            ownerGuid = "'" + mods[i].installingUser + "'";
            modCount++;
        }
        modParams[i] = "{name:" + name + ", type:" + type + ", rarity:" + rarity + ", ownerGuid:" + ownerGuid + "}";
    }
    params['details'] = "[" + modParams.join(", ") + "]";
    // mods count
    params['count'] = modCount;
    
    return MapToString(params);
};
    
// map to string
var MapToString = function(map) {
    var joinText = "";
    var isFirst = true;
    for (var key in map) {
    	var val = map[key];
        if (isFirst == true) {
            joinText += key + ":" + val;
            isFirst = false;
        } else {
            joinText += ", " + key + ":" + val;
        }
    }
    return "{" + joinText + "}";
};

// escape single quotation
var escapeText = function(text) {
    return (text + "").replace(/'/g, "\\'");
};


var setup =  function() {
	// hook event
	window.addHook('portalAdded', window.plugin.showPortalInfo.portalAdded);
    
    $("body").append(
        $("<div>").attr("id", "showPortalInfo").css({position:"absolute", top:"40px", left:"45px", width:"auto",
                                                     opacity:"0.7", height:"auto", backgroundColor:"white", zIndex:"10000", fontSize:"0.5em"}).append(
            $("<div>").text("[ - ]").css({cursor:"pointer"}).click(function() {
                if ($(this).text() == "[ - ]") {
                    $(this).text("[ + ]");
                    $("ul#portalIndoList").animate({width:"0px", height:"0px"});
                    $("ul#portalIndoList").hide("slow");
                } else {
                    $(this).text("[ - ]");
                    $("ul#portalIndoList").show().animate({width:"700px", height:"700px"});
                }
            })
        ).append(
            $("<div>").attr("id", "portalInfoCount").css({fontSize:"0.8em"})
        ).append(
            $("<div>").text("var portals = [")
        ).append(
            $("<div>").css({width:"auto", height:"auto", maxWidth:"700px", maxHeight:"700px", overflow:"auto"}).append(
            	$("<ul>").attr("id", "portalIndoList")
            )
        ).append(
            $("<div>").text("{last:null}")
        ).append(
            $("<div>").text("];")
        )

    );
}

// PLUGIN END //////////////////////////////////////////////////////////

if(window.iitcLoaded && typeof setup === 'function') {
	setup();
} else {
	if(window.bootPlugins)
		window.bootPlugins.push(setup);
	else
		window.bootPlugins = [setup];
}
} // wrapper end
// inject code into site context
var script = document.createElement('script');
script.appendChild(document.createTextNode('('+ wrapper +')();'));
(document.body || document.head || document.documentElement).appendChild(script);
