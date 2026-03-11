import { useState, useMemo } from "react"
import { ArrowLeft, Check } from "@medusajs/icons"

interface ConfiguratorOption {
  id: string
  name: string
  description?: string
  image_url?: string
  price_modifier?: number
  price?: number
  component_product_id?: string
  parent_option_id?: string
  product_id?: string
  order: number
}

interface ConfiguratorStep {
  id: string
  title: string
  description?: string
  order: number
  options: ConfiguratorOption[]
}

export interface Configurator {
  id: string
  name: string
  description?: string
  base_price: number
  steps: ConfiguratorStep[]
}

interface ProductConfiguratorProps {
  product: any
  region: any
  configurator: Configurator
  onClose: () => void
  onComplete: (
    configuration: Record<string, string>,
    totalPrice: number,
    configurationDetails?: Array<{ stepName: string; optionName: string; price: number }>
  ) => void
}

export function ProductConfigurator({
  product,
  region,
  configurator,
  onClose,
  onComplete,
}: ProductConfiguratorProps) {
  const [configuration, setConfiguration] = useState<Record<string, string>>({})
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  // Sort steps by order
  const sortedSteps = useMemo(() => {
    if (!configurator?.steps || !Array.isArray(configurator.steps)) {
      return []
    }
    return [...configurator.steps].sort((a, b) => a.order - b.order)
  }, [configurator])

  const currentStep = sortedSteps[currentStepIndex]

  // Calculate total price from component products
  const totalPrice = useMemo(() => {
    let total = configurator.base_price || 0

    Object.entries(configuration).forEach(([stepId, optionId]) => {
      const step = sortedSteps.find((s) => s.id === stepId)
      const option = step?.options.find((o) => o.id === optionId)
      
      // Use the component product price
      if (option?.price) {
        total += option.price
      }
    })

    return total
  }, [configuration, configurator.base_price, sortedSteps])

  // Check if all steps have selections
  const isComplete = sortedSteps.every(step => configuration[step.id])

  const handleOptionSelect = (stepId: string, optionId: string) => {
    setConfiguration((prev) => ({
      ...prev,
      [stepId]: optionId,
    }))
  }

  const handleNext = () => {
    if (currentStepIndex < sortedSteps.length - 1) {
      setCurrentStepIndex(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1)
    }
  }

  const handleAddToCart = () => {
    if (isComplete) {
      // Build human-readable configuration details
      const configurationDetails = Object.entries(configuration).map(([stepId, optionId]) => {
        const step = sortedSteps.find((s) => s.id === stepId)
        const option = step?.options.find((o) => o.id === optionId)
        
        return {
          stepName: step?.title || stepId,
          optionName: option?.name || optionId,
          price: option?.price || 0,
        }
      })
      
      onComplete(configuration, totalPrice, configurationDetails)
    }
  }

  // Format price for display
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat(region.countries[0]?.iso_2 || "us", {
      style: "currency",
      currency: region.currency_code,
    }).format(amount)
  }

  if (!currentStep) return null

  const currentStepSelection = configuration[currentStep.id]
  const isLastStep = currentStepIndex === sortedSteps.length - 1

  const activeImage = product.images?.[selectedImageIndex]?.url || product.thumbnail || product.images?.[0]?.url

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left side - Product image */}
      <div className="w-1/2 sticky top-0 h-screen flex-shrink-0 relative overflow-hidden">
        <img
          src={activeImage}
          alt={product.title}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Badge overlay */}
        <div className="absolute top-12 left-12 bg-neutral-500 text-white px-6 py-4 rounded-lg">
          <div className="text-xs uppercase tracking-wider mb-1">YOUR DESIGN</div>
          <div className="text-sm font-medium">
            Step {currentStepIndex + 1} of {sortedSteps.length}
          </div>
        </div>

        {/* Thumbnail gallery */}
        {product.images && product.images.length > 1 && (
          <div className="absolute bottom-8 left-8 flex gap-2">
            {product.images.map((image: any, index: number) => (
              <button
                key={image.id || index}
                onClick={() => setSelectedImageIndex(index)}
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImageIndex === index
                    ? 'border-white'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={image.url}
                  alt={`${product.title} view ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right side - Configuration wizard */}
      <div className="w-1/2 bg-white flex flex-col min-h-screen">
        {/* Header */}
        <div className="px-12 pt-12 pb-8">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Product
          </button>
          
          <h1 className="text-3xl font-serif text-black mb-2">
            {currentStep.title}
          </h1>
          <p className="text-gray-600">
            {currentStep.description || `Choose your ${currentStep.title.toLowerCase()}`}
          </p>
        </div>

        {/* Progress indicator */}
        <div className="px-12 pb-6">
          <div className="flex gap-2">
            {sortedSteps.map((step, index) => (
              <div
                key={step.id}
                className={`flex-1 h-1 rounded-full transition-colors ${
                  index < currentStepIndex
                    ? 'bg-black'
                    : index === currentStepIndex
                    ? 'bg-gray-400'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Options grid */}
        <div className="px-12 overflow-y-auto">
          <div className="grid grid-cols-1 gap-4">
            {currentStep.options.map((option) => {
              const isSelected = currentStepSelection === option.id
              
              return (
                <button
                  key={option.id}
                  onClick={() => handleOptionSelect(currentStep.id, option.id)}
                  className={`relative p-6 border-2 rounded-lg text-left transition-all hover:border-black ${
                    isSelected
                      ? 'border-black bg-gray-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-4 right-4 w-6 h-6 bg-black rounded-full flex items-center justify-center z-10">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                  
                  <div>
                    <div className="text-lg font-medium text-black mb-1">
                      {option.name}
                    </div>
                    
                    {option.description && (
                      <div className="text-sm text-gray-600 mb-2">
                        {option.description}
                      </div>
                    )}
                    
                    {option.price !== undefined && option.price > 0 && (
                      <div className="text-sm font-medium text-black">
                        +{formatPrice(option.price)}
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Selected options summary */}
        {Object.keys(configuration).length > 0 && (
          <div className="px-12 mt-6">
            <div className="text-sm text-gray-600 mb-3">Your selections:</div>
            <ul className="space-y-1.5">
              {sortedSteps.map((step) => {
                const selectedOptionId = configuration[step.id]
                const selectedOption = step.options.find(opt => opt.id === selectedOptionId)
                
                if (!selectedOption) return null
                
                return (
                  <li key={step.id} className="text-sm text-gray-800">
                    • {selectedOption.name}
                    {selectedOption.price !== undefined && selectedOption.price > 0 && (
                      <span className="text-gray-600"> (+{formatPrice(selectedOption.price)})</span>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        {/* Footer - Navigation and Price */}
        <div className="px-12 py-8 mt-8 border-t border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-sm text-gray-600 mb-1">Total Price</div>
              <div className="text-2xl font-serif text-black">
                {formatPrice(totalPrice)}
              </div>
            </div>
          </div>
          
          <div className="flex gap-4">
            {currentStepIndex > 0 && (
              <button
                onClick={handlePrevious}
                className="px-8 py-4 border-2 border-gray-200 text-black rounded-lg font-medium hover:border-black transition-colors"
              >
                Previous
              </button>
            )}
            
            {!isLastStep ? (
              <button
                onClick={handleNext}
                disabled={!currentStepSelection}
                className="flex-1 py-4 px-8 bg-black text-white rounded-lg font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-900 transition-colors"
              >
                Next Step
              </button>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={!isComplete}
                className="flex-1 py-4 px-8 bg-black text-white rounded-lg font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-900 transition-colors"
              >
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
