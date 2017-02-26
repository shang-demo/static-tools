!function(r){function e(t){if(n[t])return n[t].exports;var u=n[t]={i:t,l:!1,exports:{}};return r[t].call(u.exports,u,u.exports,e),u.l=!0,u.exports}var n={};return e.m=r,e.c=n,e.i=function(r){return r},e.d=function(r,n,t){e.o(r,n)||Object.defineProperty(r,n,{configurable:!1,enumerable:!0,get:t})},e.n=function(r){var n=r&&r.__esModule?function(){return r.default}:function(){return r};return e.d(n,"a",n),n},e.o=function(r,e){return Object.prototype.hasOwnProperty.call(r,e)},e.p="",e(e.s=1)}([function(r,e){function n(r,e,n){function t(r){return r!=p&&(b.has(r)||r.charCodeAt(0)>126)}function u(){var e=w;return m==k?p:(w=p,e==p&&(e=r.charAt(m),++m),e>=" "||"\n"==e?e:"\r"==e?"\n":" ")}function s(){var e=w;return m==k?p:(w=p,e==p&&(e=r.charAt(m),++m),e>=" "||"\n"==e||"\r"==e?e:" ")}function a(){return w=u()}function i(){var r=u();if("/"==r)switch(a()){case"/":for(;;)if(r=u(),r<="\n")return r;break;case"*":if(u(),"!"==a()){u();for(var e="/*!";;)switch(r=s()){case"*":if("/"==a())return u(),e+"*/";break;case p:throw"Error: Unterminated comment.";default:e+=r}}else for(;;)switch(u()){case"*":if("/"==a())return u()," ";break;case p:throw"Error: Unterminated comment."}break;default:return r}return r}function c(r){var e=[];if(1==r&&e.push(f),r<3&&(f=h,"'"==f||'"'==f))for(;e.push(f),f=u(),f!=h;){if(f<="\n")throw"Error: unterminated string literal: "+f;"\\"==f&&(e.push(f),f=u())}if(h=i(),"/"==h&&"(,=:[!&|".has(f)){for(e.push(f),e.push(h);f=u(),"/"!=f;){if("\\"==f)e.push(f),f=u();else if(f<="\n")throw"Error: unterminated Regular Expression literal";e.push(f)}h=i()}return e.join("")}function o(){var r=[];for(f="",r.push(c(3));f!=p;)switch(f){case" ":t(h)?r.push(c(1)):r.push(c(2));break;case"\n":switch(h){case"{":case"[":case"(":case"+":case"-":r.push(c(1));break;case" ":r.push(c(3));break;default:t(h)?r.push(c(1)):1==e&&"\n"!=h?r.push(c(1)):r.push(c(2))}break;default:switch(h){case" ":if(t(f)){r.push(c(1));break}r.push(c(3));break;case"\n":if(1==e&&"\n"!=f)r.push(c(1));else switch(f){case"}":case"]":case")":case"+":case"-":case'"':case"'":3==e?r.push(c(3)):r.push(c(1));break;default:t(f)?r.push(c(1)):r.push(c(3))}break;default:r.push(c(1))}}return r.join("")}if(!r)return"";e||(e=2),n||(n="");var f="",h="",p=-1,l="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",d="0123456789",b=l+d+"_$\\",w=p,m=0,k=r.length;return ret=o(r),n?n+"\n"+ret:ret}/*! 
jsmin.js - 2010-01-15
Author: NanaLich (http://www.cnblogs.com/NanaLich)
Another patched version for jsmin.js patched by Billy Hoffman, 
this version will try to keep CR LF pairs inside the important comments
away from being changed into double LF pairs. 

jsmin.js - 2009-11-05
Author: Billy Hoffman
This is a patched version of jsmin.js created by Franck Marcia which
supports important comments denoted with /*! ...
Permission is hereby granted to use the Javascript version under the same
conditions as the jsmin.js on which it is based.

jsmin.js - 2006-08-31
Author: Franck Marcia
This work is an adaptation of jsminc.c published by Douglas Crockford.
Permission is hereby granted to use the Javascript version under the same
conditions as the jsmin.c on which it is based.

jsmin.c
2006-05-04

Copyright (c) 2002 Douglas Crockford  (www.crockford.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

The Software shall be used for Good, not Evil.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

Update:
add level:
1: minimal, keep linefeeds if single
2: normal, the standard algorithm
3: agressive, remove any linefeed and doesn't take care of potential
missing semicolons (can be regressive)
*/
String.prototype.has=function(r){return this.indexOf(r)>-1},e.jsmin=n},function(r,e,n){window.jsmin=n(0).jsmin}]);