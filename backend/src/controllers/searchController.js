import { googleSearch } from '../services/serpService.js';
export async function searchWeb(req,res,next){try{if(!req.query.query)return res.status(400).json({message:'query is required.'});res.json({results:await googleSearch(req.query)});}catch(e){next(e);}}
