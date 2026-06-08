'use client'

import { DOMAINS } from '@/lib/domains'

interface DomainSelectorProps {
  selectedDomains: string[]
  onSelectionChange: (domains: string[]) => void
}

export function DomainSelector({ selectedDomains, onSelectionChange }: DomainSelectorProps) {
  const handleToggle = (domainName: string) => {
    const updated = selectedDomains.includes(domainName)
      ? selectedDomains.filter((d) => d !== domainName)
      : [...selectedDomains, domainName]
    onSelectionChange(updated)
  }

  return (
    <div>
      <label className="block text-sm font-semibold text-slate-200 mb-4">
        What did you work on today?
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {DOMAINS.map((domain) => {
          const isSelected = selectedDomains.includes(domain.name)
          const DomainIcon = domain.icon

          return (
            <button
              key={domain.name}
              onClick={() => handleToggle(domain.name)}
              className="relative p-3 rounded-lg transition-all duration-200 flex flex-col items-center gap-2 border-2 backdrop-blur-sm border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800"
              style={
                isSelected
                  ? {
                      borderColor: `hsl(var(--color-${domain.color}))`,
                      backgroundColor: `hsla(var(--color-${domain.color}), 0.1)`,
                      boxShadow: `0 0 20px hsla(var(--color-${domain.color}), 0.3)`,
                    }
                  : {}
              }
            >
              <DomainIcon className="w-5 h-5" style={{ color: `hsl(var(--color-${domain.color}))` }} />
              <span className="text-xs font-semibold text-center text-slate-200">{domain.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
