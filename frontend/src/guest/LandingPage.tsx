import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Package {
  id: number;
  name: string;
  sub_title: string;
  icon: string;
  features: string[];
  is_popular: boolean;
}

interface Portfolio {
  id: number;
  title: string;
  category: string;
  image_path: string;
}

interface Vendor {
  id: number;
  name: string;
  category: string;
  icon: string;
}

const initialPackages: Package[] = [
  {
    id: 1,
    name: 'Bronze Package',
    sub_title: 'Intimate Sanctuary',
    icon: 'stars',
    features: ['Up to 200 Guests', 'Syariah Catering Basic', 'Standard Decor Theme', 'Documentation (1 Photographer)'],
    is_popular: false
  },
  {
    id: 2,
    name: 'Gold Package',
    sub_title: 'Grand Celebration',
    icon: 'diamond',
    features: ['Up to 1000 Guests', 'Premium Syariah Buffet', 'Full Custom Decor & Floral', 'Live Cinematic Documentation'],
    is_popular: true
  },
  {
    id: 3,
    name: 'Silver Package',
    sub_title: 'Elegant Gathering',
    icon: 'workspace_premium',
    features: ['Up to 500 Guests', 'Deluxe Syariah Buffet', 'Semi-Custom Decor', 'Photo & Video Coverage'],
    is_popular: false
  }
];

const initialPortfolio: Portfolio[] = [
  {
    id: 1,
    title: 'Al-Husna Grand Wedding',
    category: 'The Royal Ballroom',
    image_path: '/images/portfolio-ballroom.jpg'
  },
  {
    id: 2,
    title: 'Culinary Excellence',
    category: 'Halal Catering',
    image_path: '/images/portfolio-catering.jpg'
  },
  {
    id: 3,
    title: 'Outdoor Serenity',
    category: 'Garden Wedding',
    image_path: '/images/portfolio-outdoor.jpg'
  }
];

const initialVendors: Vendor[] = [
  { id: 1, name: 'Luxe Halal Catering', category: 'Catering', icon: 'restaurant' },
  { id: 2, name: 'Bloom Syariah Floral', category: 'Floral', icon: 'local_florist' },
  { id: 3, name: 'Modest Moments Studio', category: 'Documentation', icon: 'camera_enhance' },
  { id: 4, name: 'Elegance Bridal Wear', category: 'Attire', icon: 'styler' }
];

