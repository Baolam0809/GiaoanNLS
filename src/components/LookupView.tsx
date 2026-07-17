import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  ChevronRight, 
  ChevronDown, 
  Award,
  BookOpen
} from 'lucide-react';
import { competencyDataLookup, EXACT_COMPETENCY_DB, NLS_COMPONENTS_BY_DOMAIN } from '../data/competencyDb.js';

export default function LookupView() {
  const [openDomain, setOpenDomain] = useState<number | null>(1);
  const [searchQuery, setSearchQuery] = useState('');

  // Filtering based on search query
  const getFilteredDomains = () => {
    if (!searchQuery.trim()) return competencyDataLookup;
    
    const query = searchQuery.toLowerCase();
    
    // Search in EXACT_COMPETENCY_DB to find matching keys
    const matchingKeys = Object.entries(EXACT_COMPETENCY_DB)
      .filter(([key, value]) => key.toLowerCase().includes(query) || value.toLowerCase().includes(query))
      .map(([key]) => key);

    // Let's dynamically map domains and criteria
    return competencyDataLookup.map(domain => {
      const filteredCriteria = domain.criteria.map(crit => {
        // Find matching levels from either name, id, or the exact DB
        const levelsFromDb = Object.entries(EXACT_COMPETENCY_DB)
          .filter(([key]) => key.startsWith(crit.id))
          .map(([key, value]) => {
            // map back to a standard level mapping
            let levelLabel = "Lớp 6-7 (TC1)";
            if (key.includes("CB1")) levelLabel = "Lớp 1-3 (CB1)";
            else if (key.includes("CB2")) levelLabel = "Lớp 4-5 (CB2)";
            else if (key.includes("TC1")) levelLabel = "Lớp 6-7 (TC1)";
            else if (key.includes("TC2")) levelLabel = "Lớp 8-9 (TC2)";
            else if (key.includes("NC1")) levelLabel = "Lớp 10-12 (NC1)";

            return {
              key,
              level: levelLabel,
              desc: value
            };
          })
          .filter(lvl => 
            lvl.key.toLowerCase().includes(query) || 
            lvl.desc.toLowerCase().includes(query) || 
            crit.name.toLowerCase().includes(query)
          );

        return {
          ...crit,
          levels: levelsFromDb.length > 0 ? levelsFromDb : crit.levels.filter(lvl => 
            lvl.level.toLowerCase().includes(query) || 
            lvl.desc.toLowerCase().includes(query)
          )
        };
      }).filter(crit => crit.levels.length > 0 || crit.name.toLowerCase().includes(query));

      return {
        ...domain,
        criteria: filteredCriteria
      };
    }).filter(domain => domain.criteria.length > 0 || domain.title.toLowerCase().includes(query));
  };

  const filteredDomains = getFilteredDomains();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto pb-12"
    >
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 flex items-center">
            <Award className="mr-3 text-pink-600" size={32} /> Bảng Tra cứu Năng lực số
          </h2>
          <p className="text-slate-500 mt-2">Dựa trên Phụ lục 1: Bảng mã chỉ báo năng lực số của GDPT 2018.</p>
        </div>
      </div>

      {/* Optimized Search Bar */}
      <div className="relative mb-6">
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Nhập mã hóa, từ khóa tìm kiếm (Ví dụ: 1.1, AI, an toàn, tìm kiếm...)"
          className="w-full pl-12 pr-4 py-3.5 border-2 border-slate-200 rounded-2xl bg-white shadow-sm focus:border-pink-500 outline-none text-slate-700 transition-all font-medium"
        />
        <Search className="absolute left-4 top-4.5 text-slate-400" size={18} />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {filteredDomains.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <BookOpen size={40} className="mx-auto mb-3 text-slate-300" />
            Không tìm thấy năng lực hay chỉ báo nào khớp với từ khóa tìm kiếm.
          </div>
        ) : (
          filteredDomains.map((domain) => (
            <div key={domain.id} className="border-b border-slate-100 last:border-0">
              <button 
                className={`w-full px-6 py-5 flex justify-between items-center hover:bg-slate-50 transition-colors ${openDomain === domain.id || searchQuery ? 'bg-pink-50/40' : ''}`}
                onClick={() => setOpenDomain(openDomain === domain.id ? null : domain.id)}
              >
                <h3 className={`font-bold text-md text-left ${openDomain === domain.id || searchQuery ? 'text-pink-700' : 'text-slate-700'}`}>{domain.title}</h3>
                {openDomain === domain.id || searchQuery ? <ChevronDown className="text-pink-500 flex-shrink-0" /> : <ChevronRight className="text-slate-400 flex-shrink-0" />}
              </button>
              
              <AnimatePresence initial={false}>
                {(openDomain === domain.id || searchQuery) && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden bg-white border-t border-slate-100"
                  >
                    <div className="px-6 pb-6 pt-4 space-y-4">
                      {domain.criteria.map((crit) => {
                        // Dynamically resolve ALL levels in DB for this component instead of just mock L1-L3
                        const dbLevels = Object.entries(EXACT_COMPETENCY_DB)
                          .filter(([key]) => key.startsWith(crit.id))
                          .map(([key, value]) => {
                            let levelLabel = "Lớp 6-7 (TC1)";
                            if (key.includes("CB1")) levelLabel = "Lớp 1-3 (CB1)";
                            else if (key.includes("CB2")) levelLabel = "Lớp 4-5 (CB2)";
                            else if (key.includes("TC1")) levelLabel = "Lớp 6-7 (TC1)";
                            else if (key.includes("TC2")) levelLabel = "Lớp 8-9 (TC2)";
                            else if (key.includes("NC1")) levelLabel = "Lớp 10-12 (NC1)";

                            return {
                              key,
                              level: levelLabel,
                              desc: value
                            };
                          });

                        const levelsToDisplay = dbLevels.length > 0 ? dbLevels : crit.levels;

                        return (
                          <div key={crit.id} className="mb-6 last:mb-0 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                            <h4 className="font-bold text-slate-800 border-b border-slate-100 pb-2 mb-3">{crit.id}. {crit.name}</h4>
                            <div className="space-y-3">
                              {levelsToDisplay.map((lvl: any, idx: number) => (
                                <div key={idx} className="flex flex-col sm:flex-row sm:items-start gap-2 bg-white p-3 rounded-lg border border-slate-200/60 shadow-sm hover:border-pink-300 transition-colors">
                                  <div className="flex items-center gap-1.5 flex-shrink-0">
                                    <span className="inline-block bg-pink-100 text-pink-700 text-xs font-bold px-2 py-1 rounded">
                                      {lvl.level}
                                    </span>
                                    {lvl.key && (
                                      <span className="inline-block bg-slate-100 text-slate-700 text-xs font-mono font-bold px-2 py-1 rounded">
                                        {lvl.key}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-slate-600 text-sm flex-1 leading-relaxed">{lvl.desc}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}
