import CountrySelect from "@/components/country-select"
import { useCategories } from "@/lib/hooks/use-categories"
import { useRegions } from "@/lib/hooks/use-regions"
import { getCountryCodeFromPath } from "@/lib/utils/region"
import { Link, useLocation } from "@tanstack/react-router"

const Footer = () => {
  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname)
  const baseHref = countryCode ? `/${countryCode}` : ""

  const { data: categories } = useCategories({
    fields: "name,handle",
    queryParams: {
      parent_category_id: "null",
      limit: 5,
    },
  })

  const { data: regions } = useRegions({
    fields: "id, currency_code, *countries",
  })

  return (
    <footer className="w-full bg-[#f5f5f5] border-t border-[#e9e9e9]" data-testid="footer">
      <div className="px-6 md:px-10 lg:px-14 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-5">
            <span className="text-[#0a0a0a] text-base font-semibold tracking-tight select-none">
              Configura
            </span>
            <p className="text-xs text-[#737373] leading-relaxed max-w-[200px]">
              Custom furniture designed for your space.
            </p>
            <div className="flex gap-3">
              <a href="#" aria-label="Instagram" className="text-[#737373] hover:text-[#0a0a0a] transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 768 768" fill="currentColor">
                  <path d="m539.9,266c-6.7-17.5-20.5-31.2-38-38-11.9-4.4-24.4-6.7-37.1-6.9-21.1-1-27.4-1.2-80.8-1.2s-59.7.2-80.8,1.2c-12.7.1-25.3,2.5-37.2,6.9-17.5,6.7-31.2,20.5-38,38-4.4,11.9-6.7,24.4-6.9,37.1-1,21.1-1.2,27.4-1.2,80.8s.2,59.7,1.2,80.8c.1,12.7,2.5,25.3,6.9,37.2,6.7,17.5,20.5,31.2,38,38,11.9,4.4,24.4,6.7,37.1,6.9,21.1,1,27.4,1.2,80.8,1.2s59.7-.2,80.8-1.2c12.7-.1,25.3-2.4,37.2-6.8,17.5-6.7,31.2-20.5,38-38,4.4-11.9,6.7-24.4,6.9-37.1,1-21.1,1.2-27.4,1.2-80.8s-.2-59.7-1.2-80.8c-.1-12.7-2.4-25.3-6.8-37.2h0Zm-155.9,220.7c-56.7,0-102.7-46-102.7-102.7s46-102.7,102.7-102.7,102.7,46,102.7,102.7h0c0,56.7-46,102.7-102.7,102.7Zm106.8-185.5c-13.3,0-24-10.7-24-24s10.7-24,24-24c13.3,0,24,10.7,24,24s-10.7,24-24,24h0Zm-40.1,82.8c0,36.8-29.9,66.7-66.7,66.7s-66.7-29.9-66.7-66.7,29.9-66.7,66.7-66.7,66.7,29.9,66.7,66.7h0ZM384,0C171.9,0,0,171.9,0,384s171.9,384,384,384,384-171.9,384-384S596.1,0,384,0h0Zm198.8,466.4c-.3,16.6-3.5,33-9.3,48.6-10.4,26.9-31.6,48.1-58.5,58.5-15.5,5.8-31.9,9-48.5,9.3-21.4,1-28.2,1.2-82.5,1.2s-61.1-.2-82.5-1.2c-16.6-.3-33-3.5-48.5-9.3-26.9-10.4-48.1-31.6-58.5-58.5-5.8-15.5-9-31.9-9.3-48.5-1-21.4-1.2-28.2-1.2-82.5s.2-61.1,1.2-82.5c.3-16.6,3.5-33,9.3-48.5,10.4-26.9,31.6-48.1,58.5-58.5,15.5-5.8,31.9-8.9,48.5-9.3,21.4-1,28.2-1.2,82.5-1.2s61.1.2,82.5,1.2c16.6.3,33,3.5,48.5,9.3,26.9,10.4,48.1,31.6,58.5,58.5,5.8,15.5,9,31.9,9.3,48.5,1,21.4,1.2,28.2,1.2,82.5s-.2,61.1-1.2,82.5h0Z" />
                </svg>
              </a>
              <a href="#" aria-label="Pinterest" className="text-[#737373] hover:text-[#0a0a0a] transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 768 768" fill="currentColor">
                  <path d="m384,0C171.9,0,0,171.9,0,384s171.9,384,384,384,384-171.9,384-384S596.1,0,384,0Zm26.3,475c-24.6-1.9-35-14.1-54.2-25.8-10.6,55.6-23.6,109-62,136.9-11.9-84.2,17.4-147.3,31-214.4-23.2-39,2.8-117.4,51.6-98.2,60.1,23.8-52.1,145,23.2,160.2,78.6,15.8,110.8-136.5,62-185.9-70.5-71.5-205.1-1.6-188.5,100.7,4,25,29.9,32.6,10.3,67.1-45.1-10-58.6-45.6-56.8-93,2.8-77.6,69.7-132,136.8-139.4,84.9-9.4,164.6,31.2,175.6,111.1,12.4,90.2-38.4,187.7-129.1,180.7h0Z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Company column */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-semibold tracking-widest uppercase text-[#0a0a0a]">Company</h4>
            <ul className="flex flex-col gap-2.5">
              {["About", "Career", "Contact", "Responsibility"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-xs text-[#737373] hover:text-[#0a0a0a] transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support column */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-semibold tracking-widest uppercase text-[#0a0a0a]">Support</h4>
            <ul className="flex flex-col gap-2.5">
              {[
                { name: "Shipping", href: `${baseHref}/shipping` },
                { name: "Returns", href: `${baseHref}/returns` },
                { name: "Terms", href: `${baseHref}/terms` },
                { name: "Privacy", href: `${baseHref}/privacy` },
              ].map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-xs text-[#737373] hover:text-[#0a0a0a] transition-colors">{link.name}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter column */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-semibold tracking-widest uppercase text-[#0a0a0a]">Newsletter</h4>
            <p className="text-xs text-[#737373] leading-relaxed">
              New products and updates from Configura.
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 bg-white border border-[#e9e9e9] px-3 py-2 text-xs placeholder-[#a3a3a3] focus:outline-none focus:border-[#0a0a0a] transition-colors min-w-0"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-[#0a0a0a] text-white text-xs font-medium hover:bg-[#262626] transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#e9e9e9] px-6 md:px-10 lg:px-14 py-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <p className="text-xs text-[#a3a3a3]">
            &copy; {new Date().getFullYear()} Configura. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <CountrySelect regions={regions ?? []} />
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
