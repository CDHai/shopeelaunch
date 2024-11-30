import { useState, useEffect } from 'react';
import { LineChart, Line, PieChart, Pie, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { shopeeCategories } from '../../data/shopeeCategories';
import { ChevronDownIcon, ChevronUpIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

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
  const [analysisData, setAnalysisData] = useState(null);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const analyzeMarketData = async () => {
    if (!formData.categories?.length) return;
    
    setLoading(true);
    setError(null);

    try {
      // Giả lập API call - trong thực tế sẽ gọi backend
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Phân tích dựa trên level của category
      const category = formData.categories[0]; // Lấy category đầu tiên để phân tích
      
      // Tạo dữ liệu phân tích dựa trên level
      const analysis = generateAnalysisData(category);
      
      setAnalysisData(analysis);
      setFormData({
        ...formData,
        marketAnalysis: analysis
      });

    } catch (error) {
      setError('Không thể phân tích thị trường. Vui lòng thử lại.');
      console.error('Market analysis error:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAnalysisData = (category) => {
    // Tạo dữ liệu phân tích khác nhau dựa trên level
    const levelData = {
      main: {
        marketSize: "150-200 tỷ đồng",
        growthRate: "15-20%",
        searchTrends: [
          { month: 'T1', value: 1000 },
          { month: 'T2', value: 1200 },
          { month: 'T3', value: 1100 },
          { month: 'T4', value: 1400 },
          { month: 'T5', value: 1600 },
          { month: 'T6', value: 1800 }
        ],
        marketShare: [
          { name: 'Shop A', value: 30 },
          { name: 'Shop B', value: 25 },
          { name: 'Shop C', value: 20 },
          { name: 'Shop D', value: 15 },
          { name: 'Khác', value: 10 }
        ],
        topProducts: [
          {
            name: "Serum Vitamin C",
            price: "249.000đ",
            sales: "5k+ / tháng",
            image: "/placeholder.jpg",
            shop: "Shop ABC"
          },
          {
            name: "Kem Chống Nắng SPF50",
            price: "299.000đ",
            sales: "4k+ / tháng",
            image: "/placeholder.jpg",
            shop: "Shop XYZ"
          },
          // Thêm các sản phẩm khác
        ],
        competitionLevel: "Cao",
        entryBarrier: "Trung bình",
        recommendations: [
          "Tập trung vào sản phẩm độc đáo",
          "Chú trọng dịch vụ khách hàng",
          "Đầu tư marketing online"
        ]
      },
      sub: {
        // Dữ liệu chi tiết hơn cho subcategory
        marketSize: "50-70 tỷ đồng",
        growthRate: "25-30%",
        // ...tương tự nhưng chi tiết hơn
      },
      specific: {
        // Dữ liệu rất chi tiết cho specific category
        marketSize: "10-15 tỷ đồng",
        growthRate: "35-40%",
        // ...tương tự nhưng rất chi tiết
      }
    };

    return levelData[category.level] || levelData.main;
  };

  useEffect(() => {
    if (formData.categories?.length) {
      analyzeMarketData();
    }
  }, [formData.categories]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-gray-600">Đang phân tích thị trường...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
        <button
          onClick={analyzeMarketData}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (!analysisData) return null;

  return (
    <div className="space-y-8">
      {/* Market Overview */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Quy mô thị trường</h3>
          <p className="mt-2 text-3xl font-bold text-indigo-600">
            {analysisData.marketSize}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Tốc độ tăng trưởng</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {analysisData.growthRate}
          </p>
        </div>
      </div>

      {/* Search Trends */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Xu hướng tìm kiếm</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analysisData.searchTrends}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#4F46E5" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Market Share */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Thị phần</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analysisData.marketShare}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {analysisData.marketShare.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {analysisData.marketShare.map((item, index) => (
              <div key={index} className="flex items-center">
                <div
                  className="w-4 h-4 rounded-full mr-2"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm">{item.name}: {item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Sản phẩm tiềm năng</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analysisData.topProducts.map((product, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="aspect-w-1 aspect-h-1 w-full">
                <div className="bg-gray-200 rounded-lg"></div>
              </div>
              <div className="mt-4">
                <h4 className="font-medium">{product.name}</h4>
                <p className="text-sm text-gray-600">{product.shop}</p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-indigo-600 font-medium">{product.price}</span>
                  <span className="text-sm text-gray-500">{product.sales}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Phân tích & Đề xuất</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium">Mức độ cạnh tranh</p>
              <p className="mt-1 text-indigo-600">{analysisData.competitionLevel}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium">Rào cản gia nhập</p>
              <p className="mt-1 text-indigo-600">{analysisData.entryBarrier}</p>
            </div>
          </div>
          <div className="mt-4">
            <h4 className="font-medium mb-2">Đề xuất</h4>
            <ul className="list-disc list-inside space-y-2">
              {analysisData.recommendations.map((rec, index) => (
                <li key={index} className="text-gray-700">{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Step 3: Business Plan
export const BusinessPlanStep = ({ formData, setFormData }) => {
  const [loading, setLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [localFormData, setLocalFormData] = useState({
    investment: formData.businessPlan?.investment || '',
    targetRevenue: formData.businessPlan?.targetRevenue || '',
    timeline: formData.businessPlan?.timeline || ''
  });

  const handleChange = (field, value) => {
    setLocalFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAnalyze = async () => {
    if (!localFormData.investment || !localFormData.targetRevenue || !localFormData.timeline) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setLoading(true);
    try {
      setFormData({
        ...formData,
        businessPlan: localFormData
      });

      await generateBusinessPlan(Number(localFormData.investment));
    } catch (error) {
      console.error('Failed to analyze:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateBusinessPlan = async (investment) => {
    await new Promise(resolve => setTimeout(resolve, 2000));

    const suggestions = {
      inventory: {
        initialStock: Math.floor(investment * 0.6 / 100000),
        estimatedCost: investment * 0.6,
        description: "Ước tính dựa trên giá trung bình thị trường và tỷ suất lợi nhuận kỳ vọng",
        details: {
          unitCost: Math.floor(investment * 0.6 / (Math.floor(investment * 0.6 / 100000))),
          shippingCost: investment * 0.05,
          storageCost: investment * 0.05
        }
      },
      pricing: {
        recommended: {
          min: 150000,
          max: 300000
        },
        margin: "40-60%",
        strategy: "Định giá cạnh tranh trong giai đoạn đầu để thu hút khách hàng",
        competitors: [
          { name: "Đối thủ A", price: 200000 },
          { name: "Đối thủ B", price: 250000 },
          { name: "Đối thủ C", price: 180000 }
        ]
      },
      forecast: {
        monthly: [
          { month: 'T1', revenue: investment * 0.4, profit: investment * 0.1, sales: Math.floor(investment * 0.4 / 200000) },
          { month: 'T2', revenue: investment * 0.6, profit: investment * 0.15, sales: Math.floor(investment * 0.6 / 200000) },
          { month: 'T3', revenue: investment * 0.8, profit: investment * 0.2, sales: Math.floor(investment * 0.8 / 200000) },
          { month: 'T4', revenue: investment * 1.0, profit: investment * 0.25, sales: Math.floor(investment * 1.0 / 200000) },
          { month: 'T5', revenue: investment * 1.2, profit: investment * 0.3, sales: Math.floor(investment * 1.2 / 200000) },
          { month: 'T6', revenue: investment * 1.5, profit: investment * 0.35, sales: Math.floor(investment * 1.5 / 200000) }
        ],
        breakeven: {
          time: "3-4 tháng",
          conditions: "Dựa trên tỷ suất lợi nhuận trung bình ngành và chi phí cố định",
          details: {
            units: Math.floor(investment / 100000),
            revenue: investment * 1.2
          }
        },
        assumptions: {
          marketGrowth: "15% hàng năm",
          marketShare: "2-3% trong 6 tháng đầu",
          customerRetention: "60%"
        }
      },
      expenses: {
        inventory: investment * 0.6,
        marketing: investment * 0.2,
        operations: investment * 0.1,
        reserve: investment * 0.1,
        breakdown: {
          monthlyCosts: {
            marketing: investment * 0.03,
            storage: investment * 0.01,
            packaging: investment * 0.02,
            platform: investment * 0.02
          }
        }
      },
      risks: [
        {
          type: "Cạnh tranh",
          level: "Cao",
          impact: "Có thể ảnh hưởng đến thị phần và giá bán",
          mitigation: "Tập trung vào chất lượng sản phẩm và dịch vụ khách hàng",
          priority: 1
        },
        {
          type: "Hàng tồn kho",
          level: "Trung bình",
          impact: "Ảnh hưởng đến vốn luân chuyển",
          mitigation: "Bắt đầu với số lượng nhỏ và theo dõi xu hướng bán hàng",
          priority: 2
        },
        {
          type: "Định giá",
          level: "Thấp",
          impact: "Có thể ảnh hưởng đến biên lợi nhuận",
          mitigation: "Linh hoạt điều chỉnh theo phản hồi thị trường",
          priority: 3
        }
      ],
      actionPlan: {
        immediate: [
          "Đặt hàng số lượng nhỏ để test thị trường",
          "Thiết lập kênh bán hàng trên Shopee",
          "Chuẩn bị chiến dịch marketing ra mắt"
        ],
        shortTerm: [
          "Tối ưu hóa listing sản phẩm",
          "Xây dựng cơ sở khách hàng ban đầu",
          "Thu thập feedback và điều chỉnh"
        ],
        longTerm: [
          "Mở rộng danh mục sản phẩm",
          "Tăng cường marketing",
          "Xây dựng thương hiệu"
        ]
      }
    };

    setAiSuggestions(suggestions);
    setFormData(prev => ({
      ...prev,
      businessPlan: {
        ...localFormData,
        aiSuggestions: suggestions
      }
    }));
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  };

  return (
    <div className="space-y-8">
      {/* Form nhập thông tin */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Kế hoạch đầu tư</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Vốn đầu tư</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">₫</span>
              </div>
              <input
                type="number"
                value={localFormData.investment}
                onChange={(e) => handleChange('investment', e.target.value)}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                placeholder="Nhập số vốn đầu tư"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Doanh thu mục tiêu (tháng)</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">₫</span>
              </div>
              <input
                type="number"
                value={localFormData.targetRevenue}
                onChange={(e) => handleChange('targetRevenue', e.target.value)}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                placeholder="Nhập doanh thu mục tiêu"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Thời gian dự kiến</label>
            <select
              value={localFormData.timeline}
              onChange={(e) => handleChange('timeline', e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">Chọn thời gian</option>
              <option value="3">3 tháng</option>
              <option value="6">6 tháng</option>
              <option value="12">12 tháng</option>
            </select>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Đang phân tích...' : 'Phân tích kế hoạch'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-6">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Đang phân tích kế hoạch kinh doanh...</p>
        </div>
      ) : aiSuggestions && (
        <>
          {/* Đề xuất hàng hóa ban đầu */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Đề xuất hàng hóa ban đầu</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-indigo-50 rounded-lg">
                <p className="text-sm text-gray-600">Số lượng đề xuất</p>
                <p className="text-2xl font-bold text-indigo-600">
                  {aiSuggestions.inventory.initialStock} sản phẩm
                </p>
              </div>
              <div className="p-4 bg-indigo-50 rounded-lg">
                <p className="text-sm text-gray-600">Chi phí ước tính</p>
                <p className="text-2xl font-bold text-indigo-600">
                  {formatCurrency(aiSuggestions.inventory.estimatedCost)}
                </p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Giá nhập trung bình:</span>
                <span className="font-medium">{formatCurrency(aiSuggestions.inventory.details.unitCost)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Chi phí vận chuyển:</span>
                <span className="font-medium">{formatCurrency(aiSuggestions.inventory.details.shippingCost)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Chi phí lưu kho:</span>
                <span className="font-medium">{formatCurrency(aiSuggestions.inventory.details.storageCost)}</span>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              {aiSuggestions.inventory.description}
            </p>
          </div>

          {/* Phân tích giá */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Chiến lược giá</h4>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Khoảng giá đề xuất</p>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(aiSuggestions.pricing.recommended.min)} - {formatCurrency(aiSuggestions.pricing.recommended.max)}
                </p>
                <p className="mt-2 text-sm text-gray-600">{aiSuggestions.pricing.strategy}</p>
              </div>
              <div>
                <h5 className="font-medium mb-2">Phân tích giá đối thủ</h5>
                <div className="space-y-2">
                  {aiSuggestions.pricing.competitors.map((competitor, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">{competitor.name}</span>
                      <span className="font-medium">{formatCurrency(competitor.price)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Dự báo doanh thu & lợi nhuận */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Dự báo doanh thu & lợi nhuận</h4>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={aiSuggestions.forecast.monthly}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Line type="monotone" dataKey="revenue" name="Doanh thu" stroke="#4F46E5" strokeWidth={2} />
                  <Line type="monotone" dataKey="profit" name="Lợi nhuận" stroke="#10B981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-4">
              {aiSuggestions.forecast.monthly.map((month, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium">{month.month}</p>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Doanh thu:</span>
                      <span className="font-medium text-indigo-600">{formatCurrency(month.revenue)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Lợi nhuận:</span>
                      <span className="font-medium text-green-600">{formatCurrency(month.profit)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Số đơn:</span>
                      <span className="font-medium">{month.sales}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Điểm hòa vốn và giả định */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h5 className="font-medium mb-2">Điểm hòa vốn</h5>
                <p className="text-sm text-gray-600">Thời gian: {aiSuggestions.forecast.breakeven.time}</p>
                <p className="text-sm text-gray-600 mt-1">{aiSuggestions.forecast.breakeven.conditions}</p>
                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Số lượng cần bán:</span>
                    <span className="font-medium">{aiSuggestions.forecast.breakeven.details.units} sản phẩm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Doanh thu cần đạt:</span>
                    <span className="font-medium">{formatCurrency(aiSuggestions.forecast.breakeven.details.revenue)}</span>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h5 className="font-medium mb-2">Giả định</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Tăng trưởng thị trường:</span>
                    <span className="font-medium">{aiSuggestions.forecast.assumptions.marketGrowth}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Thị phần dự kiến:</span>
                    <span className="font-medium">{aiSuggestions.forecast.assumptions.marketShare}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tỷ lệ giữ chân khách:</span>
                    <span className="font-medium">{aiSuggestions.forecast.assumptions.customerRetention}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chi phí và phân bổ vốn */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Phân bổ vốn đầu tư</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Object.entries(aiSuggestions.expenses).slice(0, -1).map(([key, value]) => (
                <div key={key} className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 capitalize">{
                    key === 'inventory' ? 'Hàng hóa' :
                    key === 'marketing' ? 'Marketing' :
                    key === 'operations' ? 'Vận hành' :
                    'Dự phòng'
                  }</p>
                  <p className="mt-1 text-lg font-medium text-indigo-600">
                    {formatCurrency(value)}
                  </p>
                </div>
              ))}
            </div>
            
            {/* Chi phí hàng tháng */}
            <div className="mt-6">
              <h5 className="font-medium mb-3">Chi phí hàng tháng</h5>
              <div className="space-y-2">
                {Object.entries(aiSuggestions.expenses.breakdown.monthlyCosts).map(([key, value]) => (
                  <div key={key} className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600 capitalize">{
                      key === 'marketing' ? 'Marketing' :
                      key === 'storage' ? 'Lưu kho' :
                      key === 'packaging' ? 'Đóng gói' :
                      'Phí nền tảng'
                    }</span>
                    <span className="font-medium">{formatCurrency(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Phân tích rủi ro */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Phân tích rủi ro</h4>
            <div className="space-y-4">
              {aiSuggestions.risks.map((risk, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-medium flex items-center">
                        <span className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full text-sm mr-2">
                          {risk.priority}
                        </span>
                        {risk.type}
                      </h5>
                      <p className="mt-1 text-sm text-gray-600">{risk.impact}</p>
                    </div>
                    <span className={`px-2 py-1 text-sm rounded-full ${
                      risk.level === 'Cao' ? 'bg-red-100 text-red-800' :
                      risk.level === 'Trung bình' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {risk.level}
                    </span>
                  </div>
                  <div className="mt-3 bg-gray-50 p-3 rounded text-sm">
                    <span className="font-medium">Giải pháp: </span>
                    {risk.mitigation}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Kế hoạch hành động */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Kế hoạch hành động</h4>
            <div className="space-y-6">
              <div>
                <h5 className="font-medium text-indigo-600 mb-3">Ngay lập tức</h5>
                <ul className="space-y-2">
                  {aiSuggestions.actionPlan.immediate.map((action, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-6 h-6 flex items-center justify-center bg-indigo-100 rounded-full text-sm text-indigo-600 mr-2">
                        {index + 1}
                      </span>
                      <span className="text-sm">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-green-600 mb-3">Ngắn hạn (1-3 tháng)</h5>
                <ul className="space-y-2">
                  {aiSuggestions.actionPlan.shortTerm.map((action, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-6 h-6 flex items-center justify-center bg-green-100 rounded-full text-sm text-green-600 mr-2">
                        {index + 1}
                      </span>
                      <span className="text-sm">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-purple-600 mb-3">Dài hạn (3-6 tháng)</h5>
                <ul className="space-y-2">
                  {aiSuggestions.actionPlan.longTerm.map((action, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-6 h-6 flex items-center justify-center bg-purple-100 rounded-full text-sm text-purple-600 mr-2">
                        {index + 1}
                      </span>
                      <span className="text-sm">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
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
    const [localFormData, setLocalFormData] = useState({
      targetCustomer: formData.branding?.targetCustomer || '',
      brandValues: formData.branding?.brandValues || '',
      stylePreference: formData.branding?.stylePreference || ''
    });
  
    const handleChange = (field, value) => {
      setLocalFormData(prev => ({
        ...prev,
        [field]: value
      }));
    };
  
    const generateBrandSuggestions = async () => {
      if (!localFormData.targetCustomer || !localFormData.brandValues || !localFormData.stylePreference) {
        alert('Vui lòng điền đầy đủ thông tin');
        return;
      }
  
      setLoading(true);
      try {
        // Giả lập API call đến AI service
        await new Promise(resolve => setTimeout(resolve, 2000));
  
        const suggestions = {
          names: [
            {
              name: "NatureLux",
              reasoning: "Kết hợp giữa tự nhiên và sang trọng, phù hợp với phân khúc cao cấp"
            },
            {
              name: "PureGlow",
              reasoning: "Gợi ý về sự thuần khiết và rạng rỡ, phù hợp với mỹ phẩm"
            },
            {
              name: "Lumière",
              reasoning: "Tên Pháp tạo cảm giác cao cấp, nghĩa là 'ánh sáng'"
            }
          ],
          slogans: [
            {
              text: "Tỏa sáng cùng thiên nhiên",
              context: "Kết nối yếu tố tự nhiên với vẻ đẹp"
            },
            {
              text: "Đánh thức vẻ đẹp tiềm ẩn",
              context: "Nhấn mạnh khả năng chuyển đổi và cải thiện"
            },
            {
              text: "Chạm đến vẻ đẹp thuần khiết",
              context: "Tập trung vào sự thuần khiết của sản phẩm"
            }
          ],
          brandIdentity: {
            colors: [
              {
                primary: "#4A90E2",
                secondary: "#F5A623",
                accent: "#7ED321",
                description: "Màu xanh tạo sự tin cậy, cam tạo năng lượng, xanh lá thể hiện tự nhiên"
              }
            ],
            typography: {
              heading: "Playfair Display",
              body: "Open Sans",
              reasoning: "Kết hợp font chữ cổ điển và hiện đại tạo sự cân bằng"
            },
            style: {
              moodboard: [
                "Tối giản",
                "Sang trọng",
                "Tự nhiên",
                "Hiện đại"
              ],
              visualElements: [
                "Hình ảnh lá cây",
                "Gradient nhẹ nhàng",
                "Đường nét mềm mại"
              ]
            }
          },
          storytelling: {
            brandStory: "Được truyền cảm hứng từ vẻ đẹp thuần khiết của thiên nhiên, [Thương hiệu] ra đời với sứ mệnh mang đến những sản phẩm chăm sóc da an toàn và hiệu quả. Chúng tôi tin rằng mỗi người đều xứng đáng tỏa sáng với vẻ đẹp tự nhiên của riêng mình.",
            values: [
              "Tự nhiên & An toàn",
              "Hiệu quả & Khoa học",
              "Bền vững & Trách nhiệm"
            ],
            personality: [
              "Đáng tin cậy",
              "Chuyên nghiệp",
              "Thân thiện",
              "Tinh tế"
            ]
          },
          tone: {
            voice: "Chuyên nghiệp nhưng gần gũi",
            language: "Rõ ràng, dễ hiểu, tích cực",
            examples: [
              "Chúng tôi hiểu làn da của bạn",
              "Khám phá vẻ đẹp tự nhiên",
              "An toàn là ưu tiên hàng đầu"
            ]
          }
        };
  
        setBrandSuggestions(suggestions);
        setFormData(prev => ({
          ...prev,
          branding: {
            ...localFormData,
            suggestions
          }
        }));
  
      } catch (error) {
        console.error('Failed to generate brand suggestions:', error);
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className="space-y-8">
        {/* Form Input */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Xây dựng thương hiệu</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Đối tượng khách hàng mục tiêu
              </label>
              <textarea
                value={localFormData.targetCustomer}
                onChange={(e) => handleChange('targetCustomer', e.target.value)}
                rows={3}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Mô tả chi tiết về khách hàng mục tiêu của bạn (độ tuổi, giới tính, thu nhập, sở thích...)"
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Giá trị thương hiệu
              </label>
              <textarea
                value={localFormData.brandValues}
                onChange={(e) => handleChange('brandValues', e.target.value)}
                rows={3}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Những giá trị cốt lõi mà thương hiệu của bạn muốn truyền tải"
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phong cách thương hiệu
              </label>
              <select
                value={localFormData.stylePreference}
                onChange={(e) => handleChange('stylePreference', e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">Chọn phong cách</option>
                <option value="minimal">Tối giản & Hiện đại</option>
                <option value="luxury">Sang trọng & Cao cấp</option>
                <option value="friendly">Thân thiện & Gần gũi</option>
                <option value="natural">Tự nhiên & Organic</option>
                <option value="professional">Chuyên nghiệp & Đáng tin cậy</option>
              </select>
            </div>
  
            <button
              onClick={generateBrandSuggestions}
              disabled={loading}
              className="w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang phân tích...' : 'Tạo gợi ý thương hiệu'}
            </button>
          </div>
        </div>
  
        {/* AI Generated Suggestions */}
        {loading ? (
          <div className="text-center py-6">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Đang tạo gợi ý thương hiệu...</p>
          </div>
        ) : brandSuggestions && (
          <>
            {/* Brand Names */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Tên thương hiệu đề xuất</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {brandSuggestions.names.map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:border-indigo-500 cursor-pointer">
                    <p className="text-xl font-medium text-indigo-600">{item.name}</p>
                    <p className="mt-2 text-sm text-gray-600">{item.reasoning}</p>
                  </div>
                ))}
              </div>
            </div>
  
            {/* Slogans */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Slogan đề xuất</h4>
              <div className="space-y-4">
                {brandSuggestions.slogans.map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:border-indigo-500 cursor-pointer">
                    <p className="text-lg font-medium">{item.text}</p>
                    <p className="mt-2 text-sm text-gray-600">{item.context}</p>
                  </div>
                ))}
              </div>
            </div>
  
            {/* Brand Identity */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Nhận diện thương hiệu</h4>
              
              {/* Color Palette */}
              <div className="mb-6">
                <h5 className="font-medium mb-3">Bảng màu</h5>
                <div className="flex space-x-4">
                  {brandSuggestions.brandIdentity.colors.map((color, index) => (
                    <div key={index} className="flex-1">
                      <div className="grid grid-cols-3 gap-2">
                        <div 
                          className="h-12 rounded"
                          style={{ backgroundColor: color.primary }}
                        />
                        <div 
                          className="h-12 rounded"
                          style={{ backgroundColor: color.secondary }}
                        />
                        <div 
                          className="h-12 rounded"
                          style={{ backgroundColor: color.accent }}
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-600">{color.description}</p>
                    </div>
                  ))}
                </div>
              </div>
  
              {/* Typography */}
              <div className="mb-6">
                <h5 className="font-medium mb-3">Typography</h5>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xl" style={{ fontFamily: brandSuggestions.brandIdentity.typography.heading }}>
                    Heading Font: {brandSuggestions.brandIdentity.typography.heading}
                  </p>
                  <p className="mt-2" style={{ fontFamily: brandSuggestions.brandIdentity.typography.body }}>
                    Body Font: {brandSuggestions.brandIdentity.typography.body}
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    {brandSuggestions.brandIdentity.typography.reasoning}
                  </p>
                </div>
              </div>
  
              {/* Visual Style */}
              <div>
                <h5 className="font-medium mb-3">Phong cách thiết kế</h5>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h6 className="font-medium mb-2">Mood Board</h6>
                    <div className="flex flex-wrap gap-2">
                      {brandSuggestions.brandIdentity.style.moodboard.map((item, index) => (
                        <span key={index} className="px-2 py-1 bg-white rounded text-sm">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h6 className="font-medium mb-2">Yếu tố thị giác</h6>
                    <div className="flex flex-wrap gap-2">
                      {brandSuggestions.brandIdentity.style.visualElements.map((item, index) => (
                        <span key={index} className="px-2 py-1 bg-white rounded text-sm">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
            {/* Brand Story & Values */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Câu chuyện thương hiệu</h4>
              
              <div className="prose max-w-none">
                <p className="text-gray-600">{brandSuggestions.storytelling.brandStory}</p>
              </div>
  
              <div className="mt-6 grid grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium mb-3">Giá trị cốt lõi</h5>
                  <div className="space-y-2">
                    {brandSuggestions.storytelling.values.map((value, index) => (
                      <div key={index} className="flex items-center">
                        <span className="w-6 h-6 flex items-center justify-center bg-indigo-100 rounded-full text-sm text-indigo-600 mr-2">
                          {index + 1}
                        </span>
                        <span>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="font-medium mb-3">Tính cách thương hiệu</h5>
                <div className="flex flex-wrap gap-2">
                  {brandSuggestions.storytelling.personality.map((trait, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tone of Voice */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Giọng điệu thương hiệu</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h5 className="font-medium mb-2">Phong cách giao tiếp</h5>
                  <p className="text-gray-600">{brandSuggestions.tone.voice}</p>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Ngôn ngữ</h5>
                  <p className="text-gray-600">{brandSuggestions.tone.language}</p>
                </div>
              </div>

              <div>
                <h5 className="font-medium mb-2">Ví dụ cách diễn đạt</h5>
                <div className="space-y-2">
                  {brandSuggestions.tone.examples.map((example, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600"
                    >
                      "{example}"
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Generate Again Button */}
            <div className="mt-6">
              <button
                onClick={generateBrandSuggestions}
                className="w-full px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Tạo gợi ý khác
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
  
// Step 5: Product Setup
export const ProductSetupStep = ({ formData, setFormData }) => {
  // State cho danh sách sản phẩm
  const [products, setProducts] = useState(formData.products || []);
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [optimizingProduct, setOptimizingProduct] = useState(null);
  const [optimizationResults, setOptimizationResults] = useState({});

  // Helper function để format tiền VND
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Thêm sản phẩm mới
  const handleAddProduct = () => {
    const newProduct = {
      id: Date.now(),
      name: '',
      description: '',
      price: '',
      features: [],
      variations: [],
      optimized: false
    };
    setProducts(prev => [...prev, newProduct]);
    setExpandedProduct(newProduct.id);
    
    // Cập nhật form data
    setFormData({
      ...formData,
      products: [...products, newProduct]
    });
  };

  // Xóa sản phẩm
  const handleDeleteProduct = (productId) => {
    const newProducts = products.filter(p => p.id !== productId);
    setProducts(newProducts);
    if (expandedProduct === productId) {
      setExpandedProduct(null);
    }
    
    setFormData({
      ...formData,
      products: newProducts
    });
  };

  // Cập nhật thông tin sản phẩm
  const handleUpdateProduct = (productId, field, value) => {
    const newProducts = products.map(p => 
      p.id === productId ? { ...p, [field]: value } : p
    );
    setProducts(newProducts);
    
    setFormData({
      ...formData,
      products: newProducts
    });
  };

  // Thêm đặc điểm sản phẩm
  const handleAddFeature = (productId) => {
    const newProducts = products.map(p => 
      p.id === productId 
        ? { ...p, features: [...p.features, ''] }
        : p
    );
    setProducts(newProducts);
    
    setFormData({
      ...formData,
      products: newProducts
    });
  };

  // Cập nhật đặc điểm
  const handleUpdateFeature = (productId, index, value) => {
    const newProducts = products.map(p => {
      if (p.id === productId) {
        const newFeatures = [...p.features];
        newFeatures[index] = value;
        return { ...p, features: newFeatures };
      }
      return p;
    });
    setProducts(newProducts);
    
    setFormData({
      ...formData,
      products: newProducts
    });
  };

  // Xóa đặc điểm
  const handleDeleteFeature = (productId, index) => {
    const newProducts = products.map(p => {
      if (p.id === productId) {
        const newFeatures = p.features.filter((_, i) => i !== index);
        return { ...p, features: newFeatures };
      }
      return p;
    });
    setProducts(newProducts);
    
    setFormData({
      ...formData,
      products: newProducts
    });
  };

  // Thêm phân loại
  const handleAddVariation = (productId) => {
    const newProducts = products.map(p => 
      p.id === productId 
        ? { ...p, variations: [...p.variations, { name: '', options: [] }] }
        : p
    );
    setProducts(newProducts);
    
    setFormData({
      ...formData,
      products: newProducts
    });
  };

  // Cập nhật phân loại
  const handleUpdateVariation = (productId, index, field, value) => {
    const newProducts = products.map(p => {
      if (p.id === productId) {
        const newVariations = [...p.variations];
        newVariations[index] = { ...newVariations[index], [field]: value };
        return { ...p, variations: newVariations };
      }
      return p;
    });
    setProducts(newProducts);
    
    setFormData({
      ...formData,
      products: newProducts
    });
  };

  // Xóa phân loại
  const handleDeleteVariation = (productId, index) => {
    const newProducts = products.map(p => {
      if (p.id === productId) {
        const newVariations = p.variations.filter((_, i) => i !== index);
        return { ...p, variations: newVariations };
      }
      return p;
    });
    setProducts(newProducts);
    
    setFormData({
      ...formData,
      products: newProducts
    });
  };

  // Tối ưu sản phẩm
  const handleOptimizeProduct = async (productId) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    setOptimizingProduct(productId);
    try {
      // Giả lập API call để tối ưu sản phẩm
      await new Promise(resolve => setTimeout(resolve, 2000));

      const optimizedData = {
        name: {
          optimized: `${product.name} - Chính Hãng Cao Cấp`,
          seoTitle: `${product.name} | Chính Hãng | Giá Tốt Nhất`,
          variations: [
            `${product.name} - Bán Chạy Số 1`,
            `${product.name} - Freeship Extra`,
            `${product.name} - Ưu Đãi Shock`
          ]
        },
        description: {
          summary: `${product.description.slice(0, 150)}...`,
          full: `
🔥 THÔNG TIN SẢN PHẨM
${product.name}

✨ ĐẶC ĐIỂM NỔI BẬT
${product.features.map(f => `• ${f}`).join('\n')}

🎁 QUYỀN LỢI KHÁCH HÀNG
• Sản phẩm chính hãng 100%
• Hoàn tiền 100% nếu phát hiện hàng giả
• Đổi trả miễn phí trong 7 ngày
• Freeship toàn quốc cho đơn từ 500k

📞 HOTLINE HỖ TRỢ: 0123.456.789
          `
        },
        seo: {
          keywords: [
            `${product.name} chính hãng`,
            `mua ${product.name}`,
            `${product.name} giá rẻ`,
            'freeship',
            'shop uy tín'
          ],
          tags: [
            'Chính hãng',
            'Freeship',
            'Hoàn tiền 100%',
            'Đổi trả 7 ngày'
          ]
        }
      };

      // Cập nhật kết quả tối ưu
      setOptimizationResults(prev => ({
        ...prev,
        [productId]: optimizedData
      }));

      // Cập nhật sản phẩm đã được tối ưu
      const newProducts = products.map(p => 
        p.id === productId ? { ...p, optimized: true } : p
      );
      setProducts(newProducts);
      
      setFormData({
        ...formData,
        products: newProducts
      });

    } catch (error) {
      console.error('Failed to optimize product:', error);
    } finally {
      setOptimizingProduct(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Products List */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            Thiết lập sản phẩm ({products.length})
          </h3>
          <button
            onClick={handleAddProduct}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Thêm sản phẩm
          </button>
        </div>

        {/* Product List */}
        <div className="space-y-4">
          {products.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500">
                Chưa có sản phẩm nào. Bấm "Thêm sản phẩm" để bắt đầu.
              </p>
            </div>
          ) : (
            products.map(product => (
              <div key={product.id} className="border rounded-lg hover:border-gray-300">
                {/* Product Header */}
                <div className="p-4 flex justify-between items-center">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={product.name}
                      onChange={(e) => handleUpdateProduct(product.id, 'name', e.target.value)}
                      className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
                      placeholder="Tên sản phẩm"
                    />
                    {product.price && (
                      <p className="mt-1 text-sm text-gray-500">
                        {formatCurrency(product.price)}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setExpandedProduct(
                        expandedProduct === product.id ? null : product.id
                      )}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      {expandedProduct === product.id ? (
                        <ChevronUpIcon className="h-5 w-5" />
                      ) : (
                        <ChevronDownIcon className="h-5 w-5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Product Details */}
                {expandedProduct === product.id && (
                  <div className="border-t p-4 space-y-4">
                    {/* Basic Info */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Giá bán
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500">₫</span>
                          </div>
                          <input
                            type="number"
                            value={product.price}
                            onChange={(e) => handleUpdateProduct(product.id, 'price', e.target.value)}
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                            placeholder="0"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Mô tả sản phẩm
                        </label>
                        <textarea
                          value={product.description}
                          onChange={(e) => handleUpdateProduct(product.id, 'description', e.target.value)}
                          rows={4}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="Mô tả chi tiết về sản phẩm của bạn"
                        />
                      </div>
                    </div>

                    {/* Features */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Đặc điểm sản phẩm
                        </label>
                        <button
                          onClick={() => handleAddFeature(product.id)}
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                        >
                          Thêm đặc điểm
                        </button>
                      </div>
                      <div className="space-y-2">
                        {product.features.map((feature, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              value={feature}
                              onChange={(e) => handleUpdateFeature(product.id, index, e.target.value)}
                              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              placeholder="Nhập đặc điểm sản phẩm"
                            />
                            <button
                              onClick={() => handleDeleteFeature(product.id, index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Variations */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Phân loại sản phẩm
                        </label>
                        <button
                          onClick={() => handleAddVariation(product.id)}
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                        >
                          Thêm phân loại
                        </button>
                      </div>
                      <div className="space-y-4">
                        {product.variations.map((variation, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                              <input
                                type="text"
                                value={variation.name}
                                onChange={(e) => handleUpdateVariation(product.id, index, 'name', e.target.value)}
                                className="block w-2/3 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Tên phân loại (VD: Màu sắc, Size)"
                              />
                              <button
                                onClick={() => handleDeleteVariation(product.id, index)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            </div>
                            <div className="mt-2">
                              <input
                                type="text"
                                value={variation.options.join(', ')}
                                onChange={(e) => handleUpdateVariation(
                                  product.id,
                                  index,
                                  'options',
                                  e.target.value.split(',').map(o => o.trim())
                                )}
                                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Các tùy chọn, phân cách bằng dấu phẩy (VD: Đỏ, Xanh, Vàng)"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Optimize Button */}
                    <div className="pt-4">
                      <button
                        onClick={() => handleOptimizeProduct(product.id)}
                        disabled={optimizingProduct === product.id}
                        className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                      >
                        {optimizingProduct === product.id ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Đang tối ưu...
                          </>
                        ) : 'Tối ưu nội dung sản phẩm'}
                      </button>
                    </div>

                    {/* Optimization Results */}
                    {optimizationResults[product.id] && (
                      <div className="mt-6 space-y-6">
                        {/* Tên sản phẩm tối ưu */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="text-base font-medium text-gray-900 mb-4">Tên sản phẩm tối ưu</h4>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Tên chính</label>
                              <div className="mt-1 p-3 bg-white rounded-md">
                                {optimizationResults[product.id].name.optimized}
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Tiêu đề SEO</label>
                              <div className="mt-1 p-3 bg-white rounded-md">
                                {optimizationResults[product.id].name.seoTitle}
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Các biến thể tên</label>
                              <div className="mt-1 space-y-2">
                                {optimizationResults[product.id].name.variations.map((name, idx) => (
                                  <div key={idx} className="p-3 bg-white rounded-md">
                                    {name}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Mô tả tối ưu */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="text-base font-medium text-gray-900 mb-4">Mô tả sản phẩm tối ưu</h4>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Mô tả ngắn</label>
                              <div className="mt-1 p-3 bg-white rounded-md">
                                {optimizationResults[product.id].description.summary}
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Mô tả đầy đủ</label>
                              <div className="mt-1 p-3 bg-white rounded-md whitespace-pre-wrap">
                                {optimizationResults[product.id].description.full}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Từ khóa SEO */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="text-base font-medium text-gray-900 mb-4">Từ khóa SEO</h4>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Từ khóa chính</label>
                              <div className="mt-1 flex flex-wrap gap-2">
                                {optimizationResults[product.id].seo.keywords.map((keyword, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                                    {keyword}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Tags</label>
                              <div className="mt-1 flex flex-wrap gap-2">
                                {optimizationResults[product.id].seo.tags.map((tag, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// Step 6: Marketing Strategy
export const MarketingStep = ({ formData, setFormData }) => {
  const [loading, setLoading] = useState(false);
  const [marketingPlan, setMarketingPlan] = useState(null);
  const [localFormData, setLocalFormData] = useState({
    budget: formData.marketing?.budget || '',
    selectedChannels: formData.marketing?.selectedChannels || [],
    targetAudience: formData.marketing?.targetAudience || '',
    objectives: formData.marketing?.objectives || []
  });

  const marketingChannels = [
    {
      id: 'shopee_ads',
      name: 'Shopee Ads',
      description: 'Quảng cáo trên nền tảng Shopee'
    },
    {
      id: 'social_media',
      name: 'Social Media',
      description: 'Facebook, Instagram, TikTok'
    },
    {
      id: 'influencer',
      name: 'Influencer Marketing',
      description: 'Hợp tác với KOLs và influencers'
    },
    {
      id: 'email',
      name: 'Email Marketing',
      description: 'Gửi email cho khách hàng'
    },
    {
      id: 'promotion',
      name: 'Khuyến mãi',
      description: 'Vouchers, Flash sale, Combo deals'
    }
  ];

  const handleChange = (field, value) => {
    setLocalFormData(prev => ({
      ...prev,
      [field]: value
    }));

    setFormData(prev => ({
      ...prev,
      marketing: {
        ...prev.marketing,
        [field]: value
      }
    }));
  };

  const generateMarketingPlan = async () => {
    if (!localFormData.budget || !localFormData.selectedChannels.length) {
      alert('Vui lòng điền ngân sách và chọn ít nhất một kênh marketing');
      return;
    }

    setLoading(true);
    try {
      // Giả lập API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const plan = {
        overview: {
          totalBudget: parseInt(localFormData.budget),
          duration: '30 ngày',
          estimatedReach: '10,000 - 15,000 người',
          expectedROI: '150-200%'
        },
        budgetAllocation: {
          shopee_ads: Math.round(localFormData.budget * 0.4),
          social_media: Math.round(localFormData.budget * 0.3),
          influencer: Math.round(localFormData.budget * 0.2),
          others: Math.round(localFormData.budget * 0.1)
        },
        calendar: [
          {
            day: 1,
            activity: 'Khởi động chiến dịch Shopee Ads',
            budget: Math.round(localFormData.budget * 0.1)
          },
          {
            day: 5,
            activity: 'Đăng bài social media đầu tiên',
            budget: Math.round(localFormData.budget * 0.05)
          },
          {
            day: 10,
            activity: 'Phát hành voucher giảm giá 10%',
            budget: Math.round(localFormData.budget * 0.15)
          },
          // ...thêm các hoạt động khác
        ],
        recommendations: {
          shopeeAds: [
            'Tối ưu từ khóa quảng cáo theo xu hướng tìm kiếm',
            'Tập trung vào các khung giờ cao điểm',
            'Sử dụng A/B testing để tối ưu hiệu quả'
          ],
          socialMedia: [
            'Tạo nội dung video ngắn cho TikTok',
            'Đăng bài thường xuyên trên Facebook và Instagram',
            'Tương tác với comments của khách hàng'
          ],
          promotions: [
            'Flash sale vào cuối tuần',
            'Bundle deals cho đơn hàng lớn',
            'Chương trình giới thiệu khách hàng mới'
          ]
        },
        kpis: [
          {
            metric: 'Doanh số bán hàng',
            target: `${formatCurrency(localFormData.budget * 3)}`,
            timeframe: '30 ngày'
          },
          {
            metric: 'Số lượng đơn hàng',
            target: '100-150 đơn',
            timeframe: '30 ngày'
          },
          {
            metric: 'Tỷ lệ chuyển đổi',
            target: '3-5%',
            timeframe: 'Trung bình'
          },
          {
            metric: 'Đánh giá shop',
            target: '4.8/5 sao',
            timeframe: 'Trung bình'
          }
        ]
      };

      setMarketingPlan(plan);

      // Cập nhật form data
      setFormData(prev => ({
        ...prev,
        marketing: {
          ...localFormData,
          plan: plan
        }
      }));

    } catch (error) {
      console.error('Failed to generate marketing plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      {/* Marketing Form */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Lập kế hoạch marketing</h3>
        <div className="space-y-6">
          {/* Budget Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ngân sách marketing (30 ngày)
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">₫</span>
              </div>
              <input
                type="number"
                value={localFormData.budget}
                onChange={(e) => handleChange('budget', e.target.value)}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                placeholder="Nhập ngân sách của bạn"
              />
            </div>
          </div>

          {/* Marketing Channels */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Kênh marketing
            </label>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {marketingChannels.map((channel) => (
                <label
                  key={channel.id}
                  className={`
                    relative flex p-4 border rounded-lg cursor-pointer hover:border-indigo-500
                    ${localFormData.selectedChannels.includes(channel.id) 
                      ? 'border-indigo-500 ring-2 ring-indigo-500' 
                      : 'border-gray-300'}
                  `}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={localFormData.selectedChannels.includes(channel.id)}
                    onChange={(e) => {
                      const newChannels = e.target.checked
                        ? [...localFormData.selectedChannels, channel.id]
                        : localFormData.selectedChannels.filter(id => id !== channel.id);
                      handleChange('selectedChannels', newChannels);
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900">{channel.name}</h4>
                    <p className="mt-1 text-sm text-gray-500">{channel.description}</p>
                  </div>
                  <div className={`
                    ml-3 flex-shrink-0 w-5 h-5 border-2 rounded-full flex items-center justify-center
                    ${localFormData.selectedChannels.includes(channel.id)
                      ? 'border-indigo-500 bg-indigo-500'
                      : 'border-gray-300 bg-white'}
                  `}>
                    {localFormData.selectedChannels.includes(channel.id) && (
                      <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                        <path d="M3.5 6L5 7.5L8.5 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Target Audience */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Đối tượng mục tiêu
            </label>
            <textarea
              value={localFormData.targetAudience}
              onChange={(e) => handleChange('targetAudience', e.target.value)}
              rows={3}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Mô tả đối tượng khách hàng mục tiêu của bạn"
            />
          </div>

          <button
            onClick={generateMarketingPlan}
            disabled={loading}
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang tạo kế hoạch...
              </>
            ) : 'Tạo kế hoạch marketing'}
          </button>
        </div>
      </div>

      {/* Marketing Plan Results */}
      {marketingPlan && (
        <>
          {/* Overview */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Tổng quan kế hoạch</h4>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <dt className="text-sm font-medium text-gray-500">Ngân sách</dt>
                <dd className="mt-1 text-lg font-medium text-gray-900">
                  {formatCurrency(marketingPlan.overview.totalBudget)}
                </dd>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <dt className="text-sm font-medium text-gray-500">Thời gian</dt>
                <dd className="mt-1 text-lg font-medium text-gray-900">
                  {marketingPlan.overview.duration}
                </dd>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <dt className="text-sm font-medium text-gray-500">Tiếp cận</dt>
                <dd className="mt-1 text-lg font-medium text-gray-900">
                  {marketingPlan.overview.estimatedReach}
                </dd>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <dt className="text-sm font-medium text-gray-500">ROI dự kiến</dt>
                <dd className="mt-1 text-lg font-medium text-gray-900">
                  {marketingPlan.overview.expectedROI}
                </dd>
              </div>
            </div>
          </div>

          {/* Budget Allocation */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Phân bổ ngân sách</h4>
            <div className="space-y-4">
              {Object.entries(marketingPlan.budgetAllocation).map(([channel, amount]) => (
                <div key={channel} className="flex items-center">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900">
                        {channel.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        {Math.round((amount / marketingPlan.overview.totalBudget) * 100)}%
                      </span>
                    </div>
                    <div className="mt-1 relative pt-1">
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                        <div
                          style={{ width: `${(amount / marketingPlan.overview.totalBudget) * 100}%` }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 text-sm font-medium text-gray-900">
                    {formatCurrency(amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Marketing Calendar */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Lịch triển khai</h4>
            <div className="overflow-hidden">
              <div className="flow-root">
                <ul className="-mb-8">
                  {marketingPlan.calendar.map((event, index) => (
                    <li key={event.day}>
                      <div className="relative pb-8">
                        {index < marketingPlan.calendar.length - 1 && (
                          <span
                            className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                            aria-hidden="true"
                          />
                        )}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                              {event.day}
                            </span>
                          </div>
                          <div className="flex justify-between flex-1 min-w-0 pt-1.5">
                            <div>
                              <p className="text-sm text-gray-900">{event.activity}</p>
                            </div>
                            <div className="text-right text-sm whitespace-nowrap text-gray-600">
                              {formatCurrency(event.budget)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Đề xuất chiến lược</h4>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-3">
                <h5 className="font-medium text-indigo-600">Shopee Ads</h5>
                <ul className="space-y-2">
                  {marketingPlan.recommendations.shopeeAds.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex-shrink-0 h-5 w-5 text-indigo-500">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="ml-2 text-sm text-gray-600">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <h5 className="font-medium text-green-600">Social Media</h5>
                <ul className="space-y-2">
                  {marketingPlan.recommendations.socialMedia.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex-shrink-0 h-5 w-5 text-green-500">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="ml-2 text-sm text-gray-600">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <h5 className="font-medium text-purple-600">Khuyến mãi</h5>
                <ul className="space-y-2">
                  {marketingPlan.recommendations.promotions.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex-shrink-0 h-5 w-5 text-purple-500">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="ml-2 text-sm text-gray-600">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* KPIs */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Chỉ tiêu KPIs</h4>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {marketingPlan.kpis.map((kpi, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <dt className="text-sm font-medium text-gray-500">{kpi.metric}</dt>
                  <dd className="mt-1 text-lg font-medium text-gray-900">{kpi.target}</dd>
                  <dd className="mt-1 text-sm text-gray-500">{kpi.timeframe}</dd>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Step 7: Shop Setup
export const ShopSetupStep = ({ formData, setFormData }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const setupSteps = [
    {
      title: "Thiết lập thông tin cửa hàng",
      fields: {
        shopName: formData.shopSetup?.shopName || "",
        shopDescription: formData.shopSetup?.shopDescription || "",
        logo: formData.shopSetup?.logo || null
      },
      description: "Thông tin cơ bản về cửa hàng của bạn"
    },
    {
      title: "Chính sách cửa hàng",
      fields: {
        returnPolicy: formData.shopSetup?.returnPolicy || "",
        shippingPolicy: formData.shopSetup?.shippingPolicy || "",
        warrantyPolicy: formData.shopSetup?.warrantyPolicy || ""
      },
      description: "Thiết lập các chính sách cho cửa hàng"
    },
    {
      title: "Vận chuyển & Thanh toán",
      fields: {
        shippingMethods: formData.shopSetup?.shippingMethods || [],
        paymentMethods: formData.shopSetup?.paymentMethods || []
      },
      description: "Cấu hình phương thức vận chuyển và thanh toán"
    },
    {
      title: "Xác thực & Bảo mật",
      fields: {
        businessType: formData.shopSetup?.businessType || "",
        identityNumber: formData.shopSetup?.identityNumber || "",
        businessLicense: formData.shopSetup?.businessLicense || null
      },
      description: "Xác thực danh tính và giấy phép kinh doanh"
    }
  ];

  const handleFieldChange = (stepIndex, field, value) => {
    const updatedSteps = [...setupSteps];
    updatedSteps[stepIndex].fields[field] = value;

    setFormData(prev => ({
      ...prev,
      shopSetup: {
        ...prev.shopSetup,
        [field]: value
      }
    }));
  };

  const validateStep = (stepIndex) => {
    const step = setupSteps[stepIndex];
    const fields = Object.entries(step.fields);
    
    for (const [field, value] of fields) {
      if (!value && field !== 'logo' && field !== 'businessLicense') {
        return false;
      }
    }
    return true;
  };

  return (
    <div className="space-y-8">
      {/* Progress Steps */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Thiết lập cửa hàng
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {setupSteps[currentStep].description}
            </p>
          </div>
          <span className="text-sm text-gray-500">
            Bước {currentStep + 1} / {setupSteps.length}
          </span>
        </div>

        <div className="relative">
          {/* Progress Bar */}
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
            <div
              style={{ width: `${((currentStep + 1) / setupSteps.length) * 100}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
            ></div>
          </div>

          {/* Step Content */}
          <div className="mt-8">
            {currentStep === 0 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tên cửa hàng
                  </label>
                  <input
                    type="text"
                    value={setupSteps[0].fields.shopName}
                    onChange={(e) => handleFieldChange(0, 'shopName', e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Nhập tên cửa hàng của bạn"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Mô tả cửa hàng
                  </label>
                  <textarea
                    value={setupSteps[0].fields.shopDescription}
                    onChange={(e) => handleFieldChange(0, 'shopDescription', e.target.value)}
                    rows={4}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Mô tả về cửa hàng của bạn"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Logo cửa hàng
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                        >
                          <span>Tải ảnh lên</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                        </label>
                        <p className="pl-1">hoặc kéo thả file vào đây</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG tối đa 2MB</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Chính sách đổi trả
                  </label>
                  <textarea
                    value={setupSteps[1].fields.returnPolicy}
                    onChange={(e) => handleFieldChange(1, 'returnPolicy', e.target.value)}
                    rows={4}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Mô tả chính sách đổi trả của cửa hàng"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Chính sách vận chuyển
                  </label>
                  <textarea
                    value={setupSteps[1].fields.shippingPolicy}
                    onChange={(e) => handleFieldChange(1, 'shippingPolicy', e.target.value)}
                    rows={4}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Mô tả chính sách vận chuyển của cửa hàng"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Chính sách bảo hành
                  </label>
                  <textarea
                    value={setupSteps[1].fields.warrantyPolicy}
                    onChange={(e) => handleFieldChange(1, 'warrantyPolicy', e.target.value)}
                    rows={4}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Mô tả chính sách bảo hành của cửa hàng"
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phương thức vận chuyển
                  </label>
                  <div className="mt-4 space-y-4">
                    {[
                      { id: 'standard', name: 'Tiêu chuẩn', desc: '3-5 ngày' },
                      { id: 'express', name: 'Nhanh', desc: '1-2 ngày' },
                      { id: 'sameday', name: 'Trong ngày', desc: '24 giờ' }
                    ].map((method) => (
                      <div key={method.id} className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id={method.id}
                            type="checkbox"
                            checked={setupSteps[2].fields.shippingMethods.includes(method.id)}
                            onChange={(e) => {
                              const newMethods = e.target.checked
                                ? [...setupSteps[2].fields.shippingMethods, method.id]
                                : setupSteps[2].fields.shippingMethods.filter(id => id !== method.id);
                              handleFieldChange(2, 'shippingMethods', newMethods);
                            }}
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3">
                          <label htmlFor={method.id} className="font-medium text-gray-700">
                            {method.name}
                          </label>
                          <p className="text-gray-500">{method.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phương thức thanh toán
                  </label>
                  <div className="mt-4 space-y-4">
                    {[
                      { id: 'cod', name: 'Thanh toán khi nhận hàng', desc: 'COD' },
                      { id: 'bank', name: 'Chuyển khoản ngân hàng', desc: 'Internet Banking' },
                      { id: 'wallet', name: 'Ví Shopee', desc: 'ShopeePay' }
                    ].map((method) => (
                      <div key={method.id} className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id={method.id}
                            type="checkbox"
                            checked={setupSteps[2].fields.paymentMethods.includes(method.id)}
                            onChange={(e) => {
                              const newMethods = e.target.checked
                                ? [...setupSteps[2].fields.paymentMethods, method.id]
                                : setupSteps[2].fields.paymentMethods.filter(id => id !== method.id);
                              handleFieldChange(2, 'paymentMethods', newMethods);
                            }}
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3">
                          <label htmlFor={method.id} className="font-medium text-gray-700">
                            {method.name}
                          </label>
                          <p className="text-gray-500">{method.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Loại hình kinh doanh
                  </label>
                  <select
                    value={setupSteps[3].fields.businessType}
                    onChange={(e) => handleFieldChange(3, 'businessType', e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="">Chọn loại hình kinh doanh</option>
                    <option value="personal">Cá nhân</option>
                    <option value="company">Doanh nghiệp</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Số CMND/CCCD hoặc Mã số thuế
                  </label>
                  <input
                    type="text"
                    value={setupSteps[3].fields.identityNumber}
                    onChange={(e) => handleFieldChange(3, 'identityNumber', e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Giấy phép kinh doanh
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="business-license"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                        >
                          <span>Tải file lên</span>
                          <input id="business-license" name="business-license" type="file" className="sr-only" />
                        </label>
                        <p className="pl-1">hoặc kéo thả file vào đây</p>
                      </div>
                      <p className="text-xs text-gray-500">PDF, JPG tối đa 5MB</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(prev => prev - 1)}
              disabled={currentStep === 0}
              className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                currentStep === 0
                  ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Quay lại
            </button>

            <button
              type="button"
              onClick={() => {
                if (currentStep < setupSteps.length - 1) {
                  setCurrentStep(prev => prev + 1);
                } else {
                  // Submit form
                  console.log('Submit form', formData);
                }
              }}
              disabled={!validateStep(currentStep)}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
                validateStep(currentStep)
                  ? 'bg-indigo-600 hover:bg-indigo-700'
                  : 'bg-indigo-400 cursor-not-allowed'
              }`}
            >
              {currentStep === setupSteps.length - 1 ? 'Hoàn thành' : 'Tiếp theo'}
            </button>
          </div>

          {/* Instructions */}
          <div className="mt-8 bg-gray-50 p-4 rounded-md">
            <h4 className="text-base font-medium text-gray-900 mb-2">Tips:</h4>
            {currentStep === 0 && (
              <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                <li>Chọn tên cửa hàng dễ nhớ và phù hợp với thương hiệu</li>
                <li>Mô tả cửa hàng nên nêu bật điểm mạnh và giá trị cốt lõi</li>
                <li>Logo nên có kích thước tối thiểu 500x500 pixels</li>
              </ul>
            )}
            {currentStep === 1 && (
              <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                <li>Chính sách đổi trả rõ ràng giúp tăng niềm tin khách hàng</li>
                <li>Chính sách vận chuyển nên bao gồm thời gian và phí ship</li>
                <li>Chính sách bảo hành càng chi tiết càng tốt</li>
              </ul>
            )}
            {currentStep === 2 && (
              <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                <li>Đa dạng phương thức vận chuyển giúp tăng tỷ lệ chuyển đổi</li>
                <li>Nên hỗ trợ thanh toán khi nhận hàng (COD)</li>
                <li>Tích hợp ShopeePay để tận dụng các chương trình khuyến mãi</li>
              </ul>
            )}
            {currentStep === 3 && (
              <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                <li>Đảm bảo thông tin CMND/MST chính xác</li>
                <li>Tải lên bản scan/ảnh chụp giấy tờ rõ nét</li>
                <li>Hoàn thiện hồ sơ giúp tăng uy tín của shop</li>
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Xem trước cửa hàng</h3>
        <div className="border rounded-lg p-4">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 bg-gray-200 rounded-lg"></div>
            <div>
              <h4 className="font-medium text-gray-900">
                {formData.shopSetup?.shopName || 'Tên cửa hàng'}
              </h4>
              <p className="text-sm text-gray-500">
                {formData.shopSetup?.shopDescription || 'Mô tả cửa hàng'}
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Phương thức vận chuyển:</span>
              <ul className="mt-1 space-y-1">
                {formData.shopSetup?.shippingMethods?.map(method => (
                  <li key={method} className="text-gray-900">
                    {method === 'standard' && 'Tiêu chuẩn'}
                    {method === 'express' && 'Nhanh'}
                    {method === 'sameday' && 'Trong ngày'}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className="text-gray-500">Thanh toán:</span>
              <ul className="mt-1 space-y-1">
                {formData.shopSetup?.paymentMethods?.map(method => (
                  <li key={method} className="text-gray-900">
                    {method === 'cod' && 'Thanh toán khi nhận hàng'}
                    {method === 'bank' && 'Chuyển khoản'}
                    {method === 'wallet' && 'Ví Shopee'}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className="text-gray-500">Loại hình:</span>
              <p className="mt-1 text-gray-900">
                {formData.shopSetup?.businessType === 'personal' ? 'Cá nhân' : 'Doanh nghiệp'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};