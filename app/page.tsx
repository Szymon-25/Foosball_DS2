import { RegistrationForm } from "@/components/RegistrationForm";
import { ParticipantsTable } from "@/components/ParticipantsTable";
import { CountdownBanner } from "@/components/CountdownBanner";
import { eventConfig } from "@/config/event";
import { Calendar, MapPin, ExternalLink, ChevronDown } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen pitch-bg relative">
      <CountdownBanner />
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col justify-center items-center text-center px-4">
        <p className="text-sm font-display tracking-widest text-white/50 uppercase mb-8">Chillguys presents</p>
        <h1 className="text-6xl sm:text-8xl md:text-[10vw] leading-[0.9] font-display uppercase tracking-tighter text-balance max-w-5xl mx-auto text-accent drop-shadow-lg">
          Table Football<br/><span className="text-white">Tournament</span>
        </h1>
        <div className="flex gap-4 mt-8 mb-16 flex-wrap justify-center">
          <div className="flex items-center gap-2 bg-white/10 px-6 py-3 rounded-full font-display text-2xl tracking-wider">
            <Calendar className="text-accent" />
            {eventConfig.eventDate}
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-6 py-3 rounded-full font-display text-2xl tracking-wider">
            <MapPin className="text-accent" />
            {eventConfig.eventLocation}
          </div>
        </div>
        <a href="#register" className="bg-accent text-ink px-12 py-6 rounded-2xl text-2xl font-display uppercase tracking-widest hover:scale-105 hover:bg-white transition-all shadow-[0_0_40px_rgba(245,197,24,0.3)] duration-500 ease-out mb-8">
          Register Now
        </a>
        
        {/* Scroll Indicator */}
        <div className="flex flex-col items-center gap-2 opacity-50 animate-bounce pointer-events-none">
          <span className="text-xs uppercase tracking-[0.2em] font-bold">See rules & info</span>
          <ChevronDown size={24} />
        </div>
      </section>

      {/* Key Facts */}
      <section className="py-24 px-4 max-w-6xl mx-auto border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 flex flex-col items-start justify-center border border-white/10 rounded-3xl p-10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors duration-500">
            <span className="text-sm font-bold uppercase tracking-widest text-accent mb-2">Date & Time</span>
            <span className="text-4xl md:text-5xl font-display tracking-wide text-balance">{eventConfig.eventDate} <br/><span className="text-white/50">{eventConfig.eventTime}</span></span>
          </div>
          <div className="md:col-span-4 flex flex-col items-start justify-center border border-white/10 rounded-3xl p-10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors duration-500">
            <span className="text-sm font-bold uppercase tracking-widest text-accent mb-2">Spot</span>
            <span className="text-4xl md:text-5xl font-display tracking-wide">DS2<br/><span className="text-white/50 text-3xl">billiard room</span></span>
          </div>
          <a href="#" className="md:col-span-12 flex items-center justify-between border border-accent/20 rounded-3xl p-10 bg-gradient-to-r from-accent/10 to-transparent text-white hover:border-accent/50 transition-colors duration-500 group">
            <span className="text-4xl md:text-5xl font-display tracking-wide uppercase">View Brackets</span>
            <ExternalLink size={40} className="text-accent transform group-hover:translate-x-2 transition-transform duration-500" />
          </a>
        </div>
      </section>

      <section className="py-32 px-4 max-w-5xl mx-auto">
        <h2 className="text-5xl md:text-[6vw] leading-none font-display uppercase tracking-tighter mb-12 text-center text-white/80">Rules</h2>
        <div className="flex flex-col gap-4">
          {eventConfig.rules.map((rule, idx) => {
            return (
              <div key={idx} className="flex flex-col md:flex-row md:items-center gap-6 p-8 border border-white/5 rounded-2xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors duration-500">
                <div className="text-5xl font-display text-accent leading-none">
                  {(idx + 1).toString().padStart(2, '0')}
                </div>
                <span className="text-3xl md:text-4xl font-display tracking-wide">{rule.text}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Registration Form */}
      <section id="register" className="py-24 px-4 border-t border-white/10 bg-black/20">
        <RegistrationForm />
      </section>

      {/* Participants */}
      <section className="py-24 px-4 border-t border-white/10">
        <ParticipantsTable />
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-white/30 border-t border-white/5">
        Powered by chillguys
      </footer>
    </main>
  );
}
