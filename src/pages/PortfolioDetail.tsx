import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, Play, ExternalLink, X } from "lucide-react";
import { portfolioWorks, Work } from "../data/works";
import { useEffect, useState } from "react";

const PortfolioDetail = () => {
  const { id } = useParams<{ id: string }>();
  const project = id ? portfolioWorks[id] : null;
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-dark text-white p-6">
        <h1 className="text-4xl font-display mb-4">Project Not Found</h1>
        <Link to="/" className="text-primary flex items-center gap-2 hover:underline">
          <ChevronLeft size={20} /> Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-white pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <Link to="/" className="text-gray-400 hover:text-primary flex items-center gap-2 mb-8 transition-colors">
            <ChevronLeft size={20} /> Back to Home
          </Link>
          <h1 className="text-6xl md:text-8xl font-display tracking-tighter mb-6">{project.title}</h1>
          <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">{project.description}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {project.works.map((work, index) => (
            <motion.div
              key={work.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer"
              onClick={() => setSelectedWork(work)}
            >
              <div className="relative aspect-video rounded-3xl overflow-hidden mb-6 bg-card/50 border border-white/5">
                {work.type === 'video' ? (
                  <video 
                    src={work.url} 
                    className="w-full h-full object-cover"
                    loop
                    muted
                    playsInline
                    onMouseOver={(e) => {
                      e.currentTarget.play().catch(() => {});
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.pause();
                    }}
                  />
                ) : (
                  <img 
                    src={work.url} 
                    alt={work.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                )}
                
                <div className="absolute inset-0 bg-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  {work.type === 'video' ? (
                    <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/20">
                      <Play fill="currentColor" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/20">
                      <ExternalLink />
                    </div>
                  )}
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">{work.title}</h3>
              <p className="text-gray-400 leading-relaxed">{work.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {selectedWork && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-dark/95 backdrop-blur-sm"
              onClick={() => setSelectedWork(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative max-w-5xl w-full max-h-[90vh] bg-card rounded-[32px] overflow-hidden border border-white/10 flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  onClick={() => setSelectedWork(null)}
                  className="absolute top-6 right-6 z-20 w-12 h-12 rounded-full bg-dark/50 hover:bg-primary text-white flex items-center justify-center transition-colors backdrop-blur-md"
                >
                  <X size={24} />
                </button>

                <div className="overflow-y-auto custom-scrollbar h-full">
                  <div className="aspect-video bg-black shrink-0">
                    {selectedWork.type === 'video' ? (
                      <video 
                        src={selectedWork.url} 
                        className="w-full h-full"
                        controls
                        autoPlay
                        playsInline
                      />
                    ) : (
                      <img 
                        src={selectedWork.url} 
                        alt={selectedWork.title} 
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </div>

                  <div className="p-8 md:p-12">
                    <h2 className="text-4xl font-bold mb-6">{selectedWork.title}</h2>
                    <p className="text-xl text-gray-400 leading-relaxed mb-12">{selectedWork.description}</p>
                    
                    {selectedWork.additionalContent && (
                      <div className="space-y-12">
                        {selectedWork.additionalContent.map((item, idx) => (
                          <div key={idx}>
                            {item.type === 'text' ? (
                              <p className="text-lg text-gray-300 leading-relaxed">{item.content}</p>
                            ) : item.type === 'video' ? (
                              <div className="rounded-2xl overflow-hidden border border-white/5 bg-black">
                                <video 
                                  src={item.content} 
                                  className="w-full h-auto"
                                  loop
                                  muted
                                  playsInline
                                  onMouseOver={(e) => {
                                    e.currentTarget.play().catch(() => {});
                                  }}
                                  onMouseOut={(e) => {
                                    e.currentTarget.pause();
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="rounded-2xl overflow-hidden border border-white/5">
                                <img 
                                  src={item.content} 
                                  alt="" 
                                  className="w-full h-auto"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PortfolioDetail;
