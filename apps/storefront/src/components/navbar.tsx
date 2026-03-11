import { Link, useLocation, useParams } from "@tanstack/react-router"
import { MagnifyingGlass, User } from "@medusajs/icons"
import { useState } from "react"
import { MegaMenu } from "./mega-menu"
import { CartDropdown } from "./cart"

export default function Navbar() {
  const location = useLocation()
  const { countryCode } = useParams({ strict: false })
  const [activeMenu, setActiveMenu] = useState<string | null>(null)

  const shopMenuData = {
    quickLinks: [
      { label: "Shop All", href: "/$countryCode/store" },
      { label: "New Arrivals", href: "/$countryCode/store" },
      { label: "Inspiration", href: "/$countryCode/inspiration" },
    ],
    categoryLinks: [],
    features: [
      {
        title: "New Arrivals",
        image: "https://cdn.mignite.app/ws/works_01KHQX6EG3S3V9XTHBYPWQCEYQ/generated-01KK9FQ963RR3J5W990EQ0V6HR-01KK9FQ964FF2N24SXBBDZX0P3.jpeg",
        href: "/$countryCode/store",
      },
    ],
  }

  return (
    <header
      className="sticky top-0 z-50 bg-white border-b border-[#e9e9e9]"
      onMouseLeave={() => setActiveMenu(null)}
    >
      <div className="w-full px-6 md:px-10 lg:px-14">
        <div className="flex items-center justify-between h-14">

          {/* Left Navigation */}
          <nav className="hidden lg:flex items-center gap-6 flex-1">
            <button
              onMouseEnter={() => setActiveMenu('shop')}
              onClick={() => setActiveMenu(activeMenu === 'shop' ? null : 'shop')}
              className="text-xs tracking-widest uppercase text-[#0a0a0a] hover:text-[#737373] transition-colors font-medium"
            >
              Shop
            </button>
            <Link
              to="/$countryCode/inspiration"
              params={{ countryCode: countryCode || 'gb' }}
              className="text-xs tracking-widest uppercase text-[#0a0a0a] hover:text-[#737373] transition-colors font-medium"
              onMouseEnter={() => setActiveMenu(null)}
            >
              Inspiration
            </Link>
            <Link
              to="/$countryCode/store"
              params={{ countryCode: countryCode || 'gb' }}
              className="text-xs tracking-widest uppercase text-[#0a0a0a] hover:text-[#737373] transition-colors font-medium"
              onMouseEnter={() => setActiveMenu(null)}
            >
              Collections
            </Link>
          </nav>

          {/* Mobile Hamburger */}
          <button className="lg:hidden p-2 -ml-2" aria-label="Menu">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="16" viewBox="0 0 22 16" fill="none">
              <line x1="0" y1="1" x2="22" y2="1" stroke="#0a0a0a" strokeWidth="1.5" />
              <line x1="0" y1="8" x2="22" y2="8" stroke="#0a0a0a" strokeWidth="1.5" />
              <line x1="0" y1="15" x2="22" y2="15" stroke="#0a0a0a" strokeWidth="1.5" />
            </svg>
          </button>

          {/* Centered Logo */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link
              to="/$countryCode"
              params={{ countryCode: countryCode || 'gb' }}
              className="block"
            >
              <span className="text-[#0a0a0a] text-base font-semibold tracking-tight select-none">
                Configura
              </span>
            </Link>
          </div>

          {/* Right Utility Icons */}
          <div className="flex items-center gap-1 flex-1 justify-end">
            <button className="p-2.5 hover:text-[#737373] transition-colors" aria-label="Search">
              <MagnifyingGlass className="w-[18px] h-[18px]" />
            </button>

            <Link
              to="/$countryCode/account"
              params={{ countryCode: countryCode || 'gb' }}
              className="p-2.5 hover:text-[#737373] transition-colors hidden lg:block"
              aria-label="Account"
            >
              <User className="w-[18px] h-[18px]" />
            </Link>

            <CartDropdown />
          </div>
        </div>
      </div>

      {/* Mega Menu */}
      <MegaMenu
        isOpen={activeMenu === 'shop'}
        onClose={() => setActiveMenu(null)}
        quickLinks={shopMenuData.quickLinks}
        categoryLinks={shopMenuData.categoryLinks}
        features={shopMenuData.features}
      />
    </header>
  )
}
