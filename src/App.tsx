import { motion } from "motion/react";
import { 
  Palette, 
  Video, 
  Layers, 
  Layout, 
  Zap, 
  Monitor, 
  Cpu, 
  PenTool,
  ChevronRight,
  Github,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Menu,
  X,
  Check
} from "lucide-react";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import ServiceDetail from "./pages/ServiceDetail";
import PortfolioDetail from "./pages/PortfolioDetail";

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: isHome ? "#home" : "/#home" },
    { name: "About", href: isHome ? "#about" : "/#about" },
    { name: "Services", href: isHome ? "#services" : "/#services" },
    { name: "Portfolio", href: isHome ? "#portfolio" : "/#portfolio" },
    { name: "Contact", href: isHome ? "#contact" : "/#contact" },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-dark/80 backdrop-blur-md py-4 border-b border-white/5" : "bg-transparent py-6"}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center overflow-hidden">
              {/* Replace the src with your actual logo file path */}
              <img 
                src="https://i.imgur.com/EhLM8C8.png" 
                alt="Logo" 
                className="w-full h-full object-contain logo-color"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-2xl font-display tracking-wider text-primary uppercase hidden sm:block">
              Anoy Islam Mahi
            </div>
          </Link>
        </motion.div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm uppercase tracking-widest hover:text-primary transition-colors font-medium"
            >
              {link.name}
            </a>
          ))}
          <motion.a 
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-primary px-6 py-2 rounded-full text-sm font-bold uppercase tracking-tighter inline-block"
          >
            Let's Talk
          </motion.a>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 w-full bg-dark border-b border-white/10 p-6 flex flex-col gap-4 md:hidden"
        >
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-lg uppercase tracking-widest hover:text-primary transition-colors"
            >
              {link.name}
            </a>
          ))}
        </motion.div>
      )}
    </nav>
  );
};

