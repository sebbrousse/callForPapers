/*
 * Copyright (c) 2016 BreizhCamp
 * [http://breizhcamp.org]
 *
 * This file is part of CFP.io.
 *
 * CFP.io is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

(function(global) {

  //
  // Utility methods
  //

  var parseQueryString = function(url) {
    var a = document.createElement('a');
    a.href = url;
    str = a.search.replace(/\?/, '');

    return deparam(str, true /* coerce values, eg. 'false' into false */);
  };

  // deparam
  //
  // Inverse of $.param()
  //
  // Taken from jquery-bbq by Ben Alman
  // https://github.com/cowboy/jquery-bbq/blob/master/jquery.ba-bbq.js

  // FIXME: add isNaN() method used below

  var isArray = Array.isArray || function(obj) {
    return Object.prototype.toString.call(obj) == '[object Array]';
  };

  var deparam = function( params, coerce ) {
    var obj = {},
    coerce_types = { 'true': !0, 'false': !1, 'null': null };

    // Iterate over all name=value pairs.
    params.replace( /\+/g, ' ' ).split( '&' ).forEach(function(v, j){
      var param = v.split( '=' ),
      key = decodeURIComponent( param[0] ),
      val,
      cur = obj,
      i = 0,

      // If key is more complex than 'foo', like 'a[]' or 'a[b][c]', split it
      // into its component parts.
      keys = key.split( '][' ),
      keys_last = keys.length - 1;

      // If the first keys part contains [ and the last ends with ], then []
      // are correctly balanced.
      if ( /\[/.test( keys[0] ) && /\]$/.test( keys[ keys_last ] ) ) {
        // Remove the trailing ] from the last keys part.
        keys[ keys_last ] = keys[ keys_last ].replace( /\]$/, '' );

        // Split first keys part into two parts on the [ and add them back onto
        // the beginning of the keys array.
        keys = keys.shift().split('[').concat( keys );

        keys_last = keys.length - 1;
      } else {
        // Basic 'foo' style key.
        keys_last = 0;
      }

      // Are we dealing with a name=value pair, or just a name?
      if ( param.length === 2 ) {
        val = decodeURIComponent( param[1] );

        // Coerce values.
        if ( coerce ) {
          val = val && !isNaN(val)            ? +val              // number
          : val === 'undefined'             ? undefined         // undefined
          : coerce_types[val] !== undefined ? coerce_types[val] // true, false, null
          : val;                                                // string
        }

        if ( keys_last ) {
          // Complex key, build deep object structure based on a few rules:
          // * The 'cur' pointer starts at the object top-level.
          // * [] = array push (n is set to array length), [n] = array if n is
          //   numeric, otherwise object.
          // * If at the last keys part, set the value.
          // * For each keys part, if the current level is undefined create an
          //   object or array based on the type of the next keys part.
          // * Move the 'cur' pointer to the next level.
          // * Rinse & repeat.
          for ( ; i <= keys_last; i++ ) {
            key = keys[i] === '' ? cur.length : keys[i];
            cur = cur[key] = i < keys_last
            ? cur[key] || ( keys[i+1] && isNaN( keys[i+1] ) ? {} : [] )
            : val;
          }

        } else {
          // Simple key, even simpler rules, since only scalars and shallow
          // arrays are allowed.

          if ( isArray( obj[key] ) ) {
            // val is already an array, so push on the next value.
            obj[key].push( val );

          } else if ( obj[key] !== undefined ) {
            // val isn't an array, but since a second value has been specified,
            // convert val into an array.
            obj[key] = [ obj[key], val ];

          } else {
            // val is a scalar.
            obj[key] = val;
          }
        }

      } else if ( key ) {
        // No value was defined, so set something meaningful.
        obj[key] = coerce
        ? undefined
        : '';
      }
    });

    return obj;
  };

  // Load main javascript
  /*! iFrame Resizer (iframeSizer.min.js ) - v2.8.5 - 2015-03-25
   *  Desc: Force cross domain iframes to size to content.
   *  Requires: iframeResizer.contentWindow.min.js to be loaded into the target frame.
   *  Copyright: (c) 2015 David J. Bradshaw - dave@bradshaw.net
   *  License: MIT
   */

  !function(){"use strict";function a(a,b,c){"addEventListener"in window?a.addEventListener(b,c,!1):"attachEvent"in window&&a.attachEvent("on"+b,c)}function b(){var a,b=["moz","webkit","o","ms"];for(a=0;a<b.length&&!z;a+=1)z=window[b[a]+"RequestAnimationFrame"];z||e(" RequestAnimationFrame not supported")}function c(){var a="Host page";return window.top!==window.self&&(a=window.parentIFrame?window.parentIFrame.getId():"Nested host page"),a}function d(a){return v+"["+c()+"]"+a}function e(a){s&&"object"==typeof window.console&&console.log(d(a))}function f(a){"object"==typeof window.console&&console.warn(d(a))}function g(a){function b(){function a(){k(G),i(),B[H].resizedCallback(G)}g("Height"),g("Width"),l(a,G,"resetPage")}function c(a){var b=a.id;e(" Removing iFrame: "+b),a.parentNode.removeChild(a),B[b].closedCallback(b),e(" --")}function d(){var a=F.substr(w).split(":");return{iframe:document.getElementById(a[0]),id:a[0],height:a[1],width:a[2],type:a[3]}}function g(a){var b=Number(B[H]["max"+a]),c=Number(B[H]["min"+a]),d=a.toLowerCase(),f=Number(G[d]);if(c>b)throw new Error("Value for min"+a+" can not be greater than max"+a);e(" Checking "+d+" is in range "+c+"-"+b),c>f&&(f=c,e(" Set "+d+" to min value")),f>b&&(f=b,e(" Set "+d+" to max value")),G[d]=""+f}function m(){var b=a.origin,c=G.iframe.src.split("/").slice(0,3).join("/");if(B[H].checkOrigin&&(e(" Checking connection is from: "+c),""+b!="null"&&b!==c))throw new Error("Unexpected message received from: "+b+" for "+G.iframe.id+". Message was: "+a.data+". This error can be disabled by adding the checkOrigin: false option.");return!0}function n(){return v===(""+F).substr(0,w)}function o(){var a=G.type in{"true":1,"false":1};return a&&e(" Ignoring init message from meta parent page"),a}function p(a){return F.substr(F.indexOf(":")+u+a)}function q(a){e(" MessageCallback passed: {iframe: "+G.iframe.id+", message: "+a+"}"),B[H].messageCallback({iframe:G.iframe,message:JSON.parse(a)}),e(" --")}function t(){if(null===G.iframe)throw new Error("iFrame ("+G.id+") does not exist on "+x);return!0}function z(a){var b=a.getBoundingClientRect();return h(),{x:parseInt(b.left,10)+parseInt(y.x,10),y:parseInt(b.top,10)+parseInt(y.y,10)}}function A(a){function b(){y=g,C(),e(" --")}function c(){return{x:Number(G.width)+d.x,y:Number(G.height)+d.y}}var d=a?z(G.iframe):{x:0,y:0},g=c();e(" Reposition requested from iFrame (offset x:"+d.x+" y:"+d.y+")"),window.top!==window.self?window.parentIFrame?a?parentIFrame.scrollToOffset(g.x,g.y):parentIFrame.scrollTo(G.width,G.height):f(" Unable to scroll to requested position, window.parentIFrame not found"):b()}function C(){!1!==B[H].scrollCallback(y)&&i()}function D(a){function b(a){var b=z(a);e(" Moving to in page link (#"+c+") at x: "+b.x+" y: "+b.y),y={x:b.x,y:b.y},C(),e(" --")}var c=a.split("#")[1]||"",d=decodeURIComponent(c),f=document.getElementById(d)||document.getElementsByName(d)[0];window.top!==window.self?window.parentIFrame?parentIFrame.moveToAnchor(c):e(" In page link #"+c+" not found and window.parentIFrame not found"):f?b(f):e(" In page link #"+c+" not found")}function E(){switch(G.type){case"close":c(G.iframe),B[H].resizedCallback(G);break;case"message":q(p(6));break;case"scrollTo":A(!1);break;case"scrollToOffset":A(!0);break;case"inPageLink":D(p(9));break;case"reset":j(G);break;case"init":b(),B[H].initCallback(G.iframe);break;default:b()}}var F=a.data,G={},H=null;n()&&(G=d(),H=G.id,s=B[H].log,e(" Received: "+F),!o()&&t()&&m()&&(E(),r=!1))}function h(){null===y&&(y={x:void 0!==window.pageXOffset?window.pageXOffset:document.documentElement.scrollLeft,y:void 0!==window.pageYOffset?window.pageYOffset:document.documentElement.scrollTop},e(" Get page position: "+y.x+","+y.y))}function i(){null!==y&&(window.scrollTo(y.x,y.y),e(" Set page position: "+y.x+","+y.y),y=null)}function j(a){function b(){k(a),m("reset","reset",a.iframe)}e(" Size reset requested by "+("init"===a.type?"host page":"iFrame")),h(),l(b,a,"init")}function k(a){function b(b){a.iframe.style[b]=a[b]+"px",e(" IFrame ("+c+") "+b+" set to "+a[b]+"px")}var c=a.iframe.id;B[c].sizeHeight&&b("height"),B[c].sizeWidth&&b("width")}function l(a,b,c){c!==b.type&&z?(e(" Requesting animation frame"),z(a)):a()}function m(a,b,c){e("["+a+"] Sending msg to iframe ("+b+")"),c.contentWindow.postMessage(v+b,"*")}function n(b){function c(){function a(a){1/0!==B[o][a]&&0!==B[o][a]&&(n.style[a]=B[o][a]+"px",e(" Set "+a+" = "+B[o][a]+"px"))}a("maxHeight"),a("minHeight"),a("maxWidth"),a("minWidth")}function d(a){return""===a&&(n.id=a="iFrameResizer"+q++,s=(b||{}).log,e(" Added missing iframe ID: "+a+" ("+n.src+")")),a}function f(){e(" IFrame scrolling "+(B[o].scrolling?"enabled":"disabled")+" for "+o),n.style.overflow=!1===B[o].scrolling?"hidden":"auto",n.scrolling=!1===B[o].scrolling?"no":"yes"}function g(){("number"==typeof B[o].bodyMargin||"0"===B[o].bodyMargin)&&(B[o].bodyMarginV1=B[o].bodyMargin,B[o].bodyMargin=""+B[o].bodyMargin+"px")}function h(){return o+":"+B[o].bodyMarginV1+":"+B[o].sizeWidth+":"+B[o].log+":"+B[o].interval+":"+B[o].enablePublicMethods+":"+B[o].autoResize+":"+B[o].bodyMargin+":"+B[o].heightCalculationMethod+":"+B[o].bodyBackground+":"+B[o].bodyPadding+":"+B[o].tolerance+":"+B[o].enableInPageLinks}function i(b){a(n,"load",function(){var a=r;m("iFrame.onload",b,n),!a&&B[o].heightCalculationMethod in A&&j({iframe:n,height:0,width:0,type:"init"})}),m("init",b,n)}function k(a){if("object"!=typeof a)throw new TypeError("Options is not an object.")}function l(a){a=a||{},B[o]={},k(a);for(var b in C)C.hasOwnProperty(b)&&(B[o][b]=a.hasOwnProperty(b)?a[b]:C[b]);s=B[o].log}var n=this,o=d(n.id);l(b),f(),c(),g(),i(h())}function o(){function a(a,b){if(!a.tagName)throw new TypeError("Object is not a valid DOM element");if("IFRAME"!==a.tagName.toUpperCase())throw new TypeError("Expected <IFRAME> tag, found <"+a.tagName+">.");n.call(a,b)}return function(b,c){switch(typeof c){case"undefined":case"string":Array.prototype.forEach.call(document.querySelectorAll(c||"iframe"),function(c){a(c,b)});break;case"object":a(c,b);break;default:throw new TypeError("Unexpected data type ("+typeof c+").")}}}function p(a){a.fn.iFrameResize=function(a){return this.filter("iframe").each(function(b,c){n.call(c,a)}).end()}}var q=0,r=!0,s=!1,t="message",u=t.length,v="[iFrameSizer]",w=v.length,x="",y=null,z=window.requestAnimationFrame,A={max:1,scroll:1,bodyScroll:1,documentElementScroll:1},B={},C={autoResize:!0,bodyBackground:null,bodyMargin:null,bodyMarginV1:8,bodyPadding:null,checkOrigin:!0,enableInPageLinks:!1,enablePublicMethods:!1,heightCalculationMethod:"offset",interval:32,log:!1,maxHeight:1/0,maxWidth:1/0,minHeight:0,minWidth:0,scrolling:!1,sizeHeight:!0,sizeWidth:!1,tolerance:0,closedCallback:function(){},initCallback:function(){},messageCallback:function(){},resizedCallback:function(){},scrollCallback:function(){return!0}};b(),a(window,"message",g),window.jQuery&&p(jQuery),"function"==typeof define&&define.amd?define([],o):"object"==typeof module&&"object"==typeof module.exports?module.exports=o():window.iFrameResize=o()}();

  // Globals
  if(!global.Silp) { global.Silp = {}; };
  var Silp = global.Silp;

  // To keep track of which embeds we have already processed
  if(!Silp.foundEls) Silp.foundEls = [];
  var foundEls = Silp.foundEls;

  // This is read by silp.min.js and a player is created for each one
  if(!Silp.settings) Silp.settings = [];
  var settings = Silp.settings;

  var els = document.getElementsByTagName('script');
  var re = /.*widget\.([^/]+\.)?js/;

  for(var i = 0; i < els.length; i++) {
    var el = els[i];

    if(el.src.match(re) && foundEls.indexOf(el) < 0) {
      foundEls.push(el);
      var info = parseQueryString(el.src);
      // Create button
      var button = document.createElement('button');
      button.style.backgroundColor =  "#4285f4";
      button.style.border =  "none";
      button.style.padding =  "15px";
      button.style.color =  "white";
      button.style.borderRadius =  "4px";
      button.style.margin =  "14px";
      button.style.outline = "0";

      button.innerHTML = "Become a speaker";
      el.parentNode.insertBefore(button, el);
      var iframeStatus = false;
      var iframeLastSize = 0;
      var init = false;
      button.onclick = function()
      {
        if(iframe.style.display == "none") iframe.style.display= "block";
        if(iframeStatus === false)
        {
          if(init)
          {
            iframe.style.height = iframeLastSize;
          }
          iframeStatus = true;
        }
        else
        {
          if(iframe.style.height !== 0 && iframe.style.height !== "0px")
            iframeLastSize = iframe.style.height;
          iframe.style.height = 0;
          iframeStatus = false;
        }
      }

      // Create iframe
      var iframe = document.createElement('iframe');
      iframe.style.width = "100%";
      iframe.style.height= 0;

      iframe.style.transition = "0.3s";
      iframe.style.oTransition = "0.3s";
      iframe.style.oTransition = "0.3s";
      iframe.style.msTransition = "0.3s";

      iframe.style.marginheight = "0";
      iframe.style.marginwidth = "0";
      iframe.frameBorder = 0;
      var arr = el.src.split("/");
      iframe.src = arr[0] + "//" + arr[2] + "/#/event/" + info.event;
      el.parentNode.insertBefore(iframe, el);
      iframeLastSize = iframe.style.height;
      iFrameResize({
        enablePublicMethods: true,
        resizedCallback: function(iframeTmp) {
          if(iframeTmp.height != 0)
            iframeLastSize = iframeTmp.height + 'px';
        },
        initCallback: function(iframeTmp) {
           iframe.style.display= "none";
           iframeLastSize = iframeTmp.height + 'px';
           setTimeout(function(){
            if(iframeStatus === false)
              iframe.style.height = 0;
            iframe.style.display = "block";
            init = true;
           },1000)
        }
      }, iframe);
      info['iframe'] = iframe;
      settings.push(info);
      // console.log(info);
    }
  }
}(this));
