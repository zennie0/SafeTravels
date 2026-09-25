import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
const tokenFor = user => jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
const publicUser = user => ({ id: user._id, name: user.name, email: user.email, emergencyContacts: user.emergencyContacts });
export async function signup(req, res, next) { try { const { name, email, password } = req.body; if (!name || !email || !password || password.length < 8) return res.status(400).json({ message: 'Name, email and password (8+ characters) are required.' }); if (await User.findOne({ email })) return res.status(409).json({ message: 'An account with this email already exists.' }); const user = await User.create({ name, email, passwordHash: await bcrypt.hash(password, 12) }); res.status(201).json({ token: tokenFor(user), user: publicUser(user) }); } catch (e) { next(e); } }
export async function login(req, res, next) { try { const user = await User.findOne({ email: req.body.email }); if (!user || !await bcrypt.compare(req.body.password || '', user.passwordHash)) return res.status(401).json({ message: 'Email or password is incorrect.' }); res.json({ token: tokenFor(user), user: publicUser(user) }); } catch (e) { next(e); } }
export async function me(req, res, next) { try { const user = await User.findById(req.user.id).select('-passwordHash'); res.json({ user }); } catch (e) { next(e); } }
