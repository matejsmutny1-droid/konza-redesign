'use client';
import {ArrowLeft,ArrowRight,FileText,Download,Mail} from 'lucide-react';
import {localize,translated,type Lang} from './i18n';
import type {ContentPage,ContentBlock,ContentLink} from './content/types';
const schoolLinks=[['Pedagógovia','o-skole/pedagogovia'],['Vedenie školy','o-skole/manazment'],['História školy','o-skole/historia-skoly'],['Umelecká rada','o-skole/umelecka-rada'],['Rada školy','o-skole/rada-skoly'],['Združenie rodičov','o-skole/zdruzenie-rodicov-skoly'],['Zriaďovateľ','o-skole/zriadovatel'],['Priestory školy','o-skole/priestory'],['Videá zo školy','galeria/videa']];
const studyLinks=[['Informácie o štúdiu','pre-uchadzacov/informacie-o-studiu'],['Prijímacie konanie','pre-uchadzacov/prijimacie-konanie'],['Metodický deň','pre-uchadzacov/metodicky-den'],['Ubytovanie a stravovanie','pre-uchadzacov/ubytovanie-a-stravovanie'],['Študijné oddelenie','kontakt/studijne-oddelenie']];
const studentLinks=[['Mesačný plán','kalendar/mesacny-plan'],['Ročný plán','kalendar/rocny-plan'],['Dokumenty','dokumenty'],['Tlačivá','tlaciva'],['Knižnica','pre-ziakov/kniznica'],['Maturitná skúška','pre-ziakov/maturitna-skuska'],['Absolventská skúška','pre-ziakov/absolventska-skuska']];
function LocalLink({link,lang='sk'}:{link:ContentLink;lang?:Lang}){return localize(renderLink(link),lang);}
function renderLink(link:ContentLink){
 if(!link.href||link.unavailable)return <div className="article-file unavailable"><FileText size={18}/><span><strong>{link.text}</strong><small>Súbor zatiaľ nie je dostupný.</small></span></div>;
 const file=/\.(pdf|docx?|xlsx?|zip|rtf|txt)(?:\?|$)/i.test(link.href);
 return <a className={`article-file ${file?'download':''}`} href={link.href} {...(file?{download:true}:{})}><FileText size={18}/><span><strong>{link.text}</strong>{file&&<small>{link.href.split('.').pop()?.toUpperCase()} · na stiahnutie</small>}</span>{file?<Download size={17}/>:<ArrowRight size={17}/>}</a>;
}
function Block({block,title,lang='sk'}:{block:ContentBlock;title:string;lang?:Lang}){return localize(renderBlock(block,title,lang),lang);}
function renderBlock(b:ContentBlock,title:string,lang:Lang){
 if(b.type==='heading')return <h2>{b.text}</h2>;
 if(b.type==='paragraph'){
  if(b.text&&/^[\w.\-+]+@[\w.\-]+\.[a-z]+$/i.test(b.text))return <p><a className="inline-contact" href={`mailto:${b.text}`}><Mail size={15}/>{b.text}</a></p>;
  if(b.text&&/^\+?[\d\s]{9,16}$/.test(b.text))return <p><a href={`tel:${b.text.replaceAll(' ','')}`}>{b.text}</a></p>;
  const text=translated(b.text||'',lang);
  if(text.length>1400){const sentences=text.match(/[^.!?]+(?:[.!?]+(?=\s|$)|$)/g)||[text];const parts:string[]=[];let current='';for(const sentence of sentences){if(current.length>550){parts.push(current.trim());current='';}current+=sentence;}if(current.trim())parts.push(current.trim());return <div className="article-longcopy">{parts.map((p,i)=><p key={i}>{p}</p>)}</div>;}
  return <p>{text}</p>;
 }
 if(b.type==='link')return <LocalLink link={b as ContentLink}/>;
 if(b.type==='list')return <ul>{b.items?.map((s,i)=><li key={i}>{s}</li>)}</ul>;
 if(b.type==='image'&&b.src)return <figure className="article-image"><a href={b.src} target="_blank" rel="noreferrer" aria-label="Zobraziť fotografiu vo väčšom rozlíšení"><img src={b.src} alt={b.alt||title} loading="lazy"/></a></figure>;
 if((b.type==='video'||b.type==='embed')&&b.src){
  let allowed=false;try{const u=new URL(b.src);allowed=['www.youtube.com','www.youtube-nocookie.com','player.vimeo.com','www.google.com'].includes(u.hostname);}catch{}
  return allowed?<div className={`article-embed ${b.type}`}><iframe src={b.src} title={title} loading="lazy" allow="fullscreen; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/></div>:null;
 }
 if(b.type==='person')return <section className="faculty-person">{b.src&&<img src={b.src} alt={b.name||title} loading="lazy"/>}<div><h2>{b.name}</h2><p>{b.text}</p><div className="faculty-actions">{b.email&&<a href={`mailto:${b.email}`}><Mail size={15}/>{b.email}</a>}{b.document&&<a href={b.document} download><FileText size={15}/>Profesijný profil</a>}</div></div></section>;
 if(b.type==='table')return <div className="article-table-wrap"><table><tbody>{b.rows?.filter(row=>row.some(c=>c.text||c.links?.length)).map((row,i)=><tr key={i}>{row.map((cell,j)=><td key={j}>{cell.text&&cell.text.replace(/\s+/g,' ').trim()!==(cell.links||[]).map(l=>l.text).join(' ').replace(/\s+/g,' ').trim()&&<span>{cell.text}</span>}{cell.links?.map((l,k)=><LocalLink key={k} link={l}/>)}</td>)}</tr>)}</tbody></table></div>;
 return null;
}
export default function Article({page,lang='sk'}:{page:ContentPage;lang?:Lang}){
 const admissions=page.key.startsWith('pre-uchadzacov');
 const students=page.key.startsWith('pre-ziakov')||page.key.startsWith('dokumenty')||page.key.startsWith('tlaciva')||page.key.startsWith('kalendar');
 const parent=admissions?'/uchadzaci':students?'/studenti':'/skola';
 const parentLabel=admissions?'Pre uchádzačov':students?'Pre študentov':'O škole';
 const links=admissions?studyLinks:students?studentLinks:schoolLinks;
 return localize(<><section className="page-intro article-intro"><a className="breadcrumb" href={parent}><ArrowLeft size={13}/>{parentLabel}</a><div className="eyebrow">KONZERVATÓRIUM ŽILINA</div><h1>{page.title}</h1></section><div className="article-layout"><aside className="article-sidebar"><div className="eyebrow">ĎALŠIE INFORMÁCIE</div><nav aria-label="Súvisiace školské informácie">{links.map(([label,key])=><a key={key} href={'/informacie/'+key} aria-current={page.key===key?'page':undefined}>{label}<ArrowRight size={14}/></a>)}</nav><a className="article-office" href="/kontakt">Potrebuješ poradiť?<span>Kontaktuj školu<ArrowRight size={15}/></span></a></aside><article className={`article-content ${page.key.startsWith('galeria')?'gallery-content':''}`}>{page.blocks.map((b,i)=><Block key={i} block={b} title={page.title}/>)}<div className="article-end">{page.blocks.some(b=>b.type==='table'||b.document||b.href?.startsWith('/skola-subory/'))&&<p className="source-note">Školské dokumenty sú dostupné v pôvodnom slovenskom znení.</p>}<a href={parent}><ArrowLeft size={15}/>Späť na prehľad</a></div></article></div></>,lang);
}
