(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{74:function(e,r,t){"use strict";t.r(r),t.d(r,"frontMatter",(function(){return o})),t.d(r,"metadata",(function(){return s})),t.d(r,"rightToc",(function(){return l})),t.d(r,"default",(function(){return u}));var a=t(3),n=t(7),i=(t(0),t(87)),o={id:"safe-promise",title:"@idearium/safe-promise"},s={unversionedId:"safe-promise",id:"safe-promise",isDocsHomePage:!1,title:"@idearium/safe-promise",description:"Makes working with promises safer.",source:"@site/docs/safe-promise.md",slug:"/safe-promise",permalink:"/idearium-lib/docs/safe-promise",editUrl:"https://github.com/idearium/idearium-lib/tree/master/docusaurus/docs/safe-promise.md",version:"current",sidebar:"sidebar",previous:{title:"@idearium/mongoose",permalink:"/idearium-lib/docs/mongoose"},next:{title:"@idearium/telemetry",permalink:"/idearium-lib/docs/telemetry"}},l=[{value:"Installation",id:"installation",children:[{value:"Beta installation",id:"beta-installation",children:[]}]},{value:"Usage",id:"usage",children:[{value:"safePromise",id:"safepromise",children:[]}]}],c={rightToc:l};function u(e){var r=e.components,t=Object(n.a)(e,["components"]);return Object(i.a)("wrapper",Object(a.a)({},c,t,{components:r,mdxType:"MDXLayout"}),Object(i.a)("p",null,"Makes working with promises safer."),Object(i.a)("h2",{id:"installation"},"Installation"),Object(i.a)("pre",null,Object(i.a)("code",Object(a.a)({parentName:"pre"},{className:"language-shell"}),"$ yarn add -E @idearium/safe-promise\n")),Object(i.a)("h3",{id:"beta-installation"},"Beta installation"),Object(i.a)("p",null,"If you need to install a beta version, you can:"),Object(i.a)("pre",null,Object(i.a)("code",Object(a.a)({parentName:"pre"},{className:"language-shell"}),"$ yarn add -E @idearium/safe-promise@beta\n")),Object(i.a)("h2",{id:"usage"},"Usage"),Object(i.a)("h3",{id:"safepromise"},"safePromise"),Object(i.a)("p",null,"To use ",Object(i.a)("inlineCode",{parentName:"p"},"safePromise"),", require it from ",Object(i.a)("inlineCode",{parentName:"p"},"@idearium/safe-promise"),"."),Object(i.a)("pre",null,Object(i.a)("code",Object(a.a)({parentName:"pre"},{className:"language-js"}),"const safePromise = require('@idearium/safe-promise');\n")),Object(i.a)("p",null,"This will take a promise and always use ",Object(i.a)("inlineCode",{parentName:"p"},"resolve")," to return a result in the format ",Object(i.a)("inlineCode",{parentName:"p"},"[err, result]"),"."),Object(i.a)("p",null,"This provides the ability to use async/wait without try/catch blocks."),Object(i.a)("p",null,"Use it like so:"),Object(i.a)("pre",null,Object(i.a)("code",Object(a.a)({parentName:"pre"},{className:"language-js"}),"const [err, result] = await safePromise(someAsyncFn);\n\nif (err) {\n    return console.log(err);\n}\n\n// Do other stuff knowing an error didn't occur.\n")))}u.isMDXComponent=!0},87:function(e,r,t){"use strict";t.d(r,"a",(function(){return d}));var a=t(0),n=t.n(a);function i(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function o(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);r&&(a=a.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,a)}return t}function s(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?o(Object(t),!0).forEach((function(r){i(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function l(e,r){if(null==e)return{};var t,a,n=function(e,r){if(null==e)return{};var t,a,n={},i=Object.keys(e);for(a=0;a<i.length;a++)t=i[a],r.indexOf(t)>=0||(n[t]=e[t]);return n}(e,r);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)t=i[a],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(n[t]=e[t])}return n}var c=n.a.createContext({}),u=function(e){var r=n.a.useContext(c),t=r;return e&&(t="function"==typeof e?e(r):s(s({},r),e)),t},p={inlineCode:"code",wrapper:function(e){var r=e.children;return n.a.createElement(n.a.Fragment,{},r)}},m=n.a.forwardRef((function(e,r){var t=e.components,a=e.mdxType,i=e.originalType,o=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),m=u(t),d=a,f=m["".concat(o,".").concat(d)]||m[d]||p[d]||i;return t?n.a.createElement(f,s(s({ref:r},c),{},{components:t})):n.a.createElement(f,s({ref:r},c))}));function d(e,r){var t=arguments,a=r&&r.mdxType;if("string"==typeof e||a){var i=t.length,o=new Array(i);o[0]=m;var s={};for(var l in r)hasOwnProperty.call(r,l)&&(s[l]=r[l]);s.originalType=e,s.mdxType="string"==typeof e?e:a,o[1]=s;for(var c=2;c<i;c++)o[c]=t[c];return n.a.createElement.apply(null,o)}return n.a.createElement.apply(null,t)}m.displayName="MDXCreateElement"}}]);