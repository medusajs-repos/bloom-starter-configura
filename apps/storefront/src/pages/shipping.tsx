const Shipping = () => {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="content-container pt-32 pb-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-display font-semibold text-neutral-900 mb-4 tracking-tight">
              Shipping Information
            </h1>
            <p className="text-lg text-neutral-600">
              Custom furniture delivered with care
            </p>
          </div>

          <div className="space-y-8">
            {/* Custom Manufacturing Notice */}
            <div className="bg-white border border-neutral-200 p-8">
              <h2 className="text-xl font-display font-semibold text-neutral-900 mb-6 uppercase tracking-wide">
                Made to Order
              </h2>
              <div className="space-y-4 text-neutral-700 leading-relaxed">
                <p>
                  Every piece from Configura is custom-made to your exact specifications. Your furniture is crafted by skilled artisans only after you place your order, ensuring perfect attention to your chosen configuration, materials, and finishes.
                </p>
                <p>
                  Production typically takes 6-10 weeks depending on the complexity of your configuration and current workshop demand. You'll receive regular updates throughout the manufacturing process.
                </p>
              </div>
            </div>

            {/* Shipping Rates */}
            <div className="bg-white border border-neutral-200 p-8">
              <h2 className="text-xl font-display font-semibold text-neutral-900 mb-6 uppercase tracking-wide">
                Shipping Rates
              </h2>
              <div className="space-y-6 text-neutral-700 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2">Denmark</h3>
                  <p>Free shipping on all orders. White glove delivery and assembly included.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2">Europe (EU)</h3>
                  <p>Shipping calculated at checkout based on size and destination. White glove delivery available for an additional fee.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2">United Kingdom</h3>
                  <p>Shipping calculated at checkout. Standard delivery or white glove service available.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2">International</h3>
                  <p>We ship worldwide. Contact us at info@configura.com for a custom shipping quote for your location.</p>
                </div>
              </div>
            </div>

            {/* Delivery Options */}
            <div className="bg-white border border-neutral-200 p-8">
              <h2 className="text-xl font-display font-semibold text-neutral-900 mb-6 uppercase tracking-wide">
                Delivery Options
              </h2>
              <div className="space-y-6 text-neutral-700 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2">Standard Delivery (Threshold)</h3>
                  <p>
                    Your furniture is delivered to your building entrance or lobby. Delivery team will not bring items inside or up stairs. Ideal for ground-floor locations or buildings with freight elevators.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2">White Glove Delivery (Recommended)</h3>
                  <p>
                    Our premium service includes delivery to your room of choice, unpacking, assembly, placement, and removal of all packaging materials. Our team will ensure your furniture is positioned exactly where you want it.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2">Scheduling Your Delivery</h3>
                  <p>
                    Once your furniture is ready for shipment, our logistics team will contact you to schedule a delivery window. We offer flexible scheduling options to accommodate your availability.
                  </p>
                </div>
              </div>
            </div>

            {/* Production Updates */}
            <div className="bg-white border border-neutral-200 p-8">
              <h2 className="text-xl font-display font-semibold text-neutral-900 mb-6 uppercase tracking-wide">
                Order Tracking
              </h2>
              <div className="space-y-4 text-neutral-700 leading-relaxed">
                <p>
                  You'll receive email updates at key milestones in your order journey:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Order confirmation with estimated production timeline</li>
                  <li>Production start notification</li>
                  <li>Milestone updates during crafting</li>
                  <li>Quality inspection completion</li>
                  <li>Shipment preparation and dispatch</li>
                  <li>Delivery scheduling and tracking information</li>
                </ul>
              </div>
            </div>

            {/* Packaging & Sustainability */}
            <div className="bg-white border border-neutral-200 p-8">
              <h2 className="text-xl font-display font-semibold text-neutral-900 mb-6 uppercase tracking-wide">
                Sustainable Packaging
              </h2>
              <div className="space-y-4 text-neutral-700 leading-relaxed">
                <p>
                  We protect your furniture with custom-designed, fully recyclable packaging materials. Our packaging uses minimal plastic, favoring biodegradable paper-based materials and reusable blankets and straps.
                </p>
                <p>
                  If you choose white glove delivery, our team will remove and properly recycle all packaging on-site.
                </p>
              </div>
            </div>

            {/* International Shipping */}
            <div className="bg-white border border-neutral-200 p-8">
              <h2 className="text-xl font-display font-semibold text-neutral-900 mb-6 uppercase tracking-wide">
                International Orders
              </h2>
              <div className="space-y-4 text-neutral-700 leading-relaxed">
                <p>
                  International shipments may be subject to customs duties, taxes, and fees imposed by your destination country. These charges are the responsibility of the recipient and are not included in your order total.
                </p>
                <p>
                  We provide all necessary customs documentation to facilitate smooth clearance. Delivery times for international orders vary by destination and customs processing.
                </p>
              </div>
            </div>

            {/* Delivery Preparation */}
            <div className="bg-white border border-neutral-200 p-8">
              <h2 className="text-xl font-display font-semibold text-neutral-900 mb-6 uppercase tracking-wide">
                Preparing for Delivery
              </h2>
              <div className="space-y-4 text-neutral-700 leading-relaxed">
                <p>
                  Before your delivery date, please ensure:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Delivery pathways are clear and accessible</li>
                  <li>Doorways and stairways can accommodate your furniture dimensions (we'll provide measurements)</li>
                  <li>Elevators are available and operational if applicable</li>
                  <li>Someone over 18 is present to accept delivery</li>
                  <li>Pets are secured in a separate area</li>
                </ul>
                <p className="mt-4">
                  If you have concerns about access or placement, please contact our delivery team in advance.
                </p>
              </div>
            </div>

            {/* Delivery Issues */}
            <div className="bg-white border border-neutral-200 p-8">
              <h2 className="text-xl font-display font-semibold text-neutral-900 mb-6 uppercase tracking-wide">
                Damage or Issues
              </h2>
              <div className="space-y-4 text-neutral-700 leading-relaxed">
                <p>
                  Please inspect your furniture carefully upon delivery. If you notice any damage or defects, note them on the delivery receipt and contact us immediately at info@configura.com with photos.
                </p>
                <p>
                  We stand behind the quality of our craftsmanship and will work quickly to resolve any issues, whether through repair, replacement, or refund.
                </p>
              </div>
            </div>

            {/* Contact CTA */}
            <div className="bg-neutral-900 text-neutral-50 p-8 text-center">
              <h2 className="text-xl font-display font-semibold mb-4">
                Shipping Questions?
              </h2>
              <p className="text-neutral-300 mb-6">
                Our team is here to help with any delivery inquiries
              </p>
              <a
                href="mailto:info@configura.com"
                className="inline-block bg-white text-neutral-900 px-8 py-3 hover:bg-neutral-100 transition-colors uppercase text-sm font-semibold tracking-wider"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Shipping