export default function LandingPage() {
  const [packages, setPackages] = useState<Package[]>(initialPackages);
  const [portfolio, setPortfolio] = useState<Portfolio[]>(initialPortfolio);
  const [vendors, setVendors] = useState<Vendor[]>(initialVendors);
  const navigate = useNavigate();

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || '';
    
    // Fetch packages
    fetch(`${apiUrl}/api/packages`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch packages');
        return res.json();
      })
      .then((data) => {
        const packagesArray = Array.isArray(data) ? data : data.data;
        if (!Array.isArray(packagesArray)) throw new Error('Invalid packages data format');
        
        const mappedPackages = packagesArray.map((pkg: any) => ({
          id: pkg.id,
          name: pkg.name || pkg.package_name || 'Unnamed Package',
          sub_title: pkg.sub_title || (pkg.price ? `Rp ${Number(pkg.price).toLocaleString('id-ID')}` : 'Special Offer'),
          icon: pkg.icon || 'star',
          features: Array.isArray(pkg.features) ? pkg.features : (pkg.description ? [pkg.description] : []),
          is_popular: !!pkg.is_popular
        }));
        setPackages(mappedPackages);
      })
      .catch((err) => console.warn('Could not load packages from server, using fallback:', err));

    // Fetch portfolio
    fetch(`${apiUrl}/api/portfolio`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch portfolio');
        return res.json();
      })
      .then((data) => {
        const portfolioArray = Array.isArray(data) ? data : data.data;
        if (!Array.isArray(portfolioArray)) throw new Error('Invalid portfolio data format');
        setPortfolio(portfolioArray);
      })
      .catch((err) => console.warn('Could not load portfolio from server, using fallback:', err));

    // Fetch vendors
    fetch(`${apiUrl}/api/vendors`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch vendors');
        return res.json();
      })
      .then((data) => {
        const vendorsArray = Array.isArray(data) ? data : data.data;
        if (!Array.isArray(vendorsArray)) throw new Error('Invalid vendors data format');
        setVendors(vendorsArray);
      })
      .catch((err) => console.warn('Could not load vendors from server, using fallback:', err));
  }, []);

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col font-sans">
      {/* Navigation */}
      <nav className="w-full top-0 sticky bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-xl z-50">
        <div className="flex justify-between items-center w-full px-8 py-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <img src="/images/logo.png" alt="Logo" className="h-10 w-auto object-contain" />
            <div className="text-2xl font-serif italic text-blue-900 dark:text-blue-100">
              Dream Wedding Syariah
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a className="text-blue-900 dark:text-white border-b-2 border-teal-200 pb-1 hover:text-blue-900 dark:hover:text-blue-100 transition-colors" href="#">Home</a>
            <a className="text-blue-900/60 dark:text-slate-400 hover:text-blue-900 dark:hover:text-blue-100 transition-colors" href="#packages">Packages</a>
            <a className="text-blue-900/60 dark:text-slate-400 hover:text-blue-900 dark:hover:text-blue-100 transition-colors" href="#portfolio">Portfolio</a>
            <a className="text-blue-900/60 dark:text-slate-400 hover:text-blue-900 dark:hover:text-blue-100 transition-colors" href="#contact">Contact</a>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/admin/login')}
              className="bg-primary text-on-primary px-6 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-all"
            >
              Client Login
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative min-h-[800px] flex items-center overflow-hidden bg-surface py-12 lg:py-0">
          <div className="max-w-7xl mx-auto px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="z-10 order-2 lg:order-1">
              <span className="label-md uppercase tracking-[0.2em] text-on-secondary-container bg-secondary-container px-3 py-1 rounded-full text-xs font-semibold mb-6 inline-block">
                The Curated Sanctuary
              </span>
              <h1 className="text-6xl md:text-7xl lg:text-8xl leading-[1.1] text-primary mb-8 font-serif">
                Modern Elegance, <br />
                <span className="italic font-light">Syariah Values.</span>
              </h1>
              <p className="text-lg text-on-surface-variant max-w-md mb-10 font-body leading-relaxed">
                Where timeless traditions meet contemporary luxury. We orchestrate weddings that celebrate your faith with unparalleled sophistication.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#contact" className="bg-primary text-on-primary px-8 py-4 rounded-xl font-bold hover:scale-[1.02] transition-transform flex items-center gap-2 shadow-xl shadow-primary/10">
                  Book Consultation
                  <span className="material-symbols-outlined text-xl">arrow_forward</span>
                </a>
                <a href="#portfolio" className="bg-surface-container-low text-on-surface px-8 py-4 rounded-xl font-bold hover:bg-surface-container-high transition-colors text-center">
                  View Portfolio
                </a>
              </div>
            </div>
            <div className="relative order-1 lg:order-2 h-[450px] lg:h-[600px] w-full">
              <div className="absolute inset-0 bg-secondary-container rounded-3xl -rotate-2 scale-95 opacity-50"></div>
              <img 
                className="w-full h-full object-cover rounded-3xl shadow-2xl relative z-10" 
                alt="Luxurious Syariah wedding hall setup with white floral arrangements" 
                src="/images/hero.jpg"
              />
            </div>
          </div>
        </section>

        {/* Packages Section */}
        <section id="packages" className="py-24 bg-surface-container-low">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
              <div className="max-w-xl">
                <h2 className="text-4xl md:text-5xl text-primary mb-6 font-serif">Signature Packages</h2>
                <p className="text-on-surface-variant leading-relaxed">Carefully curated experiences tailored to celebrate your union with elegance and strict adherence to Syariah principles.</p>
              </div>
              <div className="hidden md:block">
                <span className="text-primary-container font-serif italic text-2xl">Crafted with Heart</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
              {packages.map((pkg) => {
                const isPopular = pkg.is_popular;
                const cardClass = isPopular
                  ? "bg-primary-container p-10 rounded-xl shadow-2xl scale-105 relative z-10 border-none text-white flex flex-col justify-between"
                  : "bg-surface-container-lowest p-10 rounded-xl hover:shadow-2xl hover:shadow-blue-900/5 transition-all group border-none flex flex-col justify-between";
                const titleClass = isPopular ? "text-white" : "text-primary";
                const subtitleClass = isPopular ? "text-on-primary-container" : "text-primary-container/60";
                const textClass = isPopular ? "text-white/80" : "text-on-surface-variant";
                const iconColor = isPopular ? "text-secondary-fixed" : "text-secondary";
                const iconFilled = isPopular ? { fontVariationSettings: "'FILL' 1" } : undefined;
                const buttonClass = isPopular
                  ? "w-full py-3 rounded-xl bg-secondary-fixed text-on-secondary-fixed font-bold hover:scale-[1.02] transition-transform mt-auto"
                  : "w-full py-3 rounded-xl bg-surface-container-high text-primary font-bold group-hover:bg-primary group-hover:text-on-primary transition-colors mt-auto";

                return (
                  <div key={pkg.id} className={cardClass}>
                    <div>
                      {isPopular && (
                        <div className="absolute top-0 right-0 p-6">
                          <span className="bg-secondary-fixed text-on-secondary-fixed px-3 py-1 rounded-full text-xs font-bold">MOST POPULAR</span>
                        </div>
                      )}
                      <div className="mb-8">
                        <span className={`material-symbols-outlined text-4xl ${iconColor} mb-4`} style={iconFilled}>{pkg.icon}</span>
                        <h3 className={`text-2xl font-serif ${titleClass} mb-2`}>{pkg.name}</h3>
                        <div className={`${subtitleClass} text-sm font-label uppercase tracking-widest`}>{pkg.sub_title}</div>
                      </div>
                      <ul className="space-y-4 mb-10">
                        {pkg.features.map((feature, idx) => (
                          <li key={idx} className={`flex items-center gap-3 ${textClass} text-sm`}>
                            <span className={`material-symbols-outlined ${iconColor} text-sm`} style={iconFilled}>
                              {isPopular ? 'verified' : 'check_circle'}
                            </span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button className={buttonClass}>Select {pkg.name.split(' ')[0]}</button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Portfolio Section */}
        <section id="portfolio" className="py-24 bg-surface">
          <div className="max-w-7xl mx-auto px-8">
            <div className="mb-16">
              <h2 className="text-4xl font-serif text-primary mb-4">Portfolio Highlights</h2>
              <div className="h-1 w-24 bg-secondary"></div>
            </div>
            <div className="grid grid-cols-12 gap-6 h-auto md:h-[600px] lg:h-[800px]">
              {portfolio.length > 0 && (
                <div className="col-span-12 md:col-span-8 relative overflow-hidden rounded-3xl group h-[300px] md:h-full">
                  <img 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    alt={portfolio[0].title} 
                    src={portfolio[0].image_path}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex flex-col justify-end p-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span className="text-secondary-fixed text-sm uppercase tracking-widest mb-2 font-bold">{portfolio[0].category}</span>
                    <h4 className="text-white text-3xl font-serif">{portfolio[0].title}</h4>
                  </div>
                </div>
              )}
              <div className="col-span-12 md:col-span-4 grid grid-rows-2 gap-6 h-[500px] md:h-full">
                {portfolio.slice(1, 3).map((item) => (
                  <div key={item.id} className="relative overflow-hidden rounded-3xl group h-full">
                    <img 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      alt={item.title} 
                      src={item.image_path}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex flex-col justify-end p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-secondary-fixed text-xs uppercase tracking-widest mb-1 font-bold">{item.category}</span>
                      <h4 className="text-white text-xl font-serif">{item.title}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Vendor Partners Section */}
        <section className="py-24 bg-surface-container">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-16">
              <span className="label-md uppercase tracking-widest text-secondary font-bold">Trusted Network</span>
              <h2 className="text-4xl font-serif text-primary mt-4">Curated Vendor Partners</h2>
            </div>
            <div className="flex flex-wrap justify-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all">
              {vendors.map((vendor) => (
                <div key={vendor.id} className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-4xl">{vendor.icon}</span>
                  <span className="font-serif text-xl">{vendor.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="contact" className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary-container"></div>
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
              <path d="M0,0 C30,40 70,60 100,100 L100,0 Z" fill="white" />
            </svg>
          </div>
          <div className="max-w-4xl mx-auto px-8 relative z-10 text-center">
            <h2 className="text-5xl font-serif text-white mb-8">Begin Your Journey to a <span className="italic">Blessed Union</span></h2>
            <p className="text-on-primary-container text-xl mb-12">Book a private consultation with our wedding specialists to tailor your dream Syariah wedding.</p>
            <div className="flex flex-col md:flex-row gap-6 justify-center">
              <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl flex-1 text-left">
                <div className="text-secondary-fixed text-xs font-bold uppercase tracking-widest mb-2">Direct Contact</div>
                <div className="text-white text-lg">+62 812 3456 7890</div>
              </div>
              <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl flex-1 text-left">
                <div className="text-secondary-fixed text-xs font-bold uppercase tracking-widest mb-2">Email Inquiry</div>
                <div className="text-white text-lg">consult@dreamwedding.com</div>
              </div>
            </div>
            <button className="mt-12 bg-secondary-fixed text-on-secondary-fixed px-12 py-5 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-2xl">
              Schedule My Consultation
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-low py-20">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img src="/images/logo.png" alt="Logo" className="h-10 w-auto object-contain" />
              <div className="text-2xl font-serif italic text-blue-900"> Dream Wedding Syariah </div>
            </div>
            <p className="text-on-surface-variant max-w-sm mb-8 leading-relaxed">
              Providing a modern, sophisticated sanctuary for weddings that honor faith and tradition. Committed to excellence and Syariah compliance in every detail.
            </p>
            <div className="flex gap-4">
              <a className="w-10 h-10 bg-primary-container rounded-full flex items-center justify-center text-white hover:bg-primary transition-colors" href="#">
                <span className="material-symbols-outlined text-xl">social_leaderboard</span>
              </a>
              <a className="w-10 h-10 bg-primary-container rounded-full flex items-center justify-center text-white hover:bg-primary transition-colors" href="#">
                <span className="material-symbols-outlined text-xl">camera</span>
              </a>
              <a className="w-10 h-10 bg-primary-container rounded-full flex items-center justify-center text-white hover:bg-primary transition-colors" href="#">
                <span className="material-symbols-outlined text-xl">youtube_activity</span>
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-primary mb-6 uppercase tracking-widest text-xs">Navigation</h4>
            <ul className="space-y-4 text-on-surface-variant">
              <li><a className="hover:text-primary transition-colors cursor-pointer" href="#">Home</a></li>
              <li><a className="hover:text-primary transition-colors cursor-pointer" href="#packages">Packages</a></li>
              <li><a className="hover:text-primary transition-colors cursor-pointer" href="#portfolio">Portfolio</a></li>
              <li><a onClick={() => navigate('/admin/login')} className="hover:text-primary transition-colors cursor-pointer">Vendor Login</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-primary mb-6 uppercase tracking-widest text-xs">Resources</h4>
            <ul className="space-y-4 text-on-surface-variant">
              <li><a className="hover:text-primary transition-colors" href="#">Syariah Guidelines</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Planning Tips</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Testimonials</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-8 mt-20 pt-8 border-t border-outline-variant/30 text-center text-sm text-on-surface-variant">
          © 2026 Dream Wedding Syariah. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
