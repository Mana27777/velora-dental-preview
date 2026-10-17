// Official inline SDK, loaded only for an authorized live calendar.
let loading;
export function loadCal(){
  if(window.Cal?.fingerprint)return Promise.resolve(window.Cal);
  if(loading)return loading;
  loading=new Promise((resolve,reject)=>{
    if(!window.Cal){
      const cal=function(...args){
        if(args[0]==='init'&&typeof args[1]==='string'){
          const namespace=args[1];
          const api=(...values)=>api.q.push(values);api.q=[];
          cal.ns[namespace]??=api;cal.ns[namespace].q.push(args);
          cal.q.push(['initNamespace',namespace]);
        }else cal.q.push(args);
      };
      cal.q=[];cal.ns={};window.Cal=cal;
    }
    const script=document.createElement('script');
    script.src='https://app.cal.com/embed/embed.js';script.async=true;
    script.onload=()=>resolve(window.Cal);
    script.onerror=()=>{loading=undefined;script.remove();reject(new Error('Calendar unavailable'));};
    document.head.append(script);
  });
  return loading;
}
