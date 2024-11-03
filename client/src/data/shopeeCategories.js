export const shopeeCategories = [
    {
      id: 'beauty',
      name: 'Sức Khỏe & Làm Đẹp',
      subcategories: [
        {
          id: 'skincare',
          name: 'Chăm sóc da mặt',
          subcategories: [
            { id: 'cleanser', name: 'Sữa rửa mặt' },
            { id: 'toner', name: 'Toner' },
            { id: 'serum', name: 'Serum & Tinh chất' },
            { id: 'moisturizer', name: 'Kem dưỡng ẩm' },
            { id: 'sunscreen', name: 'Kem chống nắng' }
          ]
        },
        {
          id: 'makeup',
          name: 'Trang điểm',
          subcategories: [
            { id: 'face_makeup', name: 'Trang điểm mặt' },
            { id: 'eye_makeup', name: 'Trang điểm mắt' },
            { id: 'lip_makeup', name: 'Son & Trang điểm môi' }
          ]
        }
      ]
    },
    {
      id: 'fashion',
      name: 'Thời Trang',
      subcategories: [
        {
          id: 'women_clothes',
          name: 'Thời trang nữ',
          subcategories: [
            { id: 'dresses', name: 'Đầm' },
            { id: 'shirts', name: 'Áo' },
            { id: 'pants', name: 'Quần' }
          ]
        },
        {
          id: 'men_clothes',
          name: 'Thời trang nam',
          subcategories: [
            { id: 'shirts', name: 'Áo' },
            { id: 'pants', name: 'Quần' },
            { id: 'jackets', name: 'Áo khoác' }
          ]
        }
      ]
    },
    {
      id: 'electronics',
      name: 'Thiết Bị Điện Tử',
      subcategories: [
        {
          id: 'mobile',
          name: 'Điện thoại & Phụ kiện',
          subcategories: [
            { id: 'phones', name: 'Điện thoại' },
            { id: 'cases', name: 'Ốp lưng' },
            { id: 'chargers', name: 'Sạc & Cáp' }
          ]
        },
        {
          id: 'computers',
          name: 'Máy tính & Laptop',
          subcategories: [
            { id: 'laptops', name: 'Laptop' },
            { id: 'pc', name: 'Máy tính để bàn' },
            { id: 'accessories', name: 'Phụ kiện máy tính' }
          ]
        }
      ]
    }
  ];