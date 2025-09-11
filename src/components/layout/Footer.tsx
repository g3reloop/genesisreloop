export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-[#0b0f14]/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-[#00D084] mb-4">Genesis ReLoop</h3>
            <p className="text-sm text-[#A3AAB8]">
              Decentralized circular economy OS powered by AI agents and blockchain
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-[#00D084] mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-[#A3AAB8]">
              <li><a href="/learn" className="hover:text-[#28F2E4] transition-colors">Learn</a></li>
              <li><a href="/docs" className="hover:text-[#28F2E4] transition-colors">Documentation</a></li>
              <li><a href="/api" className="hover:text-[#28F2E4] transition-colors">API</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-[#00D084] mb-4">Connect</h3>
            <ul className="space-y-2 text-sm text-[#A3AAB8]">
              <li><a href="#" className="hover:text-[#28F2E4] transition-colors">Discord</a></li>
              <li><a href="#" className="hover:text-[#28F2E4] transition-colors">GitHub</a></li>
              <li><a href="#" className="hover:text-[#28F2E4] transition-colors">Twitter</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm text-[#A3AAB8]">
          <p>© 2024 Genesis ReLoop. Building the circular economy infrastructure.</p>
        </div>
      </div>
    </footer>
  )
}
