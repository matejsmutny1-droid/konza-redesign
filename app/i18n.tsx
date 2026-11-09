import {Children,cloneElement,isValidElement,type ReactNode,type ReactElement} from 'react';
import {english as baseEnglish} from './translations';
import contentEnglish from './content/translations.json';
const english:Record<string,string>={...baseEnglish,...contentEnglish};
export type Lang='sk'|'en';
export function translated(text:string,lang:Lang):string{
 if(lang==='sk')return text;
 const key=text.replace(/\s+/g,' ').trim();
 if(!key)return text;
 if(english[key])return text.replace(text.trim(),english[key]);
 if(key.startsWith('Štúdium: '))return 'Study: '+translated(key.slice(9),lang);
 if(key.startsWith('Oficiálna pozvánka: '))return 'Official invitation: '+translated(key.slice('Oficiálna pozvánka: '.length),lang);
 if(key===key.toUpperCase()){
  const match=Object.keys(english).find(k=>k.toUpperCase()===key);
  if(match)return english[match].toUpperCase();
 }
 return text;
}
export function withBase(path:string):string{
 const base=import.meta.env.BASE_URL.replace(/\/$/,'');
 if(!base||!path.startsWith('/')||path.startsWith('//')||path===base||path.startsWith(base+'/')||path.startsWith(base+'?'))return path;
 return base+path;
}
export function localizedHref(href:string,lang:Lang){
 if(/^\/(skola-subory|images|fonts)\//.test(href)||lang==='sk'||!href.startsWith('/')||href.startsWith('//')||/[?&]lang=/.test(href))return withBase(href);
 const [path,hash]=href.split('#');return withBase(path)+(path.includes('?')?'&':'?')+'lang=en'+(hash?'#'+hash:'');
}
// Translate the rendered presentation tree, including accessible names and linked routes.
// All content stays in React; language switching never rewrites the DOM after rendering.
export function localize(node:ReactNode,lang:Lang):ReactNode{
 if(typeof node==='string')return translated(node,lang);
 if(!isValidElement(node))return Array.isArray(node)?Children.map(node,n=>localize(n,lang)):node;
 const element=node as ReactElement<Record<string,unknown>>;
 const props:Record<string,unknown>={};
 for(const key of ['aria-label','placeholder','alt','label','text','title']){
  const value=element.props[key];
  if(value!==undefined)props[key]=typeof value==='string'?translated(value,lang):localize(value as ReactNode,lang);
 }
 if(typeof element.props.href==='string'){
  props.href=localizedHref(element.props.href,lang);
  if(element.props.href.startsWith('/')&&!/^\/(skola-subory|images|fonts)\//.test(element.props.href)){props.target=undefined;props.rel=undefined;}
 }
 if(typeof element.props.src==='string')props.src=withBase(element.props.src);
 if(typeof element.type==='function')props.lang=lang;
 if(element.props.children!==undefined)props.children=Children.map(element.props.children as ReactNode,n=>localize(n,lang));
 return cloneElement(element,props);
}
