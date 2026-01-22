'use client'

import { Lightbulb } from 'lucide-react'

interface SuggestionsCardProps {
  suggestions: string[]
}

export function SuggestionsCard({ suggestions }: SuggestionsCardProps) {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-lg">
          <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-xl font-heading font-semibold text-slate-900 dark:text-slate-50">
          Financial Suggestions
        </h2>
      </div>
      <ul className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <li 
            key={index} 
            className="text-sm text-slate-700 dark:text-slate-300 flex items-start p-3 rounded-lg hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-all duration-200 ease-out cursor-pointer"
          >
            <span className="mr-3 text-blue-500 font-bold">•</span>
            <span className="flex-1">{suggestion}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
