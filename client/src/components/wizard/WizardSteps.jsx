import { useState, useEffect } from 'react';
import { LineChart, Line, PieChart, Pie, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts';
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
  const [loading, setLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [localFormData, setLocalFormData] = useState({
    name: formData.product?.name || '',
    description: formData.product?.description || '',
    features: formData.product?.features || [],
    price: formData.product?.price || '',
    variations: formData.product?.variations || []
  });

  const [showPreview, setShowPreview] = useState(false);

  const handleChange = (field, value) => {
    setLocalFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addFeature = () => {
    setLocalFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const updateFeature = (index, value) => {
    const newFeatures = [...localFormData.features];
    newFeatures[index] = value;
    handleChange('features', newFeatures);
  };

  const removeFeature = (index) => {
    const newFeatures = localFormData.features.filter((_, i) => i !== index);
    handleChange('features', newFeatures);
  };

  const addVariation = () => {
    setLocalFormData(prev => ({
      ...prev,
      variations: [...prev.variations, { name: '', options: [], prices: [] }]
    }));
  };

  const updateVariation = (index, field, value) => {
    const newVariations = [...localFormData.variations];
    newVariations[index][field] = value;
    handleChange('variations', newVariations);
  };

  const removeVariation = (index) => {
    const newVariations = localFormData.variations.filter((_, i) => i !== index);
    handleChange('variations', newVariations);
  };

  const optimizeContent = async () => {
    if (!localFormData.name || !localFormData.description) {
      alert('Vui lòng điền tên và mô tả sản phẩm');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const suggestions = {
        name: {
          optimized: `${formData.branding?.suggestions?.names[0]?.name || ''} - ${localFormData.name}`,
          seoTitle: `${localFormData.name} | ${formData.categories[0]?.name || ''} | Chính Hãng`,
          variations: [
            `${localFormData.name} - Cao Cấp Chính Hãng`,
            `${localFormData.name} - Bán Chạy Số 1`,
            `${localFormData.name} - Giá Tốt`
          ]
        },
        description: {
          summary: "Đoạn mô tả ngắn tối ưu cho hiển thị trên kết quả tìm kiếm",
          full: `
            🔥 THÔNG TIN SẢN PHẨM
            ${localFormData.name}

            ✨ ĐẶC ĐIỂM NỔI BẬT
            ${localFormData.features.map(f => `• ${f}`).join('\n')}

            🎁 QUYỀN LỢI KHÁCH HÀNG
            • Sản phẩm chính hãng 100%
            • Hoàn tiền 100% nếu phát hiện hàng giả
            • Đổi trả miễn phí trong 7 ngày
            • Freeship toàn quốc cho đơn từ 500k

            📞 HOTLINE HỖ TRỢ: 0123.456.789
          `,
          sections: [
            {
              title: "THÔNG TIN CHI TIẾT",
              content: "Mô tả chi tiết về sản phẩm..."
            },
            {
              title: "HƯỚNG DẪN SỬ DỤNG",
              content: "Các bước sử dụng sản phẩm..."
            }
          ]
        },
        keywords: {
          primary: [
            `${localFormData.name} chính hãng`,
            `${localFormData.name} giá rẻ`,
            `mua ${localFormData.name}`
          ],
          secondary: [
            "chính hãng",
            "giá tốt",
            "freeship"
          ],
          trending: [
            "hot trend 2024",
            "bán chạy",
            "review tốt"
          ]
        },
        images: {
          recommended: 9,
          types: [
            "Hình ảnh sản phẩm chính diện",
            "Hình ảnh chi tiết sản phẩm",
            "Hình ảnh kích thước/thông số",
            "Hình ảnh người dùng thực tế"
          ]
        },
        competition: {
          averagePrice: 250000,
          priceRange: {
            low: 199000,
            high: 299000
          },
          topKeywords: [
            "chính hãng",
            "freeship",
            "hot trend"
          ]
        }
      };

      setAiSuggestions(suggestions);
      setFormData(prev => ({
        ...prev,
        product: {
          ...localFormData,
          aiSuggestions: suggestions
        }
      }));

    } catch (error) {
      console.error('Failed to optimize content:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Basic Product Information */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Thông tin sản phẩm</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tên sản phẩm
            </label>
            <input
              type="text"
              value={localFormData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Nhập tên sản phẩm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mô tả sản phẩm
            </label>
            <textarea
              value={localFormData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Mô tả chi tiết về sản phẩm"
            />
          </div>

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
                value={localFormData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                placeholder="0"
              />
            </div>
          </div>

          {/* Product Features */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Đặc điểm nổi bật
              </label>
              <button
                type="button"
                onClick={addFeature}
                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Thêm đặc điểm
              </button>
            </div>
            <div className="space-y-2">
              {localFormData.features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Nhập đặc điểm sản phẩm"
                  />
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="inline-flex items-center p-1.5 border border-transparent rounded-full text-red-600 hover:bg-red-100 focus:outline-none"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Product Variations */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Phân loại sản phẩm
              </label>
              <button
                type="button"
                onClick={addVariation}
                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Thêm phân loại
              </button>
            </div>
            <div className="space-y-4">
              {localFormData.variations.map((variation, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <input
                      type="text"
                      value={variation.name}
                      onChange={(e) => updateVariation(index, 'name', e.target.value)}
                      className="block w-2/3 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Tên phân loại (VD: Màu sắc, Size)"
                    />
                    <button
                      type="button"
                      onClick={() => removeVariation(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Xóa
                    </button>
                  </div>
                  <div className="mt-2">
                    <input
                      type="text"
                      value={variation.options.join(', ')}
                      onChange={(e) => updateVariation(index, 'options', e.target.value.split(',').map(o => o.trim()))}
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Các tùy chọn, phân cách bằng dấu phẩy (VD: Đỏ, Xanh, Vàng)"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={optimizeContent}
            disabled={loading}
            className="w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Đang tối ưu...' : 'Tối ưu nội dung sản phẩm'}
          </button>
        </div>
      </div>

      {/* AI Optimized Content */}
      {loading ? (
        <div className="text-center py-6">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Đang tối ưu nội dung sản phẩm...</p>
        </div>
      ) : aiSuggestions && (
        <>
          {/* Optimized Titles */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Tên sản phẩm đề xuất</h4>
            <div className="space-y-4">
              <div className="p-4 bg-indigo-50 rounded-lg">
                <p className="font-medium text-indigo-900">{aiSuggestions.name.optimized}</p>
                <p className="mt-1 text-sm text-indigo-600">Tên chính</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium">{aiSuggestions.name.seoTitle}</p>
                <p className="mt-1 text-sm text-gray-600">Tiêu đề SEO</p>
              </div>
              <div className="space-y-2">
                {aiSuggestions.name.variations.map((title, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    {title}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Optimized Description */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Mô tả sản phẩm đề xuất</h4>
            
            <div className="space-y-6">
              <div>
                <h5 className="font-medium mb-2">Mô tả tóm tắt</h5>
                <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                  {aiSuggestions.description.summary}
                </p>
              </div>

              <div>
                <h5 className="font-medium mb-2">Mô tả đầy đủ</h5>
                <div className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg text-gray-600">
                  {aiSuggestions.description.full}
                </div>
              </div>

              <div>
                <h5 className="font-medium mb-2">Các phần mô tả chi tiết</h5>
                <div className="space-y-4">
                  {aiSuggestions.description.sections.map((section, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h6 className="font-medium text-indigo-600 mb-2">{section.title}</h6>
                      <p className="text-gray-600">{section.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SEO Keywords */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Từ khóa SEO</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h5 className="font-medium text-indigo-600 mb-3">Từ khóa chính</h5>
                <div className="space-y-2">
                  {aiSuggestions.keywords.primary.map((keyword, index) => (
                    <div key={index} className="p-2 bg-indigo-50 rounded text-sm">
                      {keyword}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="font-medium text-green-600 mb-3">Từ khóa phụ</h5>
                <div className="space-y-2">
                  {aiSuggestions.keywords.secondary.map((keyword, index) => (
                    <div key={index} className="p-2 bg-green-50 rounded text-sm">
                      {keyword}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="font-medium text-purple-600 mb-3">Từ khóa xu hướng</h5>
                <div className="space-y-2">
                  {aiSuggestions.keywords.trending.map((keyword, index) => (
                    <div key={index} className="p-2 bg-purple-50 rounded text-sm">
                      {keyword}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Image Guidelines */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Hướng dẫn hình ảnh</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium mb-3">Yêu cầu hình ảnh</h5>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Sản phẩm cần tối thiểu <span className="font-medium text-indigo-600">{aiSuggestions.images.recommended}</span> hình ảnh
                  </p>
                </div>
                <div className="mt-4 space-y-2">
                  {aiSuggestions.images.types.map((type, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-full text-xs">
                        {index + 1}
                      </span>
                      <span className="text-sm text-gray-600">{type}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="font-medium mb-3">Phân tích đối thủ</h5>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Giá trung bình thị trường</p>
                    <p className="text-lg font-medium text-indigo-600">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(aiSuggestions.competition.averagePrice)}
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Khoảng giá phổ biến</p>
                    <p className="text-lg font-medium text-indigo-600">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(aiSuggestions.competition.priceRange.low)} - {' '}
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(aiSuggestions.competition.priceRange.high)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Từ khóa phổ biến của đối thủ</p>
                    <div className="flex flex-wrap gap-2">
                      {aiSuggestions.competition.topKeywords.map((keyword, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 rounded text-sm">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Shopee Preview */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-medium text-gray-900">Xem trước trên Shopee</h4>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="text-sm text-indigo-600 hover:text-indigo-700"
              >
                {showPreview ? 'Ẩn xem trước' : 'Hiện xem trước'}
              </button>
            </div>

            {showPreview && (
              <div className="border rounded-lg p-4">
                <div className="aspect-w-1 aspect-h-1 w-full mb-4">
                  <div className="bg-gray-200 rounded-lg"></div>
                </div>
                <h5 className="text-lg font-medium">{aiSuggestions.name.optimized}</h5>
                <div className="mt-2 flex items-center space-x-2">
                  <span className="text-2xl font-bold text-red-600">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(localFormData.price)}
                  </span>
                  {aiSuggestions.competition.averagePrice > localFormData.price && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-sm rounded">
                      Giảm {Math.round((1 - localFormData.price / aiSuggestions.competition.averagePrice) * 100)}%
                    </span>
                  )}
                </div>
                <div className="mt-4 prose max-w-none text-sm text-gray-600">
                  {aiSuggestions.description.summary}
                </div>
                {localFormData.variations.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Phân loại:</p>
                    <div className="flex flex-wrap gap-2">
                      {localFormData.variations.flatMap(variation =>
                        variation.options.map((option, i) => (
                          <span key={`${variation.name}-${i}`} className="px-3 py-1 bg-gray-100 rounded-lg text-sm">
                            {option}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
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