// A tight projected silhouette keeps touch capture on the product, not the page.
export function convexHull(points){
  const sorted=points.filter(p=>Number.isFinite(p.x+p.y)).sort((a,b)=>a.x-b.x||a.y-b.y);
  if(sorted.length<3)return sorted;
  const cross=(a,b,c)=>(b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);
  const lower=[],upper=[];
  for(const p of sorted){while(lower.length>1&&cross(lower.at(-2),lower.at(-1),p)<=0)lower.pop();lower.push(p);}
  for(const p of sorted.slice().reverse()){while(upper.length>1&&cross(upper.at(-2),upper.at(-1),p)<=0)upper.pop();upper.push(p);}
  return lower.slice(0,-1).concat(upper.slice(0,-1));
}
