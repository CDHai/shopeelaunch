const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY;
const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";

export const claudeService = {
  async analyzeMarket(category, products) {
    const prompt = `
      Bạn là một chuyên gia phân tích thị trường trên Shopee. 
      Hãy phân tích thị trường cho ngành hàng ${category}.
      Sản phẩm dự định bán: ${products.join(', ')}
      
      Yêu cầu phân tích:
      1. Quy mô thị trường và tốc độ tăng trưởng
      2. Top 5 sản phẩm bán chạy nhất trong ngành
      3. Thị phần của các thương hiệu lớn
      4. Xu hướng tìm kiếm 6 tháng gần đây
      5. Đề xuất chiến lược cạnh tranh

      Trả về kết quả dưới dạng JSON với cấu trúc:
      {
        "marketSize": string,
        "growthRate": string,
        "topProducts": [
          {
            "name": string,
            "price": number,
            "sales": string
          }
        ],
        "marketShare": [
          {
            "brand": string,
            "share": number
          }
        ],
        "searchTrends": [
          {
            "month": string,
            "volume": number
          }
        ],
        "recommendations": string[]
      }

      Lưu ý:
      - Số liệu phải chính xác và cập nhật
      - Phân tích phải dựa trên dữ liệu thực tế của Shopee
      - Đề xuất phải cụ thể và khả thi
    `;

    try {
      const response = await fetch(CLAUDE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: "claude-3-opus-20240229",
          max_tokens: 4096,
          messages: [
            {
              role: "user",
              content: prompt
            }
          ]
        })
      });

      console.log('Claude API response:', response);
      const data = await response.json();
      console.log('Claude API data:', data);

      return JSON.parse(data.content[0].text);
    } catch (error) {
      console.error('Claude API error:', error);
      throw error;
    }
  }
};