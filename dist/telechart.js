!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.telechart=t():e.telechart=t()}(this,function(){return function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){e.exports=n(1)},function(e,t,n){n(2);n(3);const o=n(4);e.exports=((e,t,n)=>{t.buffers=t.columns.reduce((e,t)=>(e[t[0]]=new Float32Array(t,1),e),{}),delete t.columns;const r=()=>{},c=document.createElement("div");c.className="tc-controls",Object.keys(t.names).forEach(e=>{const n=o(e,t,r);c.appendChild(n)}),e.appendChild(c)})},function(e,t,n){},function(e,t){e.exports=((e,t,n)=>{const o=document.createElement("div"),r=document.createElement("span");return r.style.backgroundColor=t,o.appendChild(r),o.textContent=e,o.addEventListener("click",t=>n(t,e)),o})},function(e,t){e.exports=((e,t,n)=>{const o=t.colors[e],r=t.names[e],c=document.createElement("div"),u=document.createElement("span");return u.style.backgroundColor=o,c.appendChild(u),c.textContent=r,c.className="tc-control",c.addEventListener("click",t=>{c.classList.toggle("active"),n(t,e)}),c})}])});