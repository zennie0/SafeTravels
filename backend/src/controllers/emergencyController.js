import Emergency from '../models/Emergency.js';
import { findEmergencyPlaces } from '../services/serpService.js';
export async function createEmergency(req,res,next){
 try{
  const {level,lat,lng,tripId}=req.body;
  if(!['standard','urgent'].includes(level))return res.status(400).json({message:'Choose standard or urgent assistance.'});
  if(!Number.isFinite(Number(lat))||!Number.isFinite(Number(lng))||Math.abs(Number(lat))>90||Math.abs(Number(lng))>180)return res.status(400).json({message:'Valid latitude and longitude are required.'});
  // Urgent mode asks SerpAPI Maps for emergency-focused nearby categories. It records the urgent level but does not contact responders or trusted contacts.
  const places=await findEmergencyPlaces({lat,lng,level});
  const emergency=await Emergency.create({user:req.user?.id,trip:tripId||undefined,level,location:{lat:Number(lat),lng:Number(lng)},places});
  res.status(201).json({emergency:{id:emergency._id,level,location:emergency.location,createdAt:emergency.createdAt},places,notificationsSent:false,message:level==='urgent'?'Urgent nearby search complete. This prototype does not notify emergency services or contacts.':'Nearby services found.'});
 }catch(e){next(e);}
}
