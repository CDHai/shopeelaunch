import { useState, useEffect } from 'react';
import { LineChart, Line, PieChart, Pie, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { shopeeCategories } from '../../data/shopeeCategories';

// Step 1: Category Selection
export const CategoryStep = ({ formData, setFormData }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedMain, setSelectedMain] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);

  const handleCategorySelect = (category, level, parentPath = '') => {
    if (selectedCategories.length >= 3 && 
        !selectedCategories.find(cat => cat.id === category.id)) {
      alert('Bạn chỉ có thể chọn tối đa 3 danh mục');
      return;
    }

    // Lưu thông tin category với path đầy đủ
    const addCategory = (cat, path) => {
      const existingIndex = selectedCategories.findIndex(c => c.id === cat.id);
      let newSelected;
      
      if (existingIndex > -1) {
        // Remove if already selected
        newSelected = selectedCategories.filter(c => c.id !== cat.id);
      } else {
        // Add new category
        const categoryInfo = {
          id: cat.id,
          name: cat.name,
          level: level,
          path: path.trim(),
          originalData: cat // Lưu data gốc để sử dụng sau này
        };
        newSelected = [...selectedCategories, categoryInfo];
      }

      setSelectedCategories(newSelected);
      setFormData({
        ...formData,
        categories: newSelected
      });
    };

    switch (level) {
      case 'main':
        setSelectedMain(category);
        setSelectedSub(null);
        addCategory(category, category.name);
        break;
      case 'sub':
        setSelectedSub(category);
        addCategory(category, `${parentPath} > ${category.name}`);
        break;
      case 'specific':
        addCategory(category, `${parentPath} > ${category.name}`);
        break;
    }
  };

  const isSelected = (categoryId) => {
    return selectedCategories.some(cat => cat.id === categoryId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Chọn danh mục sản phẩm</h3>
        <p className="mt-1 text-sm text-gray-500">
          Bạn có thể chọn danh mục ở bất kỳ cấp độ nào (tối đa 3 danh mục)
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Main Categories */}
        <div className="border rounded-lg p-4">
          <h4 className="font-medium mb-3">Danh mục chính</h4>
          <div className="space-y-2">
            {shopeeCategories.map(category => (
              <div
                key={category.id}
                onClick={() => handleCategorySelect(category, 'main')}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  isSelected(category.id)
                    ? 'bg-indigo-50 border-2 border-indigo-500'
                    : selectedMain?.id === category.id
                    ? 'bg-gray-50 border-2 border-gray-300'
                    : 'hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{category.name}</span>
                  {isSelected(category.id) && (
                    <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                      Đã chọn
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sub Categories */}
        {selectedMain && (
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-3">Danh mục phụ</h4>
            <div className="space-y-2">
              {selectedMain.subcategories.map(category => (
                <div
                  key={category.id}
                  onClick={() => handleCategorySelect(category, 'sub', selectedMain.name)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    isSelected(category.id)
                      ? 'bg-indigo-50 border-2 border-indigo-500'
                      : selectedSub?.id === category.id
                      ? 'bg-gray-50 border-2 border-gray-300'
                      : 'hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{category.name}</span>
                    {isSelected(category.id) && (
                      <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                        Đã chọn
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Specific Categories */}
        {selectedSub && (
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-3">Danh mục cụ thể</h4>
            <div className="space-y-2">
              {selectedSub.subcategories.map(category => (
                <div
                  key={category.id}
                  onClick={() => handleCategorySelect(category, 'specific', `${selectedMain.name} > ${selectedSub.name}`)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    isSelected(category.id)
                      ? 'bg-indigo-50 border-2 border-indigo-500'
                      : 'hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{category.name}</span>
                    {isSelected(category.id) && (
                      <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                        Đã chọn
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Selected Categories */}
      {selectedCategories.length > 0 && (
        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium mb-3">Danh mục đã chọn ({selectedCategories.length}/3)</h4>
          <div className="space-y-2">
            {selectedCategories.map((category) => (
              <div key={category.id} className="flex items-center justify-between bg-white p-3 rounded-lg border">
                <div>
                  <p className="text-sm font-medium">{category.name}</p>
                  <p className="text-xs text-gray-500">{category.path}</p>
                  <span className="text-xs text-indigo-600">
                    {category.level === 'main' ? 'Danh mục chính' : 
                     category.level === 'sub' ? 'Danh mục phụ' : 
                     'Danh mục cụ thể'}
                  </span>
                </div>
                <button
                  onClick={() => handleCategorySelect(category, category.level)}
                  className="text-red-600 hover:text-red-700"
                >
                  Xóa
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Step 2: Market Analysis
export const MarketAnalysisStep = ({ formData, setFormData }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeMarket = async () => {
    if (!formData.specificCategory) return;

    setLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/market-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          categoryId: formData.specificCategory.id,
        }),
      });

      const data = await response.json();
      setFormData({
        ...formData,
        marketAnalysis: data,
      });
    } catch (error) {
      setError('Failed to analyze market. Please try again.');
      console.error('Market analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (formData.specificCategory) {
      analyzeMarket();
    }
  }, [formData.specificCategory]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Analyzing market data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
        <button
          onClick={analyzeMarket}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md"
        >
          Retry Analysis
        </button>
      </div>
    );
  }

  if (!formData.marketAnalysis) return null;

  return (
    <div className="space-y-8">
      {/* Market Overview */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium">Market Size</h3>
          <p className="text-3xl font-bold text-indigo-600">
            {formData.marketAnalysis.marketSize}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium">Growth Rate</h3>
          <p className="text-3xl font-bold text-green-600">
            {formData.marketAnalysis.growthRate}
          </p>
        </div>
      </div>

      {/* Search Trends */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Search Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formData.marketAnalysis.searchTrends}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="volume" stroke="#4F46E5" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top Competitors */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Market Share</h3>
        <div className="grid grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={formData.marketAnalysis.marketShare}
                dataKey="value"
                nameKey="name"
                fill="#4F46E5"
              />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div>
            <ul className="space-y-2">
              {formData.marketAnalysis.marketShare.map((item, index) => (
                <li key={index} className="flex justify-between">
                  <span>{item.name}</span>
                  <span className="font-medium">{item.value}%</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Top Selling Products</h3>
        <div className="grid grid-cols-2 gap-4">
          {formData.marketAnalysis.topProducts.map((product, index) => (
            <div key={index} className="border rounded-lg p-4 flex gap-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-24 h-24 object-cover rounded"
              />
              <div>
                <h4 className="font-medium">{product.name}</h4>
                <p className="text-gray-600">{product.price}</p>
                <p className="text-sm text-gray-500">
                  Monthly Sales: {product.monthlySales}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Step 3: Business Plan
export const BusinessPlanStep = ({ formData, setFormData }) => {
    const [loading, setLoading] = useState(false);
    const [aiSuggestions, setAiSuggestions] = useState(null);
  
    const handleChange = (field, value) => {
      setFormData({
        ...formData,
        businessPlan: {
          ...formData.businessPlan,
          [field]: value
        }
      });
    };
  
    const generateAiSuggestions = async () => {
      setLoading(true);
      try {
        // TODO: Replace with actual API call
        const response = await fetch('/api/business-plan/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            investment: formData.businessPlan.investment,
            category: formData.specificCategory,
            marketData: formData.marketAnalysis
          })
        });
        
        const suggestions = await response.json();
        setAiSuggestions(suggestions);
        handleChange('aiSuggestions', suggestions);
      } catch (error) {
        console.error('Failed to get AI suggestions:', error);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      if (formData.businessPlan.investment) {
        generateAiSuggestions();
      }
    }, [formData.businessPlan.investment]);
  
    return (
      <div className="space-y-8">
        {/* Investment Input */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Investment Planning</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Initial Investment</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">₫</span>
                </div>
                <input
                  type="number"
                  value={formData.businessPlan.investment || ''}
                  onChange={(e) => handleChange('investment', e.target.value)}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Enter your investment amount"
                />
              </div>
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-700">Target Monthly Revenue</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">₫</span>
                </div>
                <input
                  type="number"
                  value={formData.businessPlan.targetRevenue || ''}
                  onChange={(e) => handleChange('targetRevenue', e.target.value)}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Enter target monthly revenue"
                />
              </div>
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-700">Business Timeline</label>
              <select
                value={formData.businessPlan.timeline || ''}
                onChange={(e) => handleChange('timeline', e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">Select timeline</option>
                <option value="3">3 months</option>
                <option value="6">6 months</option>
                <option value="12">12 months</option>
              </select>
            </div>
          </div>
        </div>
  
        {/* AI Suggestions */}
        {loading ? (
          <div className="text-center py-6">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Analyzing your business plan...</p>
          </div>
        ) : aiSuggestions && (
          <>
            {/* Initial Stock Suggestion */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="text-lg font-medium mb-4">Recommended Initial Stock</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-indigo-50 p-4 rounded-md">
                  <p className="text-2xl font-bold text-indigo-600">
                    {aiSuggestions.recommendedStock.quantity} units
                  </p>
                  <p className="mt-1 text-sm text-gray-600">Recommended quantity</p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-md">
                  <p className="text-2xl font-bold text-indigo-600">
                    ₫{aiSuggestions.recommendedStock.totalCost.toLocaleString()}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">Estimated cost</p>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                {aiSuggestions.recommendedStock.reasoning}
              </div>
            </div>
  
            {/* Pricing Strategy */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="text-lg font-medium mb-4">Pricing Strategy</h4>
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-md">
                  <p className="font-medium text-green-800">Recommended Price Range:</p>
                  <p className="text-2xl font-bold text-green-600">
                    ₫{aiSuggestions.pricingStrategy.minPrice.toLocaleString()} - 
                    ₫{aiSuggestions.pricingStrategy.maxPrice.toLocaleString()}
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    {aiSuggestions.pricingStrategy.reasoning}
                  </p>
                </div>
              </div>
            </div>
  
            {/* Revenue Forecast */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="text-lg font-medium mb-4">Revenue Forecast</h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={aiSuggestions.forecast}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#4F46E5" />
                  <Line type="monotone" dataKey="profit" stroke="#10B981" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    );
  };
  
  // Step 4: Branding
  export const BrandingStep = ({ formData, setFormData }) => {
    const [loading, setLoading] = useState(false);
    const [brandSuggestions, setBrandSuggestions] = useState(null);
  
    const handleChange = (field, value) => {
      setFormData({
        ...formData,
        branding: {
          ...formData.branding,
          [field]: value
        }
      });
    };
  
    const generateBrandingSuggestions = async () => {
      setLoading(true);
      try {
        // TODO: Replace with actual API call
        const response = await fetch('/api/branding/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            category: formData.specificCategory,
            targetMarket: formData.branding.targetMarket,
            values: formData.branding.values,
            style: formData.branding.style
          })
        });
  
        const suggestions = await response.json();
        setBrandSuggestions(suggestions);
        handleChange('aiSuggestions', suggestions);
      } catch (error) {
        console.error('Failed to generate branding suggestions:', error);
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className="space-y-8">
        {/* Brand Input Form */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Brand Identity</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Target Market</label>
              <textarea
                value={formData.branding.targetMarket || ''}
                onChange={(e) => handleChange('targetMarket', e.target.value)}
                rows={3}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Describe your target customers..."
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-700">Brand Values</label>
              <textarea
                value={formData.branding.values || ''}
                onChange={(e) => handleChange('values', e.target.value)}
                rows={3}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="What values does your brand represent?"
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-700">Brand Style</label>
              <select
                value={formData.branding.style || ''}
                onChange={(e) => handleChange('style', e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">Select style</option>
                <option value="modern">Modern & Minimalist</option>
                <option value="traditional">Traditional & Classic</option>
                <option value="playful">Playful & Fun</option>
                <option value="luxury">Luxury & Premium</option>
                <option value="natural">Natural & Organic</option>
              </select>
            </div>
  
            <button
              onClick={generateBrandingSuggestions}
              className="w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Generate Brand Suggestions
            </button>
          </div>
        </div>
  
        {/* AI Generated Suggestions */}
        {loading ? (
          <div className="text-center py-6">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Generating brand suggestions...</p>
          </div>
        ) : brandSuggestions && (
          <div className="space-y-6">
            {/* Brand Names */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="text-lg font-medium mb-4">Suggested Brand Names</h4>
              <div className="grid grid-cols-3 gap-4">
                {brandSuggestions.names.map((name, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg cursor-pointer hover:border-indigo-500"
                    onClick={() => handleChange('name', name)}
                  >
                    <p className="font-medium">{name}</p>
                  </div>
                ))}
              </div>
            </div>
  
            {/* Slogans */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="text-lg font-medium mb-4">Suggested Slogans</h4>
              <div className="space-y-2">
                {brandSuggestions.slogans.map((slogan, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg cursor-pointer hover:border-indigo-500"
                    onClick={() => handleChange('slogan', slogan)}
                  >
                    <p>{slogan}</p>
                  </div>
                ))}
              </div>
            </div>
  
            {/* Brand Story */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="text-lg font-medium mb-4">Brand Story</h4>
              <div className="prose max-w-none">
                {brandSuggestions.story}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
// Step 5: Product Setup
export const ProductSetupStep = ({ formData, setFormData }) => {
  const [loading, setLoading] = useState(false);
  const [optimizedContent, setOptimizedContent] = useState(null);

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      product: {
        ...formData.product,
        [field]: value
      }
    });
  };

  const optimizeContent = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/product/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.product.name,
          description: formData.product.description,
          category: formData.specificCategory
        })
      });

      const optimized = await response.json();
      setOptimizedContent(optimized);
      handleChange('optimizedContent', optimized);
    } catch (error) {
      console.error('Failed to optimize content:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Product Details Form */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-6">Product Information</h3>
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Product Name</label>
              <input
                type="text"
                value={formData.product.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">₫</span>
                </div>
                <input
                  type="number"
                  value={formData.product.price || ''}
                  onChange={(e) => handleChange('price', e.target.value)}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Product Description</label>
            <textarea
              value={formData.product.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Key Features</label>
            <div className="mt-2 space-y-2">
              {(formData.product.features || []).map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => {
                      const newFeatures = [...(formData.product.features || [])];
                      newFeatures[index] = e.target.value;
                      handleChange('features', newFeatures);
                    }}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <button
                    onClick={() => {
                      const newFeatures = formData.product.features.filter((_, i) => i !== index);
                      handleChange('features', newFeatures);
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  const newFeatures = [...(formData.product.features || []), ''];
                  handleChange('features', newFeatures);
                }}
                className="text-sm text-indigo-600 hover:text-indigo-700"
              >
                + Add Feature
              </button>
            </div>
          </div>

          <button
            onClick={optimizeContent}
            className="w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Optimize for Shopee
          </button>
        </div>
      </div>

      {/* AI Optimized Content */}
      {loading ? (
        <div className="text-center py-6">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Optimizing product content...</p>
        </div>
      ) : optimizedContent && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="text-lg font-medium mb-4">Optimized Content</h4>
          
          {/* Title */}
          <div className="mb-6">
            <h5 className="text-sm font-medium text-gray-700">Optimized Title</h5>
            <p className="mt-2 p-3 bg-gray-50 rounded-md">{optimizedContent.title}</p>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h5 className="text-sm font-medium text-gray-700">Optimized Description</h5>
            <div className="mt-2 p-3 bg-gray-50 rounded-md whitespace-pre-wrap">
              {optimizedContent.description}
            </div>
          </div>

          {/* Keywords */}
          <div>
            <h5 className="text-sm font-medium text-gray-700">SEO Keywords</h5>
            <div className="mt-2 flex flex-wrap gap-2">
              {optimizedContent.keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              handleChange('name', optimizedContent.title);
              handleChange('description', optimizedContent.description);
              handleChange('keywords', optimizedContent.keywords);
            }}
            className="mt-4 w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
          >
            Apply Optimized Content
          </button>
        </div>
      )}

      {/* Preview */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h4 className="text-lg font-medium mb-4">Shopee Preview</h4>
        <div className="border rounded-lg p-4">
          {/* Mock Shopee product layout */}
          <div className="aspect-w-1 aspect-h-1 w-full mb-4">
            <div className="bg-gray-200 rounded-lg"></div>
          </div>
          <h5 className="text-lg font-medium">{formData.product.name}</h5>
          <p className="text-xl font-bold text-red-600 mt-2">
            ₫{parseInt(formData.product.price || 0).toLocaleString()}
          </p>
          <div className="mt-4 text-sm text-gray-600">
            {formData.product.description}
          </div>
        </div>
      </div>
    </div>
  );
};

// Step 6: Marketing Strategy
export const MarketingStep = ({ formData, setFormData }) => {
  const [loading, setLoading] = useState(false);
  const [marketingPlan, setMarketingPlan] = useState(null);

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      marketing: {
        ...formData.marketing,
        [field]: value
      }
    });
  };

  const generateMarketingPlan = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/marketing/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          budget: formData.marketing.budget,
          category: formData.specificCategory,
          product: formData.product
        })
      });

      const plan = await response.json();
      setMarketingPlan(plan);
      handleChange('plan', plan);
    } catch (error) {
      console.error('Failed to generate marketing plan:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Marketing Budget Input */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Marketing Budget</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Monthly Budget</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">₫</span>
              </div>
              <input
                type="number"
                value={formData.marketing.budget || ''}
                onChange={(e) => handleChange('budget', e.target.value)}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <button
            onClick={generateMarketingPlan}
            className="w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Generate Marketing Plan
          </button>
        </div>
      </div>

      {/* Marketing Plan */}
      {loading ? (
        <div className="text-center py-6">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Generating marketing plan...</p>
        </div>
      ) : marketingPlan && (
        <div className="space-y-6">
          {/* Budget Allocation */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="text-lg font-medium mb-4">Budget Allocation</h4>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(marketingPlan.budgetAllocation).map(([channel, amount]) => (
                <div key={channel} className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">{channel}</p>
                  <p className="text-xl font-bold text-indigo-600">
                    ₫{parseInt(amount).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Marketing Calendar */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="text-lg font-medium mb-4">30-Day Marketing Calendar</h4>
            <div className="border rounded-lg">
              {marketingPlan.calendar.map((event, index) => (
                <div
                  key={index}
                  className="p-4 border-b last:border-b-0 hover:bg-gray-50"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-gray-600">{event.description}</p>
                    </div>
                    <span className="text-sm text-gray-500">Day {event.day}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Campaign Ideas */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="text-lg font-medium mb-4">Campaign Ideas</h4>
            <div className="space-y-4">
              {marketingPlan.campaigns.map((campaign, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h5 className="font-medium">{campaign.name}</h5>
                  <p className="text-sm text-gray-600 mt-2">{campaign.description}</p>
                  <div className="mt-2 flex gap-2">
                    {campaign.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Step 7: Shop Setup
export const ShopSetupStep = ({ formData, setFormData }) => {
  const [loading, setLoading] = useState(false);
  const [setupGuide, setSetupGuide] = useState(null);

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      shopSetup: {
        ...formData.shopSetup,
        [field]: value
      }
    });
  };

  const generateSetupGuide = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/shop/setup-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: formData.specificCategory,
          shopName: formData.shopSetup.name,
          policies: formData.shopSetup.policies
        })
      });

      const guide = await response.json();
      setSetupGuide(guide);
      handleChange('setupGuide', guide);
    } catch (error) {
      console.error('Failed to generate setup guide:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Shop Information */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-6">Shop Information</h3>
        <div className="space-y-6">
          {/* Basic Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Shop Name</label>
            <input
              type="text"
              value={formData.shopSetup.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your shop name"
            />
          </div>

          {/* Shop Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Shop Description</label>
            <textarea
              value={formData.shopSetup.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Describe your shop..."
            />
          </div>

          {/* Policies */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700">Shop Policies</h4>
            
            {/* Return Policy */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Return Policy</label>
              <textarea
                value={formData.shopSetup.policies?.return || ''}
                onChange={(e) => handleChange('policies', {
                  ...formData.shopSetup.policies,
                  return: e.target.value
                })}
                rows={3}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            {/* Shipping Policy */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Shipping Policy</label>
              <textarea
                value={formData.shopSetup.policies?.shipping || ''}
                onChange={(e) => handleChange('policies', {
                  ...formData.shopSetup.policies,
                  shipping: e.target.value
                })}
                rows={3}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            {/* Warranty Policy */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Warranty Policy</label>
              <textarea
                value={formData.shopSetup.policies?.warranty || ''}
                onChange={(e) => handleChange('policies', {
                  ...formData.shopSetup.policies,
                  warranty: e.target.value
                })}
                rows={3}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Shipping Options */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Shipping Options</h4>
            <div className="space-y-2">
              {['Standard', 'Express', 'Next Day'].map((option) => (
                <label key={option} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={(formData.shopSetup.shippingOptions || []).includes(option)}
                    onChange={(e) => {
                      const current = formData.shopSetup.shippingOptions || [];
                      const updated = e.target.checked
                        ? [...current, option]
                        : current.filter(opt => opt !== option);
                      handleChange('shippingOptions', updated);
                    }}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Generate Setup Guide */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Setup Checklist</h3>
          <button
            onClick={generateSetupGuide}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Generate Guide
          </button>
        </div>

        {loading ? (
          <div className="text-center py-6">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Generating setup guide...</p>
          </div>
        ) : setupGuide && (
          <div className="space-y-6">
            {/* Setup Steps */}
            <div className="space-y-4">
              {setupGuide.steps.map((step, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-indigo-600">{index + 1}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{step.title}</h4>
                    <p className="mt-1 text-sm text-gray-600">{step.description}</p>
                    {step.tips && (
                      <div className="mt-2 text-sm text-gray-500 bg-gray-50 p-2 rounded">
                        <span className="font-medium">Tip:</span> {step.tips}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Resources */}
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Helpful Resources</h4>
              <ul className="space-y-2">
                {setupGuide.resources.map((resource, index) => (
                  <li key={index}>
                    <a
                      href={resource.url}
                      className="text-sm text-indigo-600 hover:text-indigo-700"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {resource.title}
                    </a>
                    <p className="text-sm text-gray-500">{resource.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};