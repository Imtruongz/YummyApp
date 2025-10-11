import axiosInstance from './config';

// Interface cho banner
export interface Banner {
  id: string;
  image: string;
  title: string;
  description?: string;
  link?: string;
  isActive: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Lấy tất cả banner đang active
export const getAllActiveBanners = async (): Promise<Banner[]> => {
  try {
    const response = await axiosInstance.get('/banners/active');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching banners:', error);
    return [];
  }
};

// Trong trường hợp chưa có API từ server, sử dụng dữ liệu mẫu
export const getLocalBanners = (): Banner[] => {
  return [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1',
      title: 'Món ăn đặc sắc',
      description: 'Khám phá các món ăn từ đầu bếp hàng đầu',
      isActive: true,
      link: '/explore'
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe',
      title: 'Công thức mới mỗi ngày',
      description: 'Cập nhật công thức nấu ăn độc đáo hàng ngày',
      isActive: true,
      link: '/daily'
    },
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327',
      title: 'Ẩm thực địa phương',
      description: 'Khám phá hương vị đặc trưng từng vùng miền',
      isActive: true,
      link: '/local'
    },
    {
      id: '4',
      image: 'https://images.unsplash.com/photo-1496412705862-e0088f16f791',
      title: 'Món tráng miệng ngọt ngào',
      description: 'Tận hưởng các món tráng miệng tuyệt hảo',
      isActive: true,
      link: '/desserts'
    }
  ];
};