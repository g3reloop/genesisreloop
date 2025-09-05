'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function DebugPage() {
  return (
    <div className="min-h-screen bg-mythic-dark-900 text-mythic-text-primary p-8">
      <h1 className="text-4xl font-bold mb-8 text-mythic-primary-500">Debug Page</h1>
      
      <div className="space-y-8">
        <Card className="p-6 bg-mythic-dark-800 border-mythic-primary-500/30">
          <h2 className="text-2xl font-semibold mb-4">Styling Test</h2>
          <p className="text-mythic-text-muted mb-4">
            This page tests if CSS and client-side JavaScript are working correctly.
          </p>
          <Button className="bg-mythic-primary-500 hover:bg-mythic-primary-600">
            Test Button
          </Button>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-500/20 border border-green-500/30 p-4 rounded-lg">
            <div className="text-green-400 font-semibold">Green Box</div>
            <div className="text-gray-400 text-sm">If you see green styling, CSS is working</div>
          </div>
          
          <div className="bg-blue-500/20 border border-blue-500/30 p-4 rounded-lg">
            <div className="text-blue-400 font-semibold">Blue Box</div>
            <div className="text-gray-400 text-sm">Tailwind classes are applied</div>
          </div>
          
          <div className="bg-purple-500/20 border border-purple-500/30 p-4 rounded-lg">
            <div className="text-purple-400 font-semibold">Purple Box</div>
            <div className="text-gray-400 text-sm">Custom theme colors work</div>
          </div>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg">
          <div className="text-yellow-500 font-semibold mb-2">Client-Side Test</div>
          <button
            onClick={() => alert('JavaScript is working!')}
            className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
          >
            Click to test JavaScript
          </button>
        </div>
      </div>

      <div className="mt-8 p-4 bg-mythic-dark-800/50 rounded-lg">
        <div className="font-mono text-sm text-mythic-text-muted">
          <div>Page rendered at: {new Date().toISOString()}</div>
          <div>Client-side hydration: {typeof window !== 'undefined' ? 'Active' : 'Not active'}</div>
        </div>
      </div>
    </div>
  );
}
