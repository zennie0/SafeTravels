const endpoint='https://serpapi.com/search.json';
// Shared SerpAPI transport. Provider keys remain server-side; each feature below chooses its own search engine.
async function search(params){
 if(!process.env.SERPAPI_API_KEY)throw Object.assign(new Error('SERPAPI_API_KEY is not configured'),{status:503});
 const url=new URL(endpoint);for(const [key,value] of Object.entries({...params,api_key:process.env.SERPAPI_API_KEY}))if(value!==undefined&&value!==null&&value!=='')url.searchParams.set(key,String(value));
 const response=await fetch(url);if(!response.ok)throw Object.assign(new Error(`SerpAPI returned ${response.status}`),{status:502});const data=await response.json();if(data.error)throw Object.assign(new Error(data.error),{status:502});return data;
}
// Google Hotels engine returns price, review, and property data for hotel comparisons.
export async function findHotels({destination,checkIn,checkOut,adults=1,currency='USD'}){
 const data=await search({engine:'google_hotels',q:destination,check_in_date:checkIn,check_out_date:checkOut,adults,currency});
 return(data.properties||[]).map(h=>({name:h.name,rating:h.overall_rating,reviews:h.reviews,price:h.rate_per_night?.lowest,address:h.description,link:h.link,thumbnail:h.thumbnail||h.images?.[0]?.original_image||h.images?.[0]?.thumbnail,images:(h.images||[]).map(i=>i.original_image||i.thumbnail).filter(Boolean),amenities:h.amenities||[]}));
}
// Google Maps engine is purpose-built for activity discovery and location-rich local listings.
export async function findActivities({destination,query='things to do',lat,lng}){
 const params={engine:'google_maps',type:'search',q:`${query} in ${destination}`};if(lat!=null&&lng!=null){params.ll=`@${lat},${lng},14z`;}
 const data=await search(params);return(data.local_results||[]).map(p=>({name:p.title,rating:p.rating,reviews:p.reviews,address:p.address,gps:p.gps_coordinates,type:p.type,thumbnail:p.thumbnail||p.images?.[0],link:p.website||p.link}));
}
// General Google Search is separate from maps/hotels for travel research and web results.
export async function googleSearch({query,location,language='en',country='us'}){
 const data=await search({engine:'google',q:query,location,hl:language,gl:country,num:8});
 return(data.organic_results||[]).map(r=>({title:r.title,snippet:r.snippet,link:r.link,source:r.source,date:r.date}));
}
const emergencyKinds={standard:{hospital:'hospital',police:'police station',shelter:'emergency shelter',garage:'roadside assistance car repair'},urgent:{hospital:'hospital emergency department',police:'emergency police station',shelter:'crisis shelter',garage:'emergency roadside assistance towing'}};
const radians=n=>n*Math.PI/180;
function distanceKm(a,b){const R=6371,dLat=radians(b.lat-a.lat),dLon=radians(b.lng-a.lng),x=Math.sin(dLat/2)**2+Math.cos(radians(a.lat))*Math.cos(radians(b.lat))*Math.sin(dLon/2)**2;return R*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x));}
// Emergency listings come from a distinct Maps search for every support category. GPS distances are recalculated locally, then sorted so nearby results appear first.
export async function findEmergencyPlaces({lat,lng,level='standard'}){
 const origin={lat:Number(lat),lng:Number(lng)};
 const groups=await Promise.all(Object.entries(emergencyKinds[level]||emergencyKinds.standard).map(async([kind,query])=>{
  const data=await search({engine:'google_maps',type:'search',q:query,ll:`@${origin.lat},${origin.lng},15z`});
  return(data.local_results||[]).map(p=>{const gps=p.gps_coordinates;const km=gps?.latitude!=null&&gps?.longitude!=null?distanceKm(origin,{lat:Number(gps.latitude),lng:Number(gps.longitude)}):null;return{kind,name:p.title,rating:p.rating,reviews:p.reviews,address:p.address,gps,phone:p.phone,openState:p.open_state,distanceKm:km,link:p.website||p.link,directionsUrl:`https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${encodeURIComponent(p.title||query)}`};});
 }));
 return groups.flat().sort((a,b)=>{if(a.distanceKm==null&&b.distanceKm==null)return 0;if(a.distanceKm==null)return 1;if(b.distanceKm==null)return -1;return a.distanceKm-b.distanceKm;});
}
// Weather is a Google Search knowledge panel query, not a Maps or Hotels query.
export async function findWeather({destination}){const data=await search({engine:'google',q:`weather ${destination}`});return data.weather_result||null;}







