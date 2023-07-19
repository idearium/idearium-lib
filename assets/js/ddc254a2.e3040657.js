"use strict";(self.webpackChunkidearium_lib_docs=self.webpackChunkidearium_lib_docs||[]).push([[900],{3905:function(e,n,t){t.d(n,{Zo:function(){return c},kt:function(){return f}});var r=t(7294);function o(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function a(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?a(Object(t),!0).forEach((function(n){o(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):a(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function l(e,n){if(null==e)return{};var t,r,o=function(e,n){if(null==e)return{};var t,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||(o[t]=e[t]);return o}(e,n);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var u=r.createContext({}),p=function(e){var n=r.useContext(u),t=n;return e&&(t="function"==typeof e?e(n):i(i({},n),e)),t},c=function(e){var n=p(e.components);return r.createElement(u.Provider,{value:n},e.children)},s="mdxType",d={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},m=r.forwardRef((function(e,n){var t=e.components,o=e.mdxType,a=e.originalType,u=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),s=p(t),m=o,f=s["".concat(u,".").concat(m)]||s[m]||d[m]||a;return t?r.createElement(f,i(i({ref:n},c),{},{components:t})):r.createElement(f,i({ref:n},c))}));function f(e,n){var t=arguments,o=n&&n.mdxType;if("string"==typeof e||o){var a=t.length,i=new Array(a);i[0]=m;var l={};for(var u in n)hasOwnProperty.call(n,u)&&(l[u]=n[u]);l.originalType=e,l[s]="string"==typeof e?e:o,i[1]=l;for(var p=2;p<a;p++)i[p]=t[p];return r.createElement.apply(null,i)}return r.createElement.apply(null,t)}m.displayName="MDXCreateElement"},7420:function(e,n,t){t.r(n),t.d(n,{assets:function(){return u},contentTitle:function(){return i},default:function(){return d},frontMatter:function(){return a},metadata:function(){return l},toc:function(){return p}});var r=t(3117),o=(t(7294),t(3905));const a={id:"phone",title:"@idearium/phone"},i=void 0,l={unversionedId:"phone",id:"phone",title:"@idearium/phone",description:"Wrapper around the Twilio phone lookup api.",source:"@site/docs/phone.md",sourceDirName:".",slug:"/phone",permalink:"/idearium-lib/docs/phone",draft:!1,editUrl:"https://github.com/idearium/idearium-lib/tree/master/docusaurus/docs/phone.md",tags:[],version:"current",frontMatter:{id:"phone",title:"@idearium/phone"},sidebar:"sidebar",previous:{title:"@idearium/mongoose",permalink:"/idearium-lib/docs/mongoose"},next:{title:"@idearium/promise-all-settled",permalink:"/idearium-lib/docs/promise-all-settled"}},u={},p=[{value:"Installation",id:"installation",level:2},{value:"Beta installation",id:"beta-installation",level:3},{value:"Usage",id:"usage",level:2}],c={toc:p},s="wrapper";function d(e){let{components:n,...t}=e;return(0,o.kt)(s,(0,r.Z)({},c,t,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Wrapper around the Twilio phone lookup api."),(0,o.kt)("h2",{id:"installation"},"Installation"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-shell"},"$ yarn add -E @idearium/phone\n")),(0,o.kt)("h3",{id:"beta-installation"},"Beta installation"),(0,o.kt)("p",null,"If you need to install a beta version, you can:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-shell"},"$ yarn add -E @idearium/phone@beta\n")),(0,o.kt)("h2",{id:"usage"},"Usage"),(0,o.kt)("p",null,"To use ",(0,o.kt)("inlineCode",{parentName:"p"},"@idearium/phone"),", simply call the exported ",(0,o.kt)("inlineCode",{parentName:"p"},"parsePhoneNumber")," function.\nThis function takes a ",(0,o.kt)("inlineCode",{parentName:"p"},"countryCode")," and ",(0,o.kt)("inlineCode",{parentName:"p"},"phoneNumber")," string and attempts to format it into the E.164 phone number format."),(0,o.kt)("p",null,"Example:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'const { parsePhoneNumber } = require(\'@idearium/phone\');\n\nawait parsePhoneNumber({ countryCode: \'AU\', phoneNumber: \'0412345678\' });\n\n// {\n//   "addOns": null,\n//   "callerName": null,\n//   "carrier": null,\n//   "countryCode": "AU",\n//   "nationalFormat": "0412 345 678",\n//   "phoneNumber": "+61412345678",\n//   "url": "https://lookups.twilio.com/v1/PhoneNumbers/+61412345678"\n// }\n')),(0,o.kt)("p",null,"You will need to include the following environment variables in your manifests:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-yaml"},"TWILIO_ACCOUNT_SID: 'accountsid'\nTWILIO_AUTH_TOKEN: 'authtoken'\n")))}d.isMDXComponent=!0}}]);