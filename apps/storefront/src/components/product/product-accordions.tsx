import * as Accordion from "@radix-ui/react-accordion"
import { ChevronDown } from "@medusajs/icons"

interface AccordionItem {
  id: string
  title: string
  content: string | React.ReactNode
}

interface ProductAccordionsProps {
  items?: AccordionItem[]
}

const defaultItems: AccordionItem[] = [
  {
    id: "details",
    title: "Product Details",
    content: "Expertly crafted designer furniture combining form and function for modern living spaces.",
  },
  {
    id: "assembly",
    title: "Assembly & Installation",
    content: (
      <div className="space-y-2">
        <p>All furniture arrives with detailed assembly instructions and required hardware.</p>
        <p>Most pieces can be assembled in 30-45 minutes with basic tools.</p>
        <p className="text-sm text-neutral-600 mt-4">
          Professional white glove delivery and assembly services available at checkout for select items.
        </p>
      </div>
    ),
  },
  {
    id: "care",
    title: "Care & Maintenance",
    content: (
      <div className="space-y-2">
        <p>
          <strong>Upholstery:</strong> Vacuum regularly with soft brush attachment. Spot clean with mild soap and water.
        </p>
        <p>
          <strong>Frame:</strong> Wipe with dry or slightly damp cloth. Avoid harsh chemicals and abrasive cleaners.
        </p>
        <p className="text-sm text-neutral-600">
          Professional upholstery cleaning recommended every 12-18 months for best results.
        </p>
      </div>
    ),
  },
  {
    id: "shipping",
    title: "Shipping & Returns",
    content: (
      <div className="space-y-2">
        <p>
          <strong>Shipping:</strong> Made-to-order with 5-8 week lead times. White glove delivery available.
        </p>
        <p>
          <strong>Returns:</strong> 30-day return policy for unused items in original packaging. Custom orders are final sale.
        </p>
      </div>
    ),
  },
]

export const ProductAccordions = ({ items = defaultItems }: ProductAccordionsProps) => {
  return (
    <Accordion.Root type="multiple" className="w-full">
      {items.map((item) => (
        <Accordion.Item
          key={item.id}
          value={item.id}
          className="border-b border-neutral-200"
        >
          <Accordion.Trigger className="flex items-center justify-between w-full py-5 text-left group">
            <span className="text-sm font-semibold text-neutral-900 uppercase tracking-wide">
              {item.title}
            </span>
            <ChevronDown className="w-5 h-5 text-neutral-600 transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </Accordion.Trigger>
          <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-open data-[state=closed]:animate-accordion-close">
            <div className="pb-6 text-sm text-neutral-700 leading-relaxed">
              {typeof item.content === "string" ? <p>{item.content}</p> : item.content}
            </div>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  )
}
