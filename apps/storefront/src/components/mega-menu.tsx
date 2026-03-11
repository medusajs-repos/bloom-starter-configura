import { Link } from "@tanstack/react-router"
import { useState } from "react"

interface MegaMenuLink {
  label: string
  href: string
}

interface MegaMenuFeature {
  title: string
  image: string
  href: string
}

interface MegaMenuProps {
  quickLinks: MegaMenuLink[]
  categoryLinks: MegaMenuLink[]
  features: MegaMenuFeature[]
  isOpen: boolean
  onClose: () => void
}

export function MegaMenu({ quickLinks, categoryLinks, features, isOpen, onClose }: MegaMenuProps) {
  const [isHovering, setIsHovering] = useState(false)

  if (!isOpen && !isHovering) return null

  return (
    <div
      className="absolute left-0 right-0 top-full z-40 bg-white border-t border-[#e5e5e5] shadow-sm"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false)
        onClose()
      }}
    >
      <div className="mx-auto max-w-7xl px-8 py-7 flex items-stretch gap-0">
        {/* Links section - horizontal spread */}
        <div className="flex flex-1 gap-16">
          {/* Quick Links */}
          {quickLinks.length > 0 && (
            <div className="flex flex-col justify-center">
              <p className="text-[9px] uppercase tracking-[0.15em] text-[#a3a3a3] mb-3 font-medium">Browse</p>
              <ul className="space-y-2.5">
                {quickLinks.map((link, index) => (
                  <li key={`quick-${index}`}>
                    <Link
                      to={link.href}
                      params={{ countryCode: 'gb' }}
                      className="font-primary text-[12px] uppercase tracking-[0.06em] text-[#0a0a0a] hover:text-[#737373] transition-colors block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Category Links */}
          {categoryLinks.length > 0 && (
            <div className="flex flex-col justify-center">
              <p className="text-[9px] uppercase tracking-[0.15em] text-[#a3a3a3] mb-3 font-medium">Categories</p>
              <ul className="space-y-2.5">
                {categoryLinks.map((link, index) => (
                  <li key={`cat-${index}`}>
                    <Link
                      to={link.href}
                      params={{ countryCode: 'gb' }}
                      className="font-primary text-[12px] uppercase tracking-[0.06em] text-[#0a0a0a] hover:text-[#737373] transition-colors block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px bg-[#e5e5e5] mx-10 self-stretch" />

        {/* Featured image - right side */}
        <div className="flex gap-5">
          {features.map((feature, index) => (
            <Link
              key={`feature-${index}`}
              to={feature.href}
              params={{ countryCode: 'gb' }}
              className="group block w-56"
            >
              <div className="relative overflow-hidden">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-56 h-36 object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <p className="mt-2 font-primary text-[10px] uppercase tracking-[0.08em] text-[#0a0a0a] group-hover:text-[#737373] transition-colors">
                {feature.title}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
