export default function Home() {
  return (
    <div className="py-8">
      <h1 className="text-4xl font-bold mb-4">Welcome to Genesis Reloop</h1>
      <p className="text-xl mb-8">Turn waste into value with decentralized loops</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border border-white/20 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-2">850K kg</h2>
          <p className="text-gray-400">Waste Diverted</p>
        </div>
        <div className="border border-white/20 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-2">15,234</h2>
          <p className="text-gray-400">GIRM Credits</p>
        </div>
        <div className="border border-white/20 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-2">2,456</h2>
          <p className="text-gray-400">Community Nodes</p>
        </div>
      </div>
      
      <div className="mt-8">
        <a href="/join" className="bg-green-500 text-black px-6 py-3 rounded-lg inline-block font-semibold hover:bg-green-400">
          Join the Network
        </a>
      </div>
    </div>
  )
}
