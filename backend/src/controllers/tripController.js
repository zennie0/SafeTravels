import Trip from '../models/Trip.js';
import { buildItinerary } from '../services/planningService.js';
import { findActivities, findHotels, findWeather } from '../services/serpService.js';
export async function listTrips(req, res, next) { try { res.json({ trips: await Trip.find({ user: req.user.id }).sort({ startDate: 1 }) }); } catch (e) { next(e); } }
export async function createTrip(req, res, next) { try { const trip = await Trip.create({ ...req.body, user: req.user.id }); res.status(201).json({ trip }); } catch (e) { next(e); } }
export async function updateTrip(req, res, next) { try { const trip = await Trip.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, req.body, { new: true, runValidators: true }); if (!trip) return res.status(404).json({ message: 'Trip not found.' }); res.json({ trip }); } catch (e) { next(e); } }
export async function removeTrip(req, res, next) { try { const trip = await Trip.findOneAndDelete({ _id: req.params.id, user: req.user.id }); if (!trip) return res.status(404).json({ message: 'Trip not found.' }); res.status(204).end(); } catch (e) { next(e); } }
export async function hotels(req, res, next) { try { res.json({ hotels: await findHotels(req.query) }); } catch (e) { next(e); } }
export async function activities(req, res, next) { try { res.json({ activities: await findActivities(req.query) }); } catch (e) { next(e); } }
export async function itinerary(req, res, next) { try { res.json(await buildItinerary(req.body)); } catch (e) { next(e); } }
export async function weather(req, res, next) { try { res.json({ weather: await findWeather(req.query) }); } catch (e) { next(e); } }
export async function toggleActivity(req, res, next) { try { const trip = await Trip.findOne({ _id: req.params.id, user: req.user.id }); if (!trip) return res.status(404).json({ message: 'Trip not found.' }); const activity = trip.activities.id(req.params.activityId); if (!activity) return res.status(404).json({ message: 'Activity not found.' }); activity.completed = !activity.completed; await trip.save(); res.json({ activity }); } catch (e) { next(e); } }

export async function addActivity(req,res,next){try{const trip=await Trip.findOne({_id:req.params.id,user:req.user.id});if(!trip)return res.status(404).json({message:'Trip not found.'});if(!req.body.title?.trim())return res.status(400).json({message:'Activity title is required.'});trip.activities.push({...req.body,title:req.body.title.trim()});await trip.save();res.status(201).json({trip,activity:trip.activities.at(-1)});}catch(e){next(e);}}
export async function deleteActivity(req,res,next){try{const trip=await Trip.findOne({_id:req.params.id,user:req.user.id});if(!trip)return res.status(404).json({message:'Trip not found.'});const activity=trip.activities.id(req.params.activityId);if(!activity)return res.status(404).json({message:'Activity not found.'});activity.deleteOne();await trip.save();res.json({trip});}catch(e){next(e);}}