const Hero = () => {
  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop" 
          alt="Hero Background" 
          className="w-full h-full object-cover opacity-40"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark/20 via-dark/60 to-dark" />
      </div>

      <div className="relative z-10 text-center px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-8 flex justify-center"
        >
          <div className="w-24 h-24 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center red-glow overflow-hidden p-4">
            <img 
              src="https://i.imgur.com/EhLM8C8.png" 
              alt="Logo" 
              className="w-full h-full object-contain logo-color"
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-[12vw] md:text-[8vw] font-display leading-none tracking-tighter mb-4 uppercase red-glow-text"
        >
          Anoy Islam <span className="text-primary">Mahi</span>
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="max-w-2xl mx-auto"
        >
          <p className="text-lg md:text-xl text-gray-400 mb-8 font-light tracking-wide">
            HI, I'M <span className="text-white font-semibold">Anoy Islam Mahi</span>. I combine strategy, design, & motion to help brands stand out & look professional.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.a 
              href="#contact"
              whileHover={{ scale: 1.05 }}
              className="bg-primary text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest w-full sm:w-auto text-center inline-block"
            >
              Let's Connect
            </motion.a>
            <motion.a 
              href="#work"
              whileHover={{ scale: 1.05 }}
              className="glass px-8 py-4 rounded-full font-bold uppercase tracking-widest w-full sm:w-auto text-center inline-block"
            >
              View Portfolio
            </motion.a>
          </div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <motion.div 
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 left-10 hidden lg:block"
      >
        <div className="glass p-4 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <Zap size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-tighter">Status</p>
            <p className="text-sm font-bold">Available for Work</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

const About = () => {
  const stats = [
    { label: "Graphics Design", value: "6+ yrs" },
    { label: "Motion Graphics", value: "6+ yrs" },
    { label: "Video Editing", value: "6+ yrs" },
    { label: "Projects Done", value: "100s+" },
  ];

  return (
    <section id="about" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="aspect-[4/5] rounded-3xl overflow-hidden relative z-10">
            <img 
              src="https://i.imgur.com/r6Q50Im.png" 
              alt="Designer" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-dark to-transparent">
              <h3 className="text-2xl font-display">Art Director Designer</h3>
            </div>
          </div>
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary rounded-full flex flex-col items-center justify-center z-20 red-glow">
            <span className="text-3xl font-bold">6+</span>
            <span className="text-[10px] uppercase tracking-tighter text-center leading-tight">Years of<br/>Experience</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className="mb-12">
            <div className="grid grid-cols-2 gap-4 mb-12">
              {stats.map((stat) => (
                <div key={stat.label} className="border-b border-white/10 pb-4">
                  <p className="text-gray-400 text-sm uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              ))}
            </div>
            
            <div className="flex items-baseline gap-4 mb-8">
              <span className="text-8xl font-display text-primary">6+</span>
              <span className="text-xl text-gray-400 uppercase tracking-widest">Years Experience</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Creative Graphics Designer, Motion Designer, and Video Editor.
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              Over 6 years of experience in branding, animation, streaming graphics, and promotional video production. Skilled in designing banners, logos, overlays, and product animation for clients worldwide. Successfully completed hundreds of projects with consistent 5-star feedback.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Services = () => {
  const services = [
    {
      id: "01",
      title: "Graphics & Logo Design",
      image: "https://i.ibb.co.com/VYJG2cK3/Chat-GPT-Image-Mar-24-2026-10-38-48-PM.png",
      icon: <Palette />
    },
    {
      id: "02",
      title: "Motion Graphics & Animation",
      image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=2071&auto=format&fit=crop",
      icon: <Video />
    },
    {
      id: "03",
      title: "Video Editing & Promo",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop",
      icon: <Video />
    },
    {
      id: "04",
      title: "Streaming Overlay & Branding",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop",
      icon: <Layout />
    }
  ];

  return (
    <section id="services" className="py-24 bg-card/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-16">
          <h2 className="text-6xl font-display tracking-tighter">MY SERVICES</h2>
          <p className="text-gray-400 max-w-xs text-right hidden md:block">
            Specialized in creating high-impact visual experiences that resonate.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <Link 
              key={service.id}
              to={`/service/${service.id}`}
              className="group relative h-[400px] rounded-3xl overflow-hidden cursor-pointer block"
            >
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="w-full h-full"
              >
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-80"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent" />
                
                <div className="absolute top-8 left-8 text-primary font-display text-2xl">
                  {service.id}
                </div>
                
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-3xl font-bold group-hover:text-primary transition-colors">{service.title}</h3>
                    <div className="w-12 h-12 rounded-full glass flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                      <ChevronRight />
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

const TechStack = () => {
  const tools = [
    { name: "After Effects", icon: <Video size={24} /> },
    { name: "Photoshop", icon: <Palette size={24} /> },
    { name: "Illustrator", icon: <Layers size={24} /> },
    { name: "Premiere Pro", icon: <Video size={24} /> },
    { name: "Figma", icon: <Layout size={24} /> },
  ];

  return (
    <section className="py-20 overflow-hidden bg-dark border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
        <h2 className="text-4xl font-display tracking-widest">MY TECH STACK</h2>
      </div>
      
      <div className="flex gap-12 animate-marquee whitespace-nowrap">
        {[...tools, ...tools].map((tool, i) => (
          <div key={i} className="flex items-center gap-4 glass px-8 py-4 rounded-2xl hover:border-primary/50 transition-colors group">
            <div className="text-primary group-hover:scale-110 transition-transform">
              {tool.icon}
            </div>
            <span className="text-xl font-bold tracking-tight">{tool.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

const Process = () => {
  const steps = [
    {
      title: "Clean & Professional",
      desc: "I combine strategy, creativity, and clarity.",
      image: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1964&auto=format&fit=crop"
    },
    {
      title: "Human & Friendly",
      desc: "I listen, I plan, and I create.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop"
    },
    {
      title: "Bold & Modern",
      desc: "I dive deep into your vision, craft a clean strategy, and execute with purpose.",
      image: "https://images.unsplash.com/photo-1515462277126-2dd0c162007a?q=80&w=1976&auto=format&fit=crop"
    }
  ];

  return (
    <section className="py-24 bg-primary text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-16">
          <h2 className="text-6xl font-display">HOW I DO IT</h2>
          <a href="#contact" className="glass px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest inline-block">Let's Connect</a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {steps.slice(0, 2).map((step, i) => (
            <div key={i} className="relative h-[400px] rounded-3xl overflow-hidden group">
              <img src={step.image} alt={step.title} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute bottom-8 left-8">
                <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                <p className="text-white/70">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="relative h-[500px] rounded-3xl overflow-hidden group">
          <img src={steps[2].image} alt={steps[2].title} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute bottom-8 left-8 right-8 flex flex-col md:flex-row justify-between items-end">
            <div className="max-w-xl">
              <p className="text-xl mb-4 leading-relaxed">{steps[2].desc}</p>
              <h3 className="text-4xl font-display">{steps[2].title}</h3>
            </div>
            <div className="text-right mt-8 md:mt-0">
              <h4 className="text-5xl font-display mb-2">Deliver</h4>
              <p className="text-white/70 max-w-xs">I begin every project by learning about your goals & challenges.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Portfolio = () => {
  const projects = [
    {
      id: "p1",
      title: "Hood Report Podcast Branding",
      desc: "Designed all graphical elements for brand, podcast, and business marketing.",
      image: "https://images.unsplash.com/photo-1616469829581-73993eb86b02?q=80&w=2070&auto=format&fit=crop"
    },
    {
      id: "p2",
      title: "RNE Premier Mobile Notary Visuals",
      desc: "Created banners, overlays, and promotional videos for business marketing.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop"
    },
    {
      id: "p3",
      title: "Streaming Overlay Package",
      desc: "Built custom streaming overlay packages for Twitch and YouTube creators.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
    }
  ];

  return (
    <section id="portfolio" className="py-24 px-6 max-w-7xl mx-auto">
      <h2 className="text-6xl font-display mb-16">FEATURED WORK</h2>
      
      <div className="space-y-12">
        {projects.map((project, i) => (
          <Link 
            key={project.id}
            to={`/portfolio/${project.id}`}
            className="block"
          >
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group relative h-[600px] rounded-[40px] overflow-hidden cursor-pointer"
            >
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/20 to-transparent opacity-80" />
              
              <div className="absolute inset-0 flex flex-col justify-end p-12">
                <div className="flex flex-col md:flex-row justify-between items-end gap-8">
                  <div className="max-w-xl">
                    <h3 className="text-4xl font-bold mb-4">{project.title}</h3>
                    <p className="text-gray-300 text-lg leading-relaxed">{project.desc}</p>
                  </div>
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="glass px-10 py-4 rounded-full font-bold uppercase tracking-widest"
                  >
                    View
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
};

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("https://formsubmit.co/ajax/lazerlit.me@gmail.com", {
        method: "POST",
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setIsSubmitted(true);
        setShowPopup(true);
        form.reset();
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 px-6 max-w-7xl mx-auto relative">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <h2 className="text-5xl font-display mb-4">Begin conversation</h2>
          <p className="text-gray-400 mb-12">If you have any questions, feel free to write.</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Honeypot for spam protection */}
            <input type="text" name="_honey" style={{ display: 'none' }} />
            {/* Disable captcha for smoother UX */}
            <input type="hidden" name="_captcha" value="false" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Full name</label>
                <input type="text" name="name" required className="w-full bg-card border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-colors" placeholder="Francis Drake" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Email</label>
                <input type="email" name="email" required className="w-full bg-card border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-colors" placeholder="f.drake@gm" />
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Topic</label>
              <input type="text" name="_subject" required className="w-full bg-card border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-colors" placeholder="Type your topic" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">How can we help you?</label>
              <textarea name="message" required rows={4} className="w-full bg-card border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-colors resize-none" placeholder="Space for your message" />
            </div>
            <button 
              type="submit" 
              disabled={isSubmitting || isSubmitted}
              className={`px-10 py-4 rounded-xl font-bold uppercase tracking-widest w-full md:w-auto transition-colors ${
                isSubmitted 
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                  : 'bg-primary text-white hover:bg-orange-600'
              }`}
            >
              {isSubmitting ? 'Sending...' : isSubmitted ? 'Submitted' : 'Submit message'}
            </button>
          </form>
        </div>

        <div className="space-y-8">
          <div className="glass p-8 rounded-3xl flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Phone />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Contact Number</p>
              <p className="text-xl font-bold">01605957812</p>
            </div>
          </div>
          
          <div className="glass p-8 rounded-3xl flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Mail />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Contact Email</p>
              <p className="text-xl font-bold">lazerlit.me@gmail.com</p>
            </div>
          </div>
          
          <div className="glass p-8 rounded-3xl flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <MapPin />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Location Address</p>
              <p className="text-xl font-bold">Dhaka, Bangladesh</p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-white/10 p-8 rounded-3xl max-w-md w-full text-center relative shadow-2xl"
          >
            <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={32} />
            </div>
            <h3 className="text-3xl font-display mb-4">Message Sent!</h3>
            <p className="text-gray-400 mb-8">
              Thanks for reaching out! I've received your message and will get back to you as soon as possible.
            </p>
            <button 
              onClick={() => setShowPopup(false)}
              className="bg-white text-primary px-8 py-3 rounded-full font-bold uppercase tracking-widest w-full hover:bg-gray-100 transition-colors"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </section>
  );
};

const CTA = () => {
  return (
    <section className="py-24 px-6">
      <motion.div 
        whileInView={{ scale: [0.95, 1] }}
        className="max-w-7xl mx-auto bg-gradient-to-r from-primary to-orange-600 rounded-[40px] p-12 md:p-24 text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        <div className="relative z-10">
          <h2 className="text-5xl md:text-7xl font-display mb-8">Ready to transform your vision?</h2>
          <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
            Join hundreds of clients who are creating beautiful visual experiences every day.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a href="#contact" className="bg-white text-primary px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-gray-100 transition-colors inline-block text-center">Start Project</a>
            <a href="tel:01605957812" className="glass border-white/40 px-10 py-4 rounded-full font-bold uppercase tracking-widest">Call Now: 01605957812</a>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

const BehanceIcon = ({ size = 20, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14h-8.027c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.546-1.436-2.352-2.461-2.352-1.036 0-2.253.806-2.504 2.352zm-8.904 6h-7.136v-14h7.492c3.48 0 4.51 1.814 4.51 3.781 0 1.547-1.153 2.84-2.263 3.155 1.604.211 3.16 1.15 3.16 3.602 0 2.299-1.352 3.462-5.763 3.462zm-3.136-12v4h3.628c1.287 0 2.088-.678 2.088-1.991 0-1.224-.724-2.009-2.088-2.009h-3.628zm0 6v5h4.039c1.45 0 2.367-.684 2.367-2.454 0-1.807-1.064-2.546-2.367-2.454h-4.039z"/>
  </svg>
);

const FiverrIcon = ({ size = 20, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.25 4.5h-14.5C3.646 4.5 2.75 5.396 2.75 6.5v11c0 1.104.896 2 2 2h14.5c1.104 0 2-.896 2-2v-11c0-1.104-.896-2-2-2zm-8.875 11.5h-1.5v-3.5h-2v-1.5h2v-1c0-1.378 1.122-2.5 2.5-2.5h2v1.5h-2c-.551 0-1 .449-1 1v1h3v1.5h-3v3.5z"/>
  </svg>
);

const Footer = () => {
  return (
    <footer className="py-16 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 flex items-center justify-center overflow-hidden">
              <img 
                src="https://i.imgur.com/EhLM8C8.png" 
                alt="Logo" 
                className="w-full h-full object-contain logo-color"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-2xl font-display tracking-wider text-primary uppercase">Anoy Islam Mahi</div>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed">
            Creative Graphics Designer, Motion Designer, and Video Editor with over 6 years of experience in branding and animation.
          </p>
          <div className="flex gap-4 mt-6">
            <a href="https://www.linkedin.com/in/anoy-islam-mahi/" target="_blank" rel="noreferrer"><Linkedin className="text-gray-500 hover:text-primary cursor-pointer transition-colors" size={20} /></a>
            <a href="https://be.net/anoyislam" target="_blank" rel="noreferrer"><BehanceIcon className="text-gray-500 hover:text-primary cursor-pointer transition-colors" size={20} /></a>
            <a href="https://www.fiverr.com/s/R7Yvg5D" target="_blank" rel="noreferrer"><FiverrIcon className="text-gray-500 hover:text-primary cursor-pointer transition-colors" size={20} /></a>
          </div>
        </div>
        
        <div>
          <h4 className="font-bold mb-6 uppercase tracking-widest text-sm">Menu</h4>
          <ul className="space-y-4 text-gray-500 text-sm">
            <li className="hover:text-primary cursor-pointer">Home</li>
            <li className="hover:text-primary cursor-pointer">About Us</li>
            <li className="hover:text-primary cursor-pointer">Services</li>
            <li className="hover:text-primary cursor-pointer">Projects</li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold mb-6 uppercase tracking-widest text-sm">Resources</h4>
          <ul className="space-y-4 text-gray-500 text-sm">
            <li className="hover:text-primary cursor-pointer">Tutorials</li>
            <li className="hover:text-primary cursor-pointer">Documentation</li>
            <li className="hover:text-primary cursor-pointer">Blog</li>
            <li className="hover:text-primary cursor-pointer">Support</li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold mb-6 uppercase tracking-widest text-sm">Follow Us</h4>
          <ul className="space-y-4 text-gray-500 text-sm">
            <li>
              <a href="https://www.linkedin.com/in/anoy-islam-mahi/" target="_blank" rel="noreferrer" className="hover:text-primary cursor-pointer flex items-center gap-2 transition-colors">
                <Linkedin size={16} /> LinkedIn
              </a>
            </li>
            <li>
              <a href="https://be.net/anoyislam" target="_blank" rel="noreferrer" className="hover:text-primary cursor-pointer flex items-center gap-2 transition-colors">
                <BehanceIcon size={16} /> Behance
              </a>
            </li>
            <li>
              <a href="https://www.fiverr.com/s/R7Yvg5D" target="_blank" rel="noreferrer" className="hover:text-primary cursor-pointer flex items-center gap-2 transition-colors">
                <FiverrIcon size={16} /> Fiverr
              </a>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 text-gray-500 text-xs">
        <p>© 2026 Anoy Islam Mahi. All rights reserved.</p>
        <div className="flex gap-8 mt-4 md:mt-0">
          <span className="hover:text-white cursor-pointer">Privacy Policy</span>
          <span className="hover:text-white cursor-pointer">Terms of Service</span>
          <span className="hover:text-white cursor-pointer">Cookies Settings</span>
        </div>
      </div>
    </footer>
  );
};

const ScrollManager = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/') {
      const savedScroll = sessionStorage.getItem("homeScroll");
      if (savedScroll && !location.hash) {
        const scrollY = parseInt(savedScroll, 10);
        window.scrollTo(0, scrollY);
        setTimeout(() => window.scrollTo(0, scrollY), 50);
        setTimeout(() => window.scrollTo(0, scrollY), 200);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  useEffect(() => {
    let timeoutId: any;
    const handleScroll = () => {
      if (window.location.pathname === '/') {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          sessionStorage.setItem("homeScroll", window.scrollY.toString());
        }, 50);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  return null;
};

const Home = () => {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <TechStack />
      <Process />
      <Portfolio />
      <Contact />
      <CTA />
    </>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <div className="bg-dark min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/service/:id" element={<ServiceDetail />} />
          <Route path="/portfolio/:id" element={<PortfolioDetail />} />
        </Routes>
        <Footer />
        
        {/* Background Branding Text */}
        <div className="fixed bottom-0 left-0 w-full overflow-hidden pointer-events-none z-0 opacity-[0.02]">
          <h1 className="text-[30vw] font-display leading-none whitespace-nowrap translate-y-1/2">
            ANOY ISLAM MAHI
          </h1>
        </div>
      </div>
    </BrowserRouter>
  );
}
