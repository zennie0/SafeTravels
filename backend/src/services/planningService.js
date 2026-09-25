import { findActivities } from './serpService.js';
import { arrangeWithGemini } from './geminiService.js';

const DAY_SLOTS=['09:30','12:30','15:30','18:00'];
function daysInclusive(start,end){if(!start||!end)return 1;const first=new Date(`${start}T00:00:00Z`),last=new Date(`${end}T00:00:00Z`);if(!Number.isFinite(+first)||!Number.isFinite(+last)||last<first)throw Object.assign(new Error('Departure must be on or after arrival.'),{status:400});return Math.floor((last-first)/86400000)+1;}

// Gemini arranges real SerpAPI listings; a deterministic fallback keeps planning available if Gemini is not configured or is temporarily unavailable.
export async function buildItinerary({destination,startDate,endDate,preferences=[],activities=[]}){
 if(!destination?.trim())throw Object.assign(new Error('Destination is required.'),{status:400});
 const dayCount=daysInclusive(startDate,endDate);
 let candidates=activities.map(a=>({title:a.title||a.name,category:a.category||a.type,address:a.address,distanceKm:a.distanceKm,thumbnail:a.thumbnail||a.image,link:a.link,gps:a.gps,rating:a.rating})).filter(a=>a.title);
 if(!candidates.length){const query=preferences.length?preferences.join(' '):'popular attractions and activities';const found=await findActivities({destination,query});candidates=found.map(p=>({title:p.name,category:p.type,address:p.address,thumbnail:p.thumbnail,link:p.link,gps:p.gps,rating:p.rating}));}
 if(!candidates.length)return{activities:[],notScheduled:[],suggestions:[],note:'SerpAPI did not return activities for this destination. Try a broader destination or search term.'};
 candidates.sort((a,b)=>(Number(b.rating)||0)-(Number(a.rating)||0));
 const capacity=dayCount*DAY_SLOTS.length,selected=candidates.slice(0,capacity);
 let arranged=null,planner='rules',plannerNote='';
 try{
  arranged=await arrangeWithGemini({destination,startDate:startDate||new Date().toISOString().slice(0,10),dayCount,activities:selected,slots:DAY_SLOTS});
  if(arranged)planner='gemini';
  else plannerNote='GEMINI_API_KEY is not configured, so a standard time-slot schedule was used.';
 }catch(error){plannerNote='Gemini was unavailable, so a standard time-slot schedule was used.';}
 const allowed=new Map(selected.map(activity=>[activity.title.toLowerCase(),activity]));
 const seen=new Set(),usedSlots=new Set();
 const aiSchedule=Array.isArray(arranged?.activities)?arranged.activities:[];
 const valid=aiSchedule.filter(item=>{
  const title=String(item.title||'').toLowerCase(),day=Number(item.day),time=String(item.time||''),slot=`${day}:${time}`;
  if(!allowed.has(title)||seen.has(title)||!Number.isInteger(day)||day<1||day>dayCount||!DAY_SLOTS.includes(time)||usedSlots.has(slot))return false;
  seen.add(title);usedSlots.add(slot);return true;
 });
 const byTitle=new Map(valid.map(item=>[String(item.title).toLowerCase(),item]));
 const baseDate=new Date(`${startDate||new Date().toISOString().slice(0,10)}T00:00:00Z`);
 const scheduled=selected.map((activity,index)=>{
  const ai=byTitle.get(activity.title.toLowerCase());
  let dayNumber=ai?Number(ai.day):null,time=ai?.time;
  if(!ai){outer:for(let day=1;day<=dayCount;day++)for(const slotTime of DAY_SLOTS)if(!usedSlots.has(`${day}:${slotTime}`)){dayNumber=day;time=slotTime;usedSlots.add(`${day}:${slotTime}`);break outer;}}
  if(!dayNumber){dayNumber=Math.floor(index/DAY_SLOTS.length)+1;time=DAY_SLOTS[index%DAY_SLOTS.length];}
  const dayOffset=dayNumber-1,day=new Date(baseDate);
  day.setUTCDate(day.getUTCDate()+dayOffset);
  return{...activity,day:day.toISOString().slice(0,10),time,durationMinutes:activity.durationMinutes||90,reason:ai?'Gemini organized this selected activity into your available trip time.':'Scheduled in a standard time slot.'};
 }).sort((a,b)=>a.day.localeCompare(b.day)||a.time.localeCompare(b.time));
 const notScheduled=candidates.slice(capacity);
 if(planner==='gemini'&&valid.length<selected.length)plannerNote='Some Gemini schedule suggestions were invalid, so remaining activities were placed in open time slots.';
 let suggestions=[];
 if(notScheduled.length){const extras=await findActivities({destination,query:`short local activities and nearby alternatives ${preferences.join(' ')}`});const chosen=new Set(candidates.map(a=>a.title.toLowerCase()));suggestions=extras.filter(p=>!chosen.has(p.name.toLowerCase())).slice(0,3).map(p=>({title:p.name,category:p.type,address:p.address,thumbnail:p.thumbnail,link:p.link,rating:p.rating}));}
 return{activities:scheduled,notScheduled,suggestions,capacity,days:dayCount,planner,plannerNote,note:`Scheduled up to ${DAY_SLOTS.length} activities per day. Times are planning estimates; check actual opening hours and travel routes.`};
}
