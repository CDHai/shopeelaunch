import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { 
  CategoryStep,
  MarketAnalysisStep,
  BusinessPlanStep,
  BrandingStep,
  ProductSetupStep,
  MarketingStep,
  ShopSetupStep
} from './WizardSteps';

const steps = [
  { id: 1, name: 'Choose Category' },
  { id: 2, name: 'Market Analysis' },
  { id: 3, name: 'Business Plan' },
  { id: 4, name: 'Create Brand' },
  { id: 5, name: 'Product Setup' },
  { id: 6, name: 'Marketing Strategy' },
  { id: 7, name: 'Shop Setup' },
];

const ProjectWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    category: '',
    marketAnalysis: null,
    businessPlan: {
      investment: '',
      targetRevenue: '',
      timeline: ''
    },
    branding: {
      name: '',
      slogan: '',
      description: ''
    },
    product: {
      name: '',
      description: '',
      keywords: []
    },
    marketing: {
      strategy: '',
      budget: '',
      channels: []
    },
    shopSetup: {
      shopName: '',
      policies: [],
      logistics: []
    }
  });

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(current => current + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(current => current - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <CategoryStep formData={formData} setFormData={setFormData} />;
      case 2:
        return <MarketAnalysisStep formData={formData} setFormData={setFormData} />;
      case 3:
        return <BusinessPlanStep formData={formData} setFormData={setFormData} />;
      case 4:
        return <BrandingStep formData={formData} setFormData={setFormData} />;
      case 5:
        return <ProductSetupStep formData={formData} setFormData={setFormData} />;
      case 6:
        return <MarketingStep formData={formData} setFormData={setFormData} />;
      case 7:
        return <ShopSetupStep formData={formData} setFormData={setFormData} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Progress Steps */}
      <nav aria-label="Progress">
        <ol className="flex items-center justify-between">
          {steps.map((step) => (
            <li key={step.id} className={`relative ${
              step.id === currentStep ? 'text-indigo-600' : 
              step.id < currentStep ? 'text-green-600' : 'text-gray-500'
            }`}>
              <div className="flex items-center">
                <span className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  step.id === currentStep ? 'bg-indigo-100' :
                  step.id < currentStep ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  {step.id}
                </span>
                <span className="hidden sm:block ml-2 text-sm font-medium">
                  {step.name}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </nav>

      {/* Step Content */}
      <div className="mt-8 bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {renderStep()}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-8 flex justify-between">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className={`inline-flex items-center px-4 py-2 rounded-md shadow-sm text-sm font-medium ${
            currentStep === 1 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <ChevronLeftIcon className="h-5 w-5 mr-2" />
          Previous
        </button>
        <button
          onClick={nextStep}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          {currentStep === steps.length ? 'Finish' : 'Next'}
          {currentStep !== steps.length && (
            <ChevronRightIcon className="h-5 w-5 ml-2" />
          )}
        </button>
      </div>
    </div>
  );
};

export default ProjectWizard;