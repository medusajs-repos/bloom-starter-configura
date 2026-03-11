const Returns = () => {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="content-container pt-32 pb-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-display font-semibold text-neutral-900 mb-4 tracking-tight">
              Returns & Cancellations
            </h1>
            <p className="text-lg text-neutral-600">
              Your satisfaction with custom furniture matters
            </p>
          </div>

          <div className="space-y-8">
            {/* Custom Nature Notice */}
            <div className="bg-white border border-neutral-200 p-8">
              <h2 className="text-xl font-display font-semibold text-neutral-900 mb-6 uppercase tracking-wide">
                Made to Your Specifications
              </h2>
              <div className="space-y-4 text-neutral-700 leading-relaxed">
                <p>
                  Every piece from Configura is custom-made specifically for you based on your chosen configuration, materials, and finishes. Because each piece is crafted to order and unique to your specifications, we handle returns differently than ready-made furniture.
                </p>
                <p>
                  We're committed to ensuring you're completely satisfied with your custom furniture. Please review our policies carefully.
                </p>
              </div>
            </div>

            {/* Order Cancellation */}
            <div className="bg-white border border-neutral-200 p-8">
              <h2 className="text-xl font-display font-semibold text-neutral-900 mb-6 uppercase tracking-wide">
                Order Cancellation
              </h2>
              <div className="space-y-4 text-neutral-700 leading-relaxed">
                <p>
                  You may cancel your order for a full refund within 48 hours of placing it, provided production has not yet begun. To request cancellation, contact us immediately at info@configura.com with your order number.
                </p>
                <p>
                  Once production begins (typically 2-3 business days after order placement), cancellations are no longer possible as materials have been allocated and work has commenced on your custom piece.
                </p>
                <p>
                  If you need to cancel after production has started, please contact us. In some cases we may be able to accommodate a cancellation with a partial refund, minus costs already incurred.
                </p>
              </div>
            </div>

            {/* Defects & Damage */}
            <div className="bg-white border border-neutral-200 p-8">
              <h2 className="text-xl font-display font-semibold text-neutral-900 mb-6 uppercase tracking-wide">
                Manufacturing Defects & Damage
              </h2>
              <div className="space-y-4 text-neutral-700 leading-relaxed">
                <p>
                  We stand behind the quality of our craftsmanship. If your furniture arrives damaged or has a manufacturing defect, we will repair or replace it at no cost to you.
                </p>
                <p>
                  Please inspect your furniture thoroughly upon delivery and note any issues on the delivery receipt. Contact us within 7 days of delivery at info@configura.com with:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Your order number</li>
                  <li>Clear photos of the damage or defect from multiple angles</li>
                  <li>A description of the issue</li>
                </ul>
                <p className="mt-4">
                  Our team will assess the situation and arrange for repair, replacement parts, or a replacement piece depending on the nature of the issue.
                </p>
              </div>
            </div>

            {/* Incorrect Configuration */}
            <div className="bg-white border border-neutral-200 p-8">
              <h2 className="text-xl font-display font-semibold text-neutral-900 mb-6 uppercase tracking-wide">
                Received Wrong Configuration
              </h2>
              <div className="space-y-4 text-neutral-700 leading-relaxed">
                <p>
                  If the furniture you receive doesn't match your order specifications (wrong dimensions, materials, or finish), we sincerely apologize. This is our error and we'll make it right.
                </p>
                <p>
                  Contact us immediately at info@configura.com with your order number and photos of the item. We'll arrange for pickup of the incorrect piece and expedite production of your correct configuration at no additional charge.
                </p>
              </div>
            </div>

            {/* Change of Mind */}
            <div className="bg-white border border-neutral-200 p-8">
              <h2 className="text-xl font-display font-semibold text-neutral-900 mb-6 uppercase tracking-wide">
                Change of Mind Returns
              </h2>
              <div className="space-y-4 text-neutral-700 leading-relaxed">
                <p>
                  Because each piece is custom-made to your specifications, we cannot accept returns due to change of mind, buyer's remorse, or if the piece simply doesn't fit your space as expected.
                </p>
                <p>
                  We strongly encourage you to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Carefully review all dimensions and specifications before ordering</li>
                  <li>Use our configurator preview tools to visualize your piece</li>
                  <li>Measure your space to ensure proper fit</li>
                  <li>Request material samples if you're unsure about finishes or fabrics</li>
                  <li>Contact our team with any questions before placing your order</li>
                </ul>
                <p className="mt-4">
                  In exceptional circumstances, we may consider accepting a return for a change of mind case, subject to a 30% restocking fee to cover materials and labor costs already incurred. The piece must be unused, undamaged, and in original condition.
                </p>
              </div>
            </div>

            {/* Quality Issues */}
            <div className="bg-white border border-neutral-200 p-8">
              <h2 className="text-xl font-display font-semibold text-neutral-900 mb-6 uppercase tracking-wide">
                Quality Concerns After Delivery
              </h2>
              <div className="space-y-4 text-neutral-700 leading-relaxed">
                <p>
                  If you discover an issue with your furniture after delivery and the initial inspection period, please contact us as soon as possible at info@configura.com.
                </p>
                <p>
                  We warranty our furniture against manufacturing defects for 2 years from delivery. This covers:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Structural failures due to poor craftsmanship</li>
                  <li>Finish defects (peeling, cracking, discoloration under normal use)</li>
                  <li>Hardware failures</li>
                  <li>Fabric or upholstery defects (splitting, excessive pilling)</li>
                </ul>
                <p className="mt-4">
                  Our warranty does not cover normal wear and tear, damage from misuse, accidents, or modifications made after delivery.
                </p>
              </div>
            </div>

            {/* Refund Process */}
            <div className="bg-white border border-neutral-200 p-8">
              <h2 className="text-xl font-display font-semibold text-neutral-900 mb-6 uppercase tracking-wide">
                Refund Processing
              </h2>
              <div className="space-y-4 text-neutral-700 leading-relaxed">
                <p>
                  For approved cancellations or returns, refunds are processed to your original payment method within 5-10 business days after we confirm the cancellation or receive the returned item.
                </p>
                <p>
                  Return shipping costs will be covered by Configura for any items returned due to our error (defects, damage, wrong specifications). For other approved returns, return shipping is the customer's responsibility.
                </p>
              </div>
            </div>

            {/* Sample Program */}
            <div className="bg-white border border-neutral-200 p-8">
              <h2 className="text-xl font-display font-semibold text-neutral-900 mb-6 uppercase tracking-wide">
                Material Samples Program
              </h2>
              <div className="space-y-4 text-neutral-700 leading-relaxed">
                <p>
                  To help you make confident decisions about your custom furniture, we offer a material samples program. Request samples of fabrics, leather, wood finishes, and other materials before placing your order.
                </p>
                <p>
                  Samples are provided free of charge with a refundable deposit. Contact us at info@configura.com to request samples for your project.
                </p>
              </div>
            </div>

            {/* Contact CTA */}
            <div className="bg-neutral-900 text-neutral-50 p-8 text-center">
              <h2 className="text-xl font-display font-semibold mb-4">
                Questions About Returns?
              </h2>
              <p className="text-neutral-300 mb-6">
                Our team is here to help ensure your complete satisfaction
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

export default Returns
