import { Link, useParams } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { listProducts } from "@/lib/data/products"
import { getRegion } from "@/lib/data/regions"

export default function HomePage() {
  const { countryCode } = useParams({ from: "/$countryCode/" })

  const { data: region } = useQuery({
    queryKey: ["region", countryCode],
    queryFn: () => getRegion({ country_code: countryCode }),
    staleTime: Infinity,
  })

  const { data: productsData } = useQuery({
    queryKey: ["products", "latest", 2, region?.id],
    queryFn: () =>
      listProducts({
        query_params: {
          limit: 2,
          order: "-created_at",
          fields: "id,title,handle,thumbnail,*categories,*variants.calculated_price",
        },
        region_id: region?.id,
      }),
    enabled: !!region?.id,
  })

  const products = productsData?.products ?? []

  return (
    <div className="bg-white min-h-screen">

      {/* Hero — full-width image with minimal overlay text */}
      <section className="relative h-[85vh] overflow-hidden bg-[#f5f5f5]">
        <img
          src="https://cdn.mignite.app/ws/works_01KHQX6EG3S3V9XTHBYPWQCEYQ/nano_banana_pro_20260309_155651_1-01KK9HNRKSXCVJ8CMPTB521EY2.png"
          alt="Custom Furniture"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute bottom-10 left-6 md:left-14 right-6 md:right-14 flex items-end justify-between">
          <div>
            <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight leading-none max-w-xl">
              Custom Furniture for Your Home
            </h1>
          </div>
          <div className="hidden md:block">
            <Link
              to="/$countryCode/products/configure/$handle"
              params={{ countryCode, handle: "oslo-executive-office-chair" }}
              className="inline-flex items-center gap-2 bg-white text-[#0a0a0a] text-xs tracking-widest uppercase font-medium px-6 py-3.5 hover:bg-[#f5f5f5] transition-colors"
            >
              Configure Yours
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7H12M12 7L8 3M12 7L8 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </section>



      {/* Split feature — image left, text right */}
      <section className="bg-[#f5f5f5] mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="aspect-[4/3] md:aspect-auto overflow-hidden">
            <img
              src="https://cdn.mignite.app/ws/works_01KHQX6EG3S3V9XTHBYPWQCEYQ/nano_banana_pro_20260309_153828_1-01KK9HA8X8Z81RWD9GYVZ0BHWE.png"
              alt="Custom Design Process"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center px-10 md:px-16 lg:px-24 py-16 md:py-20">
            <p className="text-[10px] tracking-widest uppercase text-[#a3a3a3] mb-4">Our Process</p>
            <h2 className="text-3xl md:text-4xl font-medium text-[#0a0a0a] leading-tight mb-6 tracking-tight">
              Designed around you
            </h2>
            <p className="text-sm text-[#737373] leading-relaxed mb-8 max-w-sm">
              Every piece is made to order. Choose your materials, dimensions, and finish. We craft it to your exact specifications — nothing more, nothing less.
            </p>
            <Link
              to="/$countryCode/products/configure/$handle"
              params={{ countryCode, handle: "oslo-executive-office-chair" }}
              className="inline-flex items-center gap-2 text-xs tracking-widest uppercase font-medium text-[#0a0a0a] hover:text-[#737373] transition-colors self-start"
            >
              Start Configuring
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7H12M12 7L8 3M12 7L8 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Product grid — 2 image tiles */}
      <section className="px-6 md:px-10 lg:px-14 pt-12 md:pt-16 pb-6 md:pb-8">
        <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
          {products.slice(0, 2).map((product) => {
            const cheapestVariant = product.variants
              ?.filter((v: any) => v.calculated_price?.calculated_amount != null)
              .sort((a: any, b: any) => a.calculated_price.calculated_amount - b.calculated_price.calculated_amount)[0]
            const priceAmount = cheapestVariant?.calculated_price?.calculated_amount
            const currencyCode = cheapestVariant?.calculated_price?.currency_code?.toUpperCase() ?? "GBP"
            const priceLabel = priceAmount != null
              ? `${new Intl.NumberFormat("en-GB", { style: "currency", currency: currencyCode, maximumFractionDigits: 0 }).format(priceAmount)}`
              : null

            return (
              <Link
                key={product.id}
                to="/$countryCode/products/$handle"
                params={{ countryCode, handle: product.handle! }}
                className="group relative overflow-hidden"
              >
                <div className="aspect-square overflow-hidden">
                  {product.thumbnail && (
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                    />
                  )}
                </div>
                <div className="mt-3 flex items-start justify-between">
                  <div className="min-w-0">
                    <span className="text-sm text-[#0a0a0a] font-medium truncate block">{product.title}</span>
                    {priceLabel && <span className="text-xs text-[#737373]">{priceLabel}</span>}
                  </div>
                  <svg className="flex-shrink-0 ml-2 mt-0.5 text-[#a3a3a3] group-hover:text-[#0a0a0a] transition-colors" width="13" height="13" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7H12M12 7L8 3M12 7L8 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Two-up editorial */}
      <section className="px-6 md:px-10 lg:px-14 py-4 md:py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative overflow-hidden bg-[#f5f5f5] aspect-[4/3] group cursor-pointer">
            <img
              src="https://cdn.mignite.app/ws/works_01KHQX6EG3S3V9XTHBYPWQCEYQ/nano_banana_pro_20260309_155014_1-01KK9M0Y2AQ12V386FCJXM69XS.png"
              alt="New Collection"
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-[10px] tracking-widest uppercase text-white/70 mb-1">New Arrivals</p>
              <h3 className="text-white text-xl font-medium">Spring Collection 2026</h3>
            </div>
          </div>
          <div className="relative overflow-hidden bg-[#0a0a0a] aspect-[4/3] group cursor-pointer flex flex-col justify-end p-8">
            <div className="mb-auto pt-8">
              <p className="text-[10px] tracking-widest uppercase text-white/40 mb-3">Made to Order</p>
              <h3 className="text-white text-2xl md:text-3xl font-medium leading-tight tracking-tight">
                Your space.<br />Your rules.
              </h3>
            </div>
            <Link
              to="/$countryCode/store"
              params={{ countryCode }}
              className="inline-flex items-center gap-2 border border-white/30 text-white text-xs tracking-widest uppercase px-5 py-3 hover:border-white transition-colors self-start"
            >
              Explore
            </Link>
          </div>
        </div>
      </section>

      {/* USP strip */}
      <section className="border-t border-b border-[#e9e9e9] px-6 md:px-10 lg:px-14 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { title: "Made to Order", desc: "Every piece crafted to your specifications" },
            { title: "Free Delivery", desc: "Complimentary white glove delivery on all orders" },
            { title: "5-Year Guarantee", desc: "Built to last with premium materials" },
            { title: "Easy Returns", desc: "30-day hassle-free return policy" },
          ].map((usp) => (
            <div key={usp.title} className="flex flex-col gap-2">
              <h4 className="text-xs font-semibold text-[#0a0a0a] tracking-wide">{usp.title}</h4>
              <p className="text-xs text-[#737373] leading-relaxed">{usp.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
