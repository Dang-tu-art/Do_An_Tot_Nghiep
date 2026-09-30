import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ShopPage.css';

const PRODUCTS = [
  { id: 1, name: 'Nokia 105 4G', rawPrice: 650000, price: '650.000đ', image: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTBtN9-g0MDhfDqgv9PXu-KZAKVHJKSLv5eGe766Y86V2qP0g8T8NffCOlYgdkyonBScZiSv2nrh_yLO3QjB0kb6J7DcVnPhCII3t6E0uUcFHBdFFad9SUUee-lxKGMKUT227x_RA&usqp=CAc', category: 'Phím bấm', specs: 'Màn hình 1.8 inch, 2 SIM 4G VoLTE, Nghe đài FM không cần tai nghe, Pin 1450 mAh.',
  variants: [
      { color: 'Xanh', image: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTBtN9-g0MDhfDqgv9PXu-KZAKVHJKSLv5eGe766Y86V2qP0g8T8NffCOlYgdkyonBScZiSv2nrh_yLO3QjB0kb6J7DcVnPhCII3t6E0uUcFHBdFFad9SUUee-lxKGMKUT227x_RA&usqp=CAc' },
      { color: 'Đen', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSinXYNW7wuIiz_WII4qdsOoUxXOZT-QCxqwIcUpMg2ag&s=10' },
      { color: 'Đỏ', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6GonirpOy6aTov-s5Nx6ySqd5xjpjvu_omTvIxb8K8w&s=10' }
    ]},
  { id: 2, name: 'Nokia 3310 (2017)', rawPrice: 1050000, price: '1.050.000đ', image: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQ1OEAmUcSguANzs4b-okwzd5126sleLlx8M8Nw-_jV4gHAU77UT-Qs0U2K14yH8odEOKhJTiI-KNpy3jqXQUzDAF1P-CWOOLi35fDQ4GiPSrBGwlTc4w_g0qmUDR6KL_2RgE4gyOs&usqp=CAc', category: 'Phím bấm', specs: 'Màn hình màu 2.4 inch, Camera 2MP, Game Rắn săn mồi huyền thoại, Pin chờ cả tháng.',
    variants: [
      { color: 'Trắng đen', image: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQ1OEAmUcSguANzs4b-okwzd5126sleLlx8M8Nw-_jV4gHAU77UT-Qs0U2K14yH8odEOKhJTiI-KNpy3jqXQUzDAF1P-CWOOLi35fDQ4GiPSrBGwlTc4w_g0qmUDR6KL_2RgE4gyOs&usqp=CAc' },
      { color: 'Xanh', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNbZ1PE-fnIZQwEgzqB6ka2L50l9BWNmFl0GE2aYGj_w&s=10' },
      { color: 'Vàng', image: 'https://bizweb.dktcdn.net/100/655/213/products/3310-vang.png?v=1773313856163' }
    ]
   },
  { id: 3, name: 'Nokia 8210 4G', rawPrice: 1290000, price: '1.290.000đ', image: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcReEOTYBlyijtWAui8OOxy_w7xS0MdMX1g1fv3ZUeyM1QLzOvtqI2S3Fyj4BdxQ8_x8ydeeFEHcESyDARzOgnHTCVM6bNtfjBUZAE-nvjp-ofsnxbpYEpX6zGAi3Lw2rorV0TYFQEg&usqp=CAc', category: 'Phím bấm', specs: 'Thiết kế cổ điển tái sinh, Màn hình 2.8 inch, Trình phát nhạc MP3, Kết nối 4G siêu nhanh.',
     variants: [
      { color: 'Trắng đen', image: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcReEOTYBlyijtWAui8OOxy_w7xS0MdMX1g1fv3ZUeyM1QLzOvtqI2S3Fyj4BdxQ8_x8ydeeFEHcESyDARzOgnHTCVM6bNtfjBUZAE-nvjp-ofsnxbpYEpX6zGAi3Lw2rorV0TYFQEg&usqp=CAc' },
      { color: 'Nâu đỏ', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRYXmSOt6ffFNQDgkLDLn1wavEacI_WtwS88CD8YZ4lw&s=10' },
      { color: 'Xanh', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1opzdyZc8zrTu5rMHwRdAzLb94H992LYnI_H3950JcQ&s=10' }
    ]
   },
  { id: 4, name: 'Nokia 220', rawPrice: 890000, price: '890.000đ', image: 'https://cdn2.cellphones.com.vn/x/media/catalog/product/n/o/nokia-220-4g_9_.png', category: 'Phím bấm', specs: 'Loa ngoài cực to, Phím bấm số lớn, Đèn pin siêu sáng, Thích hợp cho người lớn tuổi.',
     variants: [
      { color: 'Cam', image: 'https://cdn2.cellphones.com.vn/x/media/catalog/product/n/o/nokia-220-4g_9_.png' },
      { color: 'Đen', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRh-AK_gMZkq2pUPTh67jIuq8_hnDQJiHPfBw3Tj9gsNQ&s' },
    ]
   },
  
  { id: 5, name: 'Iphone XS', rawPrice: 4500000, price: '4.500.000đ', image: 'https://apple.ngocnguyen.vn/cdn/images/202304/goods_img/iphone-xs-max-quoc-te-99-P3660-1680950352358.jpg', category: 'Apple', specs: 'Màn hình OLED 5.8 inch, Chip Apple A12 Bionic, Camera kép 12MP, Face ID, Chống nước IP68',
     variants: [
      { color: 'Trắng', image: 'https://apple.ngocnguyen.vn/cdn/images/202304/goods_img/iphone-xs-max-quoc-te-99-P3660-1680950352358.jpg' },
      { color: 'Vàng gold', image: 'https://techland.com.vn/public_folder/folder_image/uploads/upload/san_pham/iphone/iphone-xs-xsmax-xr/xs/iphone-xs-gold.jpg' },
    ]
   },
  { id: 6, name: 'Iphone 12 Pro max', rawPrice: 7800000, price: '7.800.000đ', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpjvZnKMRpfdXhYpivnOKlVEzesX_HrvLRBzGIcJc3TA&s=10', category: 'Apple', specs: 'Màn hình OLED Super Retina XDR 6.7 inch, Chip Apple A14 Bionic, Camera ba 12MP, Face ID, Chống nước IP68.',
    variants: [
      { color: 'Xám', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpjvZnKMRpfdXhYpivnOKlVEzesX_HrvLRBzGIcJc3TA&s=10' },
      { color: 'Xanh', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR96VxTXNIEwKTauigrt1kNVozka7H1YM_s-cL0M-FUxg&s=10' },
      { color: 'Vàng Gold', image: 'https://bizweb.dktcdn.net/thumb/1024x1024/100/517/334/products/iphone-12-promaxvang.jpg?v=1716524802260'},
    ]
   },

  { id: 7, name: 'Xiaomi Redmi 13C', rawPrice: 3090000, price: '3.090.000đ', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS85bvWkuZIL5Y_zg3fdh9WOpaafj5RcX1ooNYHDrii1w&s', category: 'Xiaomi', specs: 'Màn hình 6.74 inch 90Hz, Camera AI 50MP, Chip MediaTek Helio G85, Pin 5000 mAh sạc 18W.',
    variants: [
      { color: 'Đen', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS85bvWkuZIL5Y_zg3fdh9WOpaafj5RcX1ooNYHDrii1w&s' },
      { color: 'Trắng', image: 'https://clickbuy.com.vn/uploads/pro/xiaomi-redmi-13chtml-8352-mlvg-1024x1024-197464.jpg' },
      { color: 'Xanh lá', image: 'https://dungmobi.com/wp-content/uploads/2024/07/15200556/dien-thoai-xiaomi-redmi-13c-6gb-128gb-xanh-la-300x300.png'},
    ]
   },
  { id: 8, name: 'Realme Note 50', rawPrice: 2490000, price: '2.490.000đ', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdo62YRaXLfzbEowNJYAZR-ReKZMCpZA7KZ-ckvj-mwA&s=10', category: 'Realme', specs: 'Kháng nước bụi IP54, Màn hình 90Hz mượt mà, Thân máy siêu mỏng 7.99mm, Pin 5000 mAh.',
    variants: [
      { color: 'Đen', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdo62YRaXLfzbEowNJYAZR-ReKZMCpZA7KZ-ckvj-mwA&s=10' },
      { color: 'Xanh', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ87lTTEpTmcJYXgT1jx-7E0a9P2Ernrmpjo6XTET05wA&s=10'},
    ]
   },
  { id: 9, name: 'OPPO Reno 16', rawPrice: 3190000, price: '3.190.000đ', image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/o/p/oppo-reno16f-pop-white-9.jpg', category: 'OPPO', specs: 'Màn hình AMOLED 6.32 inch 120Hz, Chip Snapdragon 7 Gen 4, RAM 8GB, Camera ba 50MP, Pin 6700mAh, Sạc nhanh 80W.',
    variants: [
      { color: 'Trắng', image: 'https://cdn.viettablet.com/images/news/78/oppo-reno16-gia-bao-nhieu-1.jpg' },
      { color: 'Tím', image: 'https://cdn.hstatic.net/products/1000063620/163_4a99b97886614ef7834f12923d8ddc88_1024x1024.png'},
      { color: 'Xanh', image: 'https://www.duchuymobile.com/images/detailed/93/oppo-reno16-pro_nwld-ua.jpg'},
    ]
   },
  { id: 10, name: 'Samsung Galaxy A05', rawPrice: 2890000, price: '2.890.000đ', image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/a/0/a05trang.jpg', category: 'Samsung', specs: 'Màn hình 6.7 inch HD+, Camera 50MP sắc nét, Chip MediaTek Helio G85, Hỗ trợ sạc nhanh 25W.',
    variants: [
      { color: 'Trắng', image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/a/0/a05trang.jpg' },
      { color: 'Đen', image: 'https://minhtuanmobile.com/uploads/products/240518031322-samsung-galaxy-a05-4gb-128gb-black.png'},
    ]
   },

  { id: 11, name: 'Samsung Galaxy A55 5G', rawPrice: 9990000, price: '9.990.000đ', image: 'https://image.anhducdigital.vn/di-dong/dien-thoai/samsung/galaxy-a55/samsung-galaxy-a55-11.jpg', category: 'Samsung', specs: 'Khung kim loại sang trọng, Màn hình Super AMOLED 120Hz, Chip Exynos 1480, Kháng nước IP67.',
     variants: [
      { color: 'Hồng nhạt', image: 'https://image.anhducdigital.vn/di-dong/dien-thoai/samsung/galaxy-a55/samsung-galaxy-a55-11.jpg' },
      { color: 'Trắng', image: 'https://minhtuanmobile.com/uploads/products/240325043628-samsung-galaxy-a55-5g-8gb-128gb-1.png'},
    ]
   },
  { id: 12, name: 'iPhone 13 128GB', rawPrice: 13990000, price: '13.990.000đ', image: 'https://cdn2.fptshop.com.vn/unsafe/828x0/filters:format(webp):quality(75)/2022_3_30_637842470242656074_iphone-13-white.jpg', category: 'Apple', specs: 'Màn hình Super Retina XDR OLED 6.1 inch, Chip Apple A15 Bionic, Chế độ quay phim Điện ảnh Cinematic.',
     variants: [
      { color: 'Trắng', image: 'https://cdn2.fptshop.com.vn/unsafe/828x0/filters:format(webp):quality(75)/2022_3_30_637842470242656074_iphone-13-white.jpg' },
      { color: 'Vàng gold', image: 'https://cdn2.fptshop.com.vn/unsafe/828x0/filters:format(webp):quality(75)/2022_4_19_637859769705793853_iPhone%2013%20Promax%20(2).jpg'},
      { color: 'Hồng', image: 'https://cdn2.fptshop.com.vn/unsafe/828x0/filters:format(webp):quality(75)/2022_3_30_637842470238437307_iphone-13-pink.jpg'},
    ]
   },
  { id: 13, name: 'Xiaomi Redmi Note 13 Pro+', rawPrice: 9490000, price: '9.490.000đ', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTu3pZh3TXDk2vMKpnrSaQWxWoZaNbbVGSuk5tf1M-x8w&s=10', category: 'Xiaomi', specs: 'Màn hình cong AMOLED 120Hz 1.5K, Camera 200MP OIS, Sạc siêu tốc HyperCharge 120W.',
     variants: [
      { color: 'Đen', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTu3pZh3TXDk2vMKpnrSaQWxWoZaNbbVGSuk5tf1M-x8w&s=10' },
      { color: 'Xám', image: 'https://cdni.dienthoaivui.com.vn/x,webp,q100/https://media-asset.dienthoaivui.com.vn/uploads/wp-content/uploads/images/products/250513/xiaomi-redmi-note-13-pro-plus-5g-12gb-256gb-cu-dep-17557968416698.jpg'},
     ]
   },
  { id: 14, name: 'Realme GT8 Pro', rawPrice: 8490000, price: '8.490.000đ', image: 'https://sonpixel.vn/wp-content/uploads/2025/10/realme-gt8-pro.webp', category: 'Realme', specs: 'Màn hình AMOLED 6.79 inch 144Hz, Chip Snapdragon 8 Elite Gen 5, RAM 16GB, Camera ba 50MP/50MP/200MP, Pin 7000mAh, Sạc nhanh 120W.',
    variants: [
      { color: 'Trắng', image: 'https://sonpixel.vn/wp-content/uploads/2025/10/realme-gt8-pro.webp' },
      { color: 'Xanh than', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiH2m-xNaws5tH1edsIRtGujESjKIfMsvCz6U30izCAYsIzUHzgcEdbS4i&s=10'},
     ]
   },

  { id: 15, name: 'Iphone 14 Pro Max', rawPrice: 24990000, price: '24.990.000đ', image: 'https://product.hstatic.net/200000032816/product/14pm-purple_14a9f4c868fa4f14890c648ef044be3d_master.png', category: 'Apple', specs: 'Màn hình OLED Super Retina XDR 6.1 inch 120Hz, Chip Apple A16 Bionic, Camera ba 48MP, Dynamic Island, Face ID, Chống nước IP68.',
    variants: [
      { color: 'Đen', image: 'https://product.hstatic.net/200000032816/product/14pm-purple_14a9f4c868fa4f14890c648ef044be3d_master.png' },
      { color: 'Trắng', image: 'https://irepair-mobiles.co.uk/wp-content/uploads/2023/08/iPhone-14-Pro-Max-New-A-Grade-Unlocked-128GB-Silver.jpg'},
     ]
   },
  { id: 16, name: 'iPhone 15 Pro Max', rawPrice: 29990000, price: '29.990.000đ', image: 'https://www.itoo.it/cdn/shop/files/iPhone15ProTitanioBianco.jpg?v=1747561089&width=1920', category: 'Apple', specs: 'Màn hình 6.7 inch Super Retina XDR, Chip A17 Pro, Khung Titanium, Camera Zoom 5x, Pin 4422 mAh.',
    variants: [
      { color: 'Trắng', image: 'https://www.itoo.it/cdn/shop/files/iPhone15ProTitanioBianco.jpg?v=1747561089&width=1920' },
      { color: 'Đen', image: 'https://bizweb.dktcdn.net/thumb/1024x1024/100/517/334/products/ip-15-pro-max-mhm-xanh-9a4ac8db5bb34883956fc0704320830f-grande-f3c2eec1-29c9-4d80-804d-95b2dd812f46.jpg?v=1716308540803' },
      { color: 'Titanium', image: 'https://www.phonemart.ng/wp-content/uploads/2024/06/15-promax2.jpeg' },
      ]
   },
  { id: 17, name: 'Samsung Galaxy S24 Ultra', rawPrice: 26990000, price: '26.990.000đ', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcgQwKfwzGqSYMM_gR9wOwCNNg2cI0HxelwuMWdu573g&s=10', category: 'Samsung', specs: 'Dynamic AMOLED 2X 6.8 inch 120Hz, Snapdragon 8 Gen 3, Bút S-Pen tích hợp, Camera 200MP AI.',
     variants: [
      { color: 'Xám', image: 'https://images.samsung.com/is/image/samsung/p6pim/vn/2401/gallery/vn-galaxy-s24-s928-sm-s928bztqxxv-539307591?$624_624_PNG$' },
      { color: 'Đen', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcgQwKfwzGqSYMM_gR9wOwCNNg2cI0HxelwuMWdu573g&s=10' },
      { color: 'Vàng',image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGIIrjkdTBGoY-YRUsWH1ZJzpattNdNbatCTPlUbtiC5TK7c60UtSkzAk&s=10' },
      ]
   },
  { id: 18, name: 'Vivo V50 Lite 5G', rawPrice: 22490000, price: '22.490.000đ', image: 'https://cdn1.viettelstore.vn/Images/Product/ProductImage/543593845.jpeg', category: 'Vivo', specs: 'Màn hình AMOLED 6.77 inch 120Hz, Chip MediaTek Dimensity 6300, RAM 8GB, Camera sau 50MP + 8MP, Pin 6500mAh, Sạc nhanh 90W.',
     variants: [
      { color: 'Đen', image: 'https://bizweb.dktcdn.net/100/312/636/products/2-55248.jpg?v=1760705946910' },
      { color: 'Tím', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYKsLgNws9fyVQGPsHcn2aGuZIByIdM_ocNoX3l_g5yA&s=10' },
      { color: 'Vàng',image: 'https://asia-exstatic-vivofs.vivo.com/PSee2l50xoirPK7y/1744103027626/e506c9820501690dd40ff9088c16f833.png' },
      ]
   },
  { id: 19, name: 'Xiaomi 14 Ultra', rawPrice: 24990000, price: '24.990.000đ', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQh9qKdQwH_zhfq0vxF1QZ_r8kpZ59zlxL8hoWexKUB4A&s=10', category: 'Xiaomi', specs: 'Ống kính quang học Leica 4 camera, Cảm biến 1-inch Sony LYT-900, Sạc siêu nhanh 90W.',
    variants: [
      { color: 'Xanh', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQh9qKdQwH_zhfq0vxF1QZ_r8kpZ59zlxL8hoWexKUB4A&s=10' },
      { color: 'Trắng', image: 'https://cdn2.cellphones.com.vn/x/media/catalog/product/x/i/xiaomi-14-ultra.png' },
      { color: 'Đen',image: 'https://wmw-eshop-prod.s3.amazonaws.com/images/products/5239/larges/Xiaomi_14_Ultra_Black.jpg?1718006088' },
      ]
   },
 
  { id: 20, name: 'Iphone 17 Pro Max', rawPrice: 39990000, price: '39.990.000đ', image: 'https://halomobile.vn/wp-content/uploads/2025/09/iPhone-17-Pro-Max-mau-cam-min.png', category: 'Apple', specs: 'Màn hình OLED Super Retina XDR 6.9 inch 120Hz, Chip Apple A19 Pro, Camera ba 48MP, Dynamic Island, Face ID, Chống nước IP68.',
     variants: [
      { color: 'Cam', image: 'https://halomobile.vn/wp-content/uploads/2025/09/iPhone-17-Pro-Max-mau-cam-min.png' },
      { color: 'Bạc Titanium', image: 'https://cdn2.fptshop.com.vn/unsafe/iphone_17_pro_max_silver_1_7b25d56e26.png' },
      { color: 'Xanh than',image: 'https://minhtuanmobile.com/uploads/products/251227020957-iphone-17-pro-max-1tb.jpg' },
      ]
   }
];

export default function ShopPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || { email: 'Khách hàng' };
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Modal Đặt hàng (nhập thông tin) & Modal Hóa đơn
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState(null);

  // Form thông tin người nhận
  const [shippingInfo, setShippingInfo] = useState({
    fullName: user.email ? user.email.split('@')[0] : '',
    phone: '',
    address: '',
    paymentMethod: 'COD'
  });

  const categories = ['Tất cả', 'Phím bấm', 'Apple', 'Samsung', 'Xiaomi', 'Khác'];

  const confirmLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/'); 
  };

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    if (product.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    } else {
      setSelectedVariant({ color: 'Tiêu chuẩn', image: product.image || '' });
    }
  };

  const handleAddToCart = (product, variantChosen) => {
    const variant = variantChosen || (product.variants && product.variants.length > 0 ? product.variants[0] : { color: 'Tiêu chuẩn', image: product.image || '' });
    
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.id === product.id && item.color === variant.color
      );

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id && item.color === variant.color
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [
          ...prevCart, 
          { 
            ...product, 
            color: variant.color, 
            image: variant.image || product.image, 
            quantity: 1 
          }
        ];
      }
    });
  };

  const updateQuantity = (id, color, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === id && item.color === color) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (id, color) => {
    setCart((prevCart) => prevCart.filter((item) => !(item.id === id && item.color === color)));
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.rawPrice * item.quantity, 0);

  // Mở modal Đặt hàng khi bấm nút trong Giỏ hàng
  const handleOpenCheckout = () => {
    if (cart.length === 0) return;
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Xác nhận Thanh toán từ Form thông tin
  const handleFinalPayment = (e) => {
    e.preventDefault();

    const newInvoice = {
      id: 'HD' + Date.now().toString().slice(-6),
      date: new Date().toLocaleString('vi-VN'),
      customer: shippingInfo.fullName || user.email || 'Khách hàng',
      phone: shippingInfo.phone,
      address: shippingInfo.address,
      paymentMethod: shippingInfo.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng (COD)' : 'Chuyển khoản ngân hàng',
      items: [...cart],
      totalAmount: totalPrice,
    };

    const existingOrders = JSON.parse(localStorage.getItem('orders')) || [];
    localStorage.setItem('orders', JSON.stringify([newInvoice, ...existingOrders]));

    setCurrentInvoice(newInvoice);
    setCart([]);
    setIsCheckoutOpen(false);
  };

  const filteredProducts = PRODUCTS.filter((item) => {
    const keyword = searchTerm.toLowerCase();
    const matchesSearch = item.name.toLowerCase().includes(keyword) || item.specs.toLowerCase().includes(keyword);
    
    if (selectedCategory === 'Tất cả') return matchesSearch;
    if (selectedCategory === 'Khác') return matchesSearch && !['Phím bấm', 'Apple', 'Samsung', 'Xiaomi'].includes(item.category);
    return matchesSearch && item.category === selectedCategory;
  });

  return (
    <div className="shop-container">
      {/* Header */}
      <header className="shop-header">
        <div className="logo-section">
          <h2>📱 PHONE STORE</h2>
        </div>

        <div className="search-section">
          <input 
            type="text" 
            placeholder="Tìm kiếm..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="user-section">
          <span>Xin chào, <strong>{user.email ? user.email.split('@')[0] : 'Khách'}</strong></span>
          <button className="cart-btn" onClick={() => setIsCartOpen(!isCartOpen)}>
            🛒 Giỏ hàng ({totalCartCount})
          </button>

          <button className="logout-btn" onClick={() => setShowLogoutConfirm(true)}>
            ⇥ Đăng xuất
          </button>
        </div>
      </header>

      {/* Banner */}
      <section className="shop-banner">
        <h1>Thế Giới Điện Thoại Từ Cổ Điển Đến Hiện Đại</h1>
        <p>Chọn sắc màu ưa thích - Đa dạng sản phẩm chính hãng!</p>
      </section>

      {/* Thanh lọc danh mục */}
      <div className="category-filter">
        {categories.map((cat) => (
          <button 
            key={cat} 
            className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid sản phẩm */}
      <main className="shop-main">
        <h3>
          {searchTerm ? `Kết quả tìm kiếm cho "${searchTerm}" (${filteredProducts.length})` : `Danh Sách Sản Phẩm (${filteredProducts.length})`}
        </h3>

        {filteredProducts.length > 0 ? (
          <div className="product-grid">
            {filteredProducts.map((item) => {
              const defaultImg = item.variants && item.variants.length > 0 ? item.variants[0].image : item.image;
              return (
                <div key={item.id} className="product-card" onClick={() => handleOpenModal(item)}>
                  <img src={defaultImg} alt={item.name} />
                  
                  <h4>{item.name}</h4>
                  <p className="price">{item.price}</p>
                  
                  {item.variants && (
                    <span className="color-count-tag">{item.variants.length} màu sắc</span>
                  )}

                  <button 
                    className="add-cart-btn" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(item);
                    }}
                  >
                    + Thêm Vào Giỏ
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <p style={{ textAlign: 'center', marginTop: '30px', color: '#64748b' }}>
            Không tìm thấy sản phẩm nào phù hợp.
          </p>
        )}
      </main>

      {/* Modal Chi Tiết Sản Phẩm & Chọn Màu */}
      {selectedProduct && selectedVariant && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedProduct(null)}>✕</button>
            <div className="modal-body">
              <div className="modal-img-container">
                <img src={selectedVariant.image} alt={selectedVariant.color} className="modal-img" />
              </div>

              <div className="modal-info">
                <span className="badge">{selectedProduct.category}</span>
                <h2>{selectedProduct.name}</h2>
                <p className="modal-price">{selectedProduct.price}</p>

                {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                  <div className="color-selector">
                    <h4>Màu sắc đã chọn: <strong>{selectedVariant.color}</strong></h4>
                    <div className="color-options">
                      {selectedProduct.variants.map((v) => (
                        <button
                          key={v.color}
                          className={`color-btn ${selectedVariant.color === v.color ? 'selected' : ''}`}
                          onClick={() => setSelectedVariant(v)}
                        >
                          {v.color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="specs-box">
                  <h4>Thông số kỹ thuật:</h4>
                  <p>{selectedProduct.specs}</p>
                </div>

                <div className="modal-actions">
                  <button 
                    className="buy-now-btn" 
                    onClick={() => {
                      handleAddToCart(selectedProduct, selectedVariant);
                      setSelectedProduct(null);
                    }}
                  >
                    🛒 Thêm Vào Giỏ (Màu {selectedVariant.color})
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GIỎ HÀNG MINI */}
      {isCartOpen && (
        <div className="mini-cart-overlay" onClick={() => setIsCartOpen(false)}>
          <div className="mini-cart-box" onClick={(e) => e.stopPropagation()}>
            <div className="mini-cart-header">
              <h4>🛒 Giỏ hàng của bạn ({totalCartCount})</h4>
              <button className="mini-close-btn" onClick={() => setIsCartOpen(false)}>✕</button>
            </div>

            {cart.length === 0 ? (
              <p className="mini-empty-text">Chưa có sản phẩm nào trong giỏ.</p>
            ) : (
              <>
                <div className="mini-cart-list">
                  {cart.map((item) => (
                    <div key={`${item.id}-${item.color}`} className="mini-cart-item">
                      <img src={item.image} alt={item.name} className="mini-item-img" />
                      <div className="mini-item-details">
                        <span className="mini-item-name">{item.name}</span>
                        <span className="mini-item-color">Màu: {item.color}</span>
                        <span className="mini-item-price">{item.price}</span>
                      </div>
                      <div className="mini-item-qty">
                        <button onClick={() => updateQuantity(item.id, item.color, -1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.color, 1)}>+</button>
                      </div>
                      <button className="mini-remove-btn" onClick={() => removeFromCart(item.id, item.color)}>✕</button>
                    </div>
                  ))}
                </div>

                <div className="mini-cart-footer">
                  <div className="mini-total-line">
                    <span>Tổng tiền:</span>
                    <strong>{totalPrice.toLocaleString('vi-VN')}đ</strong>
                  </div>
                  <button className="mini-checkout-btn" onClick={handleOpenCheckout}>
                    Đặt hàng
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* MODAL BẢNG NHẬP THÔNG TIN ĐẶT HÀNG & XÁC NHẬN TIỀN */}
      {isCheckoutOpen && (
        <div className="modal-overlay" onClick={() => setIsCheckoutOpen(false)}>
          <div className="checkout-modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setIsCheckoutOpen(false)}>✕</button>
            <h2>📝 THÔNG TIN ĐẶT HÀNG</h2>

            <div className="checkout-summary">
              <h4>Tổng số lượng: <span>{totalCartCount} sản phẩm</span></h4>
              <h3>Tổng thanh toán: <strong>{totalPrice.toLocaleString('vi-VN')}đ</strong></h3>
            </div>

            <form onSubmit={handleFinalPayment} className="checkout-form">
              <div className="form-group">
                <label>Họ và tên người nhận:</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Nhập họ và tên"
                  value={shippingInfo.fullName}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Số điện thoại:</label>
                <input 
                  type="tel" 
                  required 
                  placeholder="Nhập số điện thoại liên hệ"
                  value={shippingInfo.phone}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Địa chỉ nhận hàng:</label>
                <textarea 
                  required 
                  rows="2"
                  placeholder="Nhập địa chỉ giao hàng chi tiết"
                  value={shippingInfo.address}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                />
              </div>
              <button type="submit" className="payment-btn">
                Thanh toán
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL HÓA ĐƠN XÁC NHẬN */}
      {currentInvoice && (
        <div className="modal-overlay" onClick={() => setCurrentInvoice(null)}>
          <div className="invoice-modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setCurrentInvoice(null)}>✕</button>
            
            <div className="invoice-header">
              <h2>HÓA ĐƠN BÁN HÀNG</h2>
              <p className="invoice-id">Mã đơn: <strong>#{currentInvoice.id}</strong></p>
              <p className="invoice-date">Ngày tạo: {currentInvoice.date}</p>
            </div>

            <div className="invoice-user-info">
              <p><strong>Khách hàng:</strong> {currentInvoice.customer}</p>
              <p><strong>SĐT:</strong> {currentInvoice.phone}</p>
              <p><strong>Địa chỉ:</strong> {currentInvoice.address}</p>
              <p><strong>Hình thức:</strong> {currentInvoice.paymentMethod}</p>
              <p><strong>Trạng thái:</strong> <span className="status-paid">Đã tạo đơn thành công</span></p>
            </div>

            <table className="invoice-table">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Màu</th>
                  <th>SL</th>
                  <th>Đơn giá</th>
                </tr>
              </thead>
              <tbody>
                {currentInvoice.items.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.name}</td>
                    <td>{item.color}</td>
                    <td>{item.quantity}</td>
                    <td>{(item.rawPrice * item.quantity).toLocaleString('vi-VN')}đ</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="invoice-total">
              <span>Tổng cộng:</span>
              <strong>{currentInvoice.totalAmount.toLocaleString('vi-VN')}đ</strong>
            </div>

            <div className="invoice-actions">
              <button className="print-btn" onClick={() => window.print()}>
                🖨️ In / Lưu Hóa Đơn
              </button>
              <button className="done-btn" onClick={() => setCurrentInvoice(null)}>
                Hoàn tất
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL XÁC NHẬN ĐĂNG XUẤT */}
      {showLogoutConfirm && (
        <div className="modal-overlay" onClick={() => setShowLogoutConfirm(false)}>
          <div className="confirm-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon"></div>
            <h3>Xác nhận đăng xuất</h3>
            <p>Bạn có chắc chắn muốn đăng xuất không?</p>
            <div className="confirm-actions">
              <button className="confirm-btn-yes" onClick={confirmLogout}>
                Có, đăng xuất
              </button>
              <button className="confirm-btn-no" onClick={() => setShowLogoutConfirm(false)}>
                Không
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}