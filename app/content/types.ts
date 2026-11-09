export type ContentLink={text:string;href?:string;unavailable?:boolean};
export type ContentBlock={type:string;text?:string;href?:string;src?:string;alt?:string;name?:string;email?:string;document?:string;unavailable?:boolean;items?:string[];rows?:{text:string;links?:ContentLink[]}[][]};
export type ContentPage={key:string;title:string;blocks:ContentBlock[];sourceUrl?:string};
