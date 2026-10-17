// Pure validation only. The embed must consume this result, not raw config.
export function calSettings(config={}){
  const demo={mode:'demo',calLink:'',url:'',namespace:'velora-valuation'};
  if(config.provider!=='cal.com'||config.mode!=='live'||config.authorized!==true)return demo;
  const value=typeof config.calLink==='string'?config.calLink.trim():'';
  let path=value;
  if(value.startsWith('https://')){
    try{
      const url=new URL(value);
      if(url.origin!=='https://cal.com'||url.username||url.password||url.search||url.hash)return demo;
      path=url.pathname.replace(/^\//,'');
    }catch{return demo;}
  }
  path=path.replace(/\/$/,'');
  // Only public event paths; no query strings, personal form values or credentials.
  if(!/^(?:[a-z0-9][a-z0-9_-]*\/){1,2}[a-z0-9][a-z0-9_-]*$/i.test(path))return demo;
  return {mode:'live',calLink:path,url:'https://cal.com/'+path,namespace:/^[a-z][a-z0-9-]{0,48}$/.test(config.namespace??'')?config.namespace:demo.namespace};
}
