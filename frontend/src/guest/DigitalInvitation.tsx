import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

export default function DigitalInvitation() {
  const { guestName } = useParams<{ guestName: string }>();
  const [isOpen, setIsOpen] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState('');
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  const formattedGuestName = guestName ? decodeURIComponent(guestName).replace(/[+_-]/g, ' ') : 'Tamu Undangan';

  const handleRSVP = (e: React.FormEvent) => {
    e.preventDefault();
    setRsvpSubmitted(true);
  };

  if (!isOpen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-container px-6">
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 40 L40 0 M0 0 L40 40" fill="none" stroke="#B89336" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#pattern)" />
          </svg>
        </div>
        
        <div className="bg-surface-container-lowest/90 backdrop-blur-md p-10 rounded-3xl shadow-2xl max-w-md w-full text-center relative border border-secondary-container/20">
          <span className="text-secondary-fixed text-xs font-bold uppercase tracking-widest bg-secondary-container px-3 py-1 rounded-full mb-6 inline-block">
            Walimatul 'Urs
          </span>
          <h2 className="text-3xl font-serif text-primary mb-2">Yusuf &amp; Zulaikha</h2>
          <p className="text-sm text-on-surface-variant font-body mb-8">Selasa, 26 Mei 2026</p>
          
          <div className="bg-surface-container-low p-6 rounded-2xl mb-8">
            <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-1">Kepada Yth. Bapak/Ibu/Saudara/i</p>
            <h3 className="text-xl font-bold text-primary font-body">{formattedGuestName}</h3>
          </div>
          
          <button 
            onClick={() => setIsOpen(true)}
            className="w-full bg-primary text-on-primary py-4 rounded-xl font-bold hover:scale-[1.02] transition-transform shadow-xl shadow-primary/10 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">drafts</span>
            Buka Undangan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface min-h-screen pb-24 text-on-surface relative font-body">
      {/* Decorative top border */}
      <div className="h-2 bg-gradient-to-r from-primary via-secondary to-primary w-full"></div>

      {/* Main Container */}
      <div className="max-w-xl mx-auto px-6 pt-12 space-y-16">
        
        {/* Cover Section */}
        <section className="text-center space-y-4">
          <span className="text-secondary text-sm uppercase tracking-[0.2em] block font-semibold">Walimatul 'Urs</span>
          <h1 className="text-5xl font-serif text-primary">Yusuf &amp; Zulaikha</h1>
          <p className="text-on-surface-variant max-w-sm mx-auto text-sm">
            Maha suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan.
          </p>
          <div className="h-64 rounded-3xl overflow-hidden shadow-xl border border-secondary-container/20">
            <img 
              className="w-full h-full object-cover" 
              src="/images/invitation-cover.jpg" 
              alt="Wedding celebration"
            />
          </div>
        </section>

        {/* Ayat Section */}
        <section className="bg-surface-container-low p-8 rounded-3xl text-center space-y-4 border border-secondary-container/10">
          <span className="material-symbols-outlined text-4xl text-secondary">menu_book</span>
          <p className="font-serif italic text-primary leading-relaxed">
            "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berfikir."
          </p>
          <p className="text-xs uppercase tracking-widest text-secondary font-bold font-body">QS. Ar-Rum: 21</p>
        </section>

        {/* Mempelai Section */}
        <section className="space-y-8">
          <h2 className="text-3xl text-center text-primary font-serif">Mempelai</h2>
          
          <div className="space-y-6">
            <div className="bg-surface-container-lowest p-6 rounded-2xl text-center shadow-sm">
              <h3 className="text-2xl font-serif text-primary">Yusuf Al-Fatih</h3>
              <p className="text-sm text-secondary font-semibold mt-1">Putra dari Bpk. Ahmad &amp; Ibu Fatimah</p>
            </div>
            
            <div className="text-center font-serif text-2xl text-secondary">&amp;</div>

            <div className="bg-surface-container-lowest p-6 rounded-2xl text-center shadow-sm">
              <h3 className="text-2xl font-serif text-primary">Zulaikha Humaira</h3>
              <p className="text-sm text-secondary font-semibold mt-1">Putri dari Bpk. Rahman &amp; Ibu Aisyah</p>
            </div>
          </div>
        </section>

        {/* Acara Section */}
        <section className="bg-primary-container text-white p-8 rounded-3xl space-y-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <rect width="100%" height="100%" fill="currentColor" />
            </svg>
          </div>
          
          <h2 className="text-3xl text-center text-secondary-fixed font-serif relative z-10">Agenda Acara</h2>
          
          <div className="grid grid-cols-1 gap-6 relative z-10">
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl space-y-2">
              <span className="material-symbols-outlined text-secondary-fixed text-3xl">favorite</span>
              <h3 className="text-xl font-serif">Akad Nikah</h3>
              <p className="text-sm text-white/80">Pukul 08:00 - 10:00 WIB</p>
              <p className="text-sm text-white/80">Masjid Al-Husna Grand Ballroom</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl space-y-2">
              <span className="material-symbols-outlined text-secondary-fixed text-3xl">restaurant</span>
              <h3 className="text-xl font-serif">Resepsi</h3>
              <p className="text-sm text-white/80">Pukul 11:00 - 13:00 WIB</p>
              <p className="text-sm text-white/80">Masjid Al-Husna Grand Ballroom</p>
            </div>
          </div>
        </section>

        {/* RSVP Section */}
        <section id="rsvp" className="bg-surface-container-low p-8 rounded-3xl space-y-6 border border-secondary-container/10">
          <h2 className="text-3xl text-center text-primary font-serif">Konfirmasi Kehadiran</h2>
          
          {rsvpSubmitted ? (
            <div className="text-center py-8 space-y-3">
              <span className="material-symbols-outlined text-5xl text-secondary">check_circle</span>
              <h3 className="text-xl font-bold text-primary">Jazakumullah Khairan!</h3>
              <p className="text-sm text-on-surface-variant">Konfirmasi kehadiran Anda telah tersimpan.</p>
            </div>
          ) : (
            <form onSubmit={handleRSVP} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">Nama Tamu</label>
                <input 
                  type="text" 
                  value={formattedGuestName} 
                  disabled 
                  className="w-full bg-surface-container-lowest border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary/20 opacity-70"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">Status Kehadiran</label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    type="button"
                    onClick={() => setRsvpStatus('Hadir')}
                    className={`py-3 rounded-xl font-semibold text-sm transition-all border ${rsvpStatus === 'Hadir' ? 'bg-primary text-on-primary border-primary' : 'bg-surface-container-lowest text-on-surface-variant border-transparent'}`}
                  >
                    Hadir
                  </button>
                  <button 
                    type="button"
                    onClick={() => setRsvpStatus('Tidak Hadir')}
                    className={`py-3 rounded-xl font-semibold text-sm transition-all border ${rsvpStatus === 'Tidak Hadir' ? 'bg-primary text-on-primary border-primary' : 'bg-surface-container-lowest text-on-surface-variant border-transparent'}`}
                  >
                    Tidak Hadir
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={!rsvpStatus}
                className="w-full bg-primary text-on-primary py-4 rounded-xl font-bold hover:scale-[1.02] transition-all disabled:opacity-50 disabled:scale-100"
              >
                Kirim Konfirmasi
              </button>
            </form>
          )}
        </section>

        {/* Gift Section / Digital Envelope */}
        <section className="bg-surface-container-lowest p-8 rounded-3xl text-center space-y-6 shadow-sm border border-secondary-container/10">
          <h2 className="text-3xl text-primary font-serif">Kado Digital</h2>
          <p className="text-sm text-on-surface-variant">
            Doa restu Anda merupakan karunia terindah bagi kami. Namun jika Anda ingin memberikan tanda kasih, dapat mengirimkan melalui:
          </p>
          <div className="bg-surface-container-low p-6 rounded-2xl space-y-4 max-w-sm mx-auto text-left">
            <div>
              <span className="text-xs text-on-surface-variant uppercase tracking-widest font-bold block">Bank Syariah Indonesia</span>
              <span className="text-lg font-bold text-primary block">7123 4567 89</span>
              <span className="text-xs text-on-surface-variant font-semibold">a.n. Yusuf Al-Fatih</span>
            </div>
            <hr className="border-outline-variant/30" />
            <div>
              <span className="text-xs text-on-surface-variant uppercase tracking-widest font-bold block">Alamat Kirim Kado</span>
              <span className="text-sm font-semibold text-primary block">Perumahan Harmoni Blok A No. 12, Jakarta</span>
            </div>
          </div>
        </section>
        
      </div>
    </div>
  );
}
