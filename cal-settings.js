// Pure validation only. The embed must consume this result, not raw config.
export function calSettings(config={}){
  const demo={mode:'demo',calLink:'',url:'',namespace:'velora-valuation',timeZone:''};
  if(config.provider!=='cal.com'||config.mode!=='live'||config.authorized!==true)return demo;
  // A public link alone does not establish the clinic's scheduling time zone.
  if(typeof config.timeZone!=='string'||!(/^[A-Za-z_]+(?:\/[A-Za-z0-9_+.-]+)+$|^UTC$/.test(config.timeZone)))return demo;
  try{new Intl.DateTimeFormat('es-AR',{timeZone:config.timeZone}).format();}catch{return demo;}
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
  return {mode:'live',calLink:path,url:'https://cal.com/'+path,timeZone:config.timeZone,namespace:/^[a-z][a-z0-9-]{0,48}$/.test(config.namespace??'')?config.namespace:demo.namespace};
}
