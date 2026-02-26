export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 md:py-16 mt-auto">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 mb-12">
          
          {/* Brand Section */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-xl font-black text-white tracking-tighter mb-4">
              RIVER BREEZE <span className="text-teal-500 block text-xs tracking-widest uppercase mt-1">Domestic Detailing</span>
            </h3>
            <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
              Premium domestic detailing for Clayton and Wellesley Island. We handle the dirt so you can get back to the river.
            </p>
          </div>

          {/* Contact Section */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-4">Contact Katherine</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="mailto:kate@riverbreezedetailing.com" className="hover:text-teal-400 transition-colors">
                  kate@riverbreezedetailing.com
                </a>
              </li>
              <li>
                <a href="tel:+13155550198" className="hover:text-teal-400 transition-colors">
                  (315) 555-0198
                </a>
              </li>
              <li className="text-slate-500 pt-2">
                Clayton, NY 13624
              </li>
            </ul>
          </div>

          {/* Service Area */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
             <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-4">Service Area</h4>
             <ul className="space-y-3 text-sm text-slate-400">
               <li>Clayton Village & Town</li>
               <li>Wellesley Island</li>
               <li>Thousand Islands Region</li>
             </ul>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 border-t border-slate-800 text-center md:flex md:justify-between md:text-left text-xs text-slate-500 font-medium tracking-widest uppercase">
          <p>© 2026 River Breeze Domestic Detailing.</p>
          <p className="mt-4 md:mt-0">Fully Insured & Bonded</p>
        </div>
      </div>
    </footer>
  );
}