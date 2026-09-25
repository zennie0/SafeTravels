import React from 'react';
import { ArrowDown, ArrowRight, CalendarDays, Check, Compass, Instagram, Linkedin, MapPin, Menu, Route, Shield, ShieldCheck, Sparkles, Twitter } from 'lucide-react';

const features = [
  { icon: <Compass size={20}/>, title: 'A trip that fits you', text: 'Choose your destination and dates, then shape a schedule around what you actually want to do.' },
  { icon: <MapPin size={20}/>, title: 'Places worth the stop', text: 'Compare real hotel and activity listings, with photos and helpful details in one place.' },
  { icon: <Shield size={20}/>, title: 'Help, when you need it', text: 'Find nearby hospitals, police stations, shelters, and roadside support from your location.' },
];

export default function HomePage({ onStart, onSignIn }) {
  return <div className="public-home">
    <header className="public-nav">
      <a href="#top" className="public-brand" aria-label="SafeTravels home"><span><ShieldCheck size={21}/></span>safe<b>travels</b></a>
      <nav aria-label="Main navigation"><a href="#product">What we do</a><a href="#about">About</a><a href="#mission">Our motive</a><a href="#founders">Founders</a></nav>
      <div className="public-nav-actions"><button className="public-login" onClick={onSignIn}>Log in</button><button className="public-nav-cta" onClick={onStart}>Start planning <ArrowRight size={15}/></button></div>
    </header>

    <main id="top">
      <section className="public-hero">
        <div className="hero-grid-glow"/>
        <div className="public-hero-copy"><span className="public-eyebrow"><Sparkles size={14}/> PLAN WITH CLARITY. TRAVEL WITH CONFIDENCE.</span>
          <h1>Go further.<br/><span>Feel more ready.</span></h1>
          <p>Bring every part of your trip together—from the place you stay to the places you’ll go—with nearby help easy to find along the way.</p>
          <div className="public-hero-actions"><button className="public-primary" onClick={onStart}>Plan your next trip <ArrowRight size={17}/></button><a href="#product" className="public-secondary">Explore SafeTravels <ArrowDown size={16}/></a></div>
          <div className="hero-proof"><span><Check size={14}/> Stays and activities</span><span><Check size={14}/> One clear itinerary</span><span><Check size={14}/> Nearby support</span></div>
        </div>
        <div className="public-hero-art" aria-label="Trip plan and destination preview">
          <div className="hero-orbit orbit-one"/><div className="hero-orbit orbit-two"/>
          <div className="hero-photo-card"><img src="https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1100&q=85" alt="Coastal town and sea"/><div className="hero-photo-shade"/><div className="hero-place"><MapPin size={15}/><span><small>UP NEXT</small><b>Somewhere wonderful</b></span></div></div>
          <div className="floating-trip-card"><span className="floating-icon"><CalendarDays size={17}/></span><span><small>YOUR TRIP, ALL TOGETHER</small><b>Stay · Plan · Explore</b></span><span className="floating-check"><Check size={14}/></span></div>
          <div className="floating-safety"><ShieldCheck size={18}/><span><b>Nearby support</b><small>Ready when you need it</small></span><i/></div>
        </div>
        <a href="#product" className="hero-scroll">SCROLL TO EXPLORE <span/></a>
      </section>

      <section id="product" className="public-section product-section"><div className="section-intro"><span className="public-eyebrow">THE WHOLE JOURNEY, IN ONE PLACE</span><h2>Travel plans with<br/><span>room to breathe.</span></h2><p>Less tab-hopping before you go. Less guesswork when you get there.</p></div>
        <div className="public-feature-grid">{features.map((item,index)=><article className="public-feature" key={item.title}><div className="feature-top"><span className="feature-icon">{item.icon}</span><span className="feature-index">0{index+1}</span></div><h3>{item.title}</h3><p>{item.text}</p><span className="feature-line"/></article>)}</div>
        <div className="product-ribbon"><div className="ribbon-icon"><Route size={19}/></div><p><b>One thoughtful plan.</b> Your stay, activities, schedule, and safety information connected from the start.</p><button onClick={onStart}>Build a trip <ArrowRight size={15}/></button></div>
      </section>

      <section id="about" className="public-section about-section"><div className="about-visual"><div className="about-map-lines"/><div className="map-pin pin-a"><MapPin size={18}/></div><div className="map-pin pin-b"><MapPin size={18}/></div><div className="map-pin pin-c"><ShieldCheck size={19}/></div><div className="about-route-line"/><div className="about-coordinate">TRIP COORDINATES <b>YOU · YOUR PLAN · PEACE OF MIND</b></div></div><div className="about-copy"><span className="public-eyebrow">ABOUT SAFETRAVELS</span><h2>Travel is better when the details feel <span>handled.</span></h2><p>SafeTravels is a travel-planning and safety companion designed to make the entire journey easier to prepare for. Pick a destination, explore stays and activities, turn your choices into a schedule, and keep local support within reach.</p><p>It’s a calmer way to move from “where should we go?” to “we’re here.”</p><button className="about-link" onClick={onStart}>Start with your destination <ArrowRight size={15}/></button></div></section>

      <section id="mission" className="mission-section"><div className="mission-stars">✳ <span>✦</span> ✳</div><span className="public-eyebrow">WHY WE’RE BUILDING THIS</span><h2>More wonder in the journey.<br/><span>More confidence in the plan.</span></h2><p>We believe preparation should make travel feel freeing, not complicated. Our motive is simple: help people spend less energy coordinating the trip and feel more prepared if something unexpected happens.</p><div className="mission-values"><div><b>01</b><span>Make planning feel simple</span></div><div><b>02</b><span>Keep useful details together</span></div><div><b>03</b><span>Make nearby help easier to find</span></div></div></section>

      <section id="founders" className="public-section founders-section"><div className="founder-mark"><div className="founder-orbit"><span/><ShieldCheck size={43}/></div><div className="founder-caption"><Sparkles size={14}/> A HUMAN FIRST IDEA</div></div><div className="founder-copy"><span className="public-eyebrow">A NOTE FROM THE FOUNDING TEAM</span><h2>Built around one simple belief.</h2><blockquote>“Every traveler deserves a plan that feels clear—and a next step that feels easier to find when plans change.”</blockquote><p>SafeTravels is being shaped by that belief. We’re bringing trip planning and practical safety information together, so the journey can feel more considered from the first idea to the trip home.</p><span className="founder-signature">The SafeTravels founding team <span>✳</span></span></div></section>

      <section className="public-cta"><div className="cta-glow"/><span className="public-eyebrow">YOUR NEXT STORY STARTS SOMEWHERE</span><h2>Let’s make getting there<br/>feel like part of the fun.</h2><p>Choose a place. We’ll help you bring the details together.</p><button className="public-primary" onClick={onStart}>Plan your next trip <ArrowRight size={17}/></button></section>
    </main>

    <footer className="public-footer"><div className="footer-main"><div className="footer-brand-column"><a href="#top" className="public-brand"><span><ShieldCheck size={20}/></span>safe<b>travels</b></a><p>Thoughtful plans for the places you’re going—and the moments in between.</p><div className="footer-socials"><a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={17}/></a><a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={17}/></a><a href="https://x.com/" target="_blank" rel="noreferrer" aria-label="X"><Twitter size={17}/></a></div></div>
        <div className="footer-links"><b>EXPLORE</b><a href="#product">What we do</a><a href="#about">About us</a><a href="#mission">Our motive</a><a href="#founders">Founders</a></div><div className="footer-links"><b>GET STARTED</b><button onClick={onStart}>Plan a trip</button><button onClick={onSignIn}>Log in / Sign up</button><a href="mailto:careers@safetravels.app">Careers</a></div><div className="footer-contact"><b>HAVE A QUESTION?</b><a href="mailto:hello@safetravels.app">hello@safetravels.app</a><span>Made for the curious, wherever you’re headed.</span></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} SafeTravels. Travel thoughtfully.</span><div><a href="mailto:hello@safetravels.app?subject=Privacy">Privacy</a><a href="mailto:hello@safetravels.app?subject=Terms">Terms</a><span>Stay curious <Sparkles size={13}/></span></div></div></footer>
  </div>;
}
