const mongoose = require('mongoose');
const HouseDetail = require('./models/HouseDetail');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/houplatform', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

const houses = [
  {
    title: "Căn hộ cao cấp gần Bệnh viện Quân y 175",
    location: "786 Nguyễn Kiệm, Phường Hạnh Thông, Thủ Đức",
    price: 8500000,
    bedrooms: 3,
    bathrooms: 2,
    area: 85,
    description: "Căn hộ đẹp, gần bệnh viện, tiện ích đầy đủ, giao thông thuận lợi",
    images: [],
    lat: 10.818728567249268,
    lng: 106.68097396504166
  },
  {
    title: "Nhà đất Xã Nhà Bè - Vị trí đẹp",
    location: "Xã Nhà Bè, Thành phố Hồ Chí Minh",
    price: 6200000,
    bedrooms: 4,
    bathrooms: 3,
    area: 120,
    description: "Đất đẹp, khu vực yên tĩnh, phù hợp xây biệt thự",
    images: [],
    lat: 10.703383442197357,
    lng: 106.71910045888785
  },
  {
    title: "Nhà phố Cách Mạng Tháng 8 - Thủ Đức",
    location: "133 Cách Mạng Tháng 8, Phường Bàn Cờ, Thủ Đức",
    price: 9800000,
    bedrooms: 4,
    bathrooms: 3,
    area: 95,
    description: "Nhà phố đẹp, gần trung tâm điện máy, tiện kinh doanh",
    images: [],
    lat: 10.773882326536302,
    lng: 106.68852259535325
  },
  {
    title: "Đất nông nghiệp Xã Hiệp Phước",
    location: "Xã Hiệp Phước, Thành phố Hồ Chí Minh",
    price: 3500000,
    bedrooms: 2,
    bathrooms: 1,
    area: 200,
    description: "Đất rộng, giá tốt, phù hợp đầu tư dài hạn",
    images: [],
    lat: 10.663041919989375,
    lng: 106.70884231492283
  },
  {
    title: "Biệt thự Xã An Phước - Đồng Nai",
    location: "Ấp 1, Xã An Phước, Tỉnh Đồng Nai",
    price: 11500000,
    bedrooms: 5,
    bathrooms: 4,
    area: 250,
    description: "Biệt thự sang trọng, không gian rộng rãi, view đẹp",
    images: [],
    lat: 10.807708120536992,
    lng: 106.88731068437251
  },
  {
    title: "Nhà vườn Xã Tân Nhựt",
    location: "Ấp 35, Xã Tân Nhựt, Thành phố Hồ Chí Minh",
    price: 7200000,
    bedrooms: 3,
    bathrooms: 2,
    area: 180,
    description: "Nhà vườn yên tĩnh, không khí trong lành",
    images: [],
    lat: 10.717831592586423,
    lng: 106.59501646452371
  },
  {
    title: "Nhà đường Nguyễn Bình - Hiệp Phước",
    location: "Hẻm 796 Nguyễn Bình, Xã Hiệp Phước",
    price: 5800000,
    bedrooms: 3,
    bathrooms: 2,
    area: 75,
    description: "Nhà gần chợ, trường học, tiện ích xung quanh đầy đủ",
    images: [],
    lat: 10.678878835642216,
    lng: 106.71354436709882
  },
  {
    title: "Căn hộ Nguyễn Hữu Thọ - Nhà Bè",
    location: "Nguyễn Hữu Thọ, Xã Nhà Bè",
    price: 6500000,
    bedrooms: 2,
    bathrooms: 2,
    area: 68,
    description: "Căn hộ view sông, thoáng mát, giao thông thuận tiện",
    images: [],
    lat: 10.700321112363252,
    lng: 106.71502629903691
  },
  {
    title: "Đất công nghiệp KCN Xuyên Á - Tây Ninh",
    location: "Đường Số 3, KCN Xuyên Á, Xã Đức Lập, Tây Ninh",
    price: 10500000,
    bedrooms: 1,
    bathrooms: 1,
    area: 500,
    description: "Đất công nghiệp, vị trí đẹp trong KCN, phù hợp xây xưởng",
    images: [],
    lat: 10.893383424872676,
    lng: 106.53579613662993
  },
  {
    title: "Nhà phố Lê Văn Sỹ - Thủ Đức",
    location: "413/86 Hẻm 413 Lê Văn Sỹ, Phường Nhiêu Lộc, Thủ Đức",
    price: 8900000,
    bedrooms: 4,
    bathrooms: 3,
    area: 90,
    description: "Nhà gần trường học, an ninh tốt, khu dân cư văn minh",
    images: [],
    lat: 10.788267336983838,
    lng: 106.67531303288153
  },
  {
    title: "Căn hộ Khu ĐH Quốc Gia - Đông Hòa",
    location: "Hải Thượng Lãn Ông, KĐT ĐH Quốc Gia, Đông Hòa",
    price: 7600000,
    bedrooms: 2,
    bathrooms: 2,
    area: 72,
    description: "Căn hộ gần trường đại học, môi trường trẻ trung, hiện đại",
    images: [],
    lat: 10.885099976304742,
    lng: 106.79114605061432
  },
  {
    title: "Đất thổ cư Xã Bà Điểm",
    location: "Xã Bà Điểm, Thành phố Hồ Chí Minh",
    price: 6000000,
    bedrooms: 3,
    bathrooms: 2,
    area: 150,
    description: "Đất nền đẹp, sổ hồng riêng, giá đầu tư tốt",
    images: [],
    lat: 10.847846577277195,
    lng: 106.58396384056478
  },
  {
    title: "Nhà phố Ngô Chí Quốc - Thuận An",
    location: "Hẻm 99 Ngô Chí Quốc, Phường Tam Bình, Thuận An",
    price: 7400000,
    bedrooms: 3,
    bathrooms: 2,
    area: 80,
    description: "Nhà mới xây, hẻm rộng, ô tô vào tận nhà",
    images: [],
    lat: 10.882471874698695,
    lng: 106.71805860087667
  },
  {
    title: "Mặt tiền Võ Văn Kiệt - Phú Định",
    location: "Võ Văn Kiệt, Phường Phú Định",
    price: 12000000,
    bedrooms: 5,
    bathrooms: 4,
    area: 120,
    description: "Mặt tiền đẹp, thuận tiện kinh doanh, vị trí vàng",
    images: [],
    lat: 10.72865695086833,
    lng: 106.62441953009085
  },
  {
    title: "Đất nông nghiệp Xã Nhơn Trạch - Đồng Nai",
    location: "Xã Nhơn Trạch, Tỉnh Đồng Nai",
    price: 4200000,
    bedrooms: 2,
    bathrooms: 1,
    area: 300,
    description: "Đất vườn rộng, phù hợp làm trang trại, nghỉ dưỡng",
    images: [],
    lat: 10.759423983058404,
    lng: 106.85375648248974
  },
  {
    title: "Nhà xưởng Cát Lái - Đại Phước",
    location: "Cát Lái, Xã Đại Phước, Đồng Nai",
    price: 11800000,
    bedrooms: 1,
    bathrooms: 2,
    area: 800,
    description: "Nhà xưởng đã xây, điện nước đầy đủ, gần cảng",
    images: [],
    lat: 10.744671990876245,
    lng: 106.79437075359064
  },
  {
    title: "Căn hộ Bình Quới - Thủ Đức",
    location: "Hẻm 558/8 Bình Quới, Phường Bình Quới, Thủ Đức",
    price: 6100000,
    bedrooms: 2,
    bathrooms: 2,
    area: 65,
    description: "Căn hộ đẹp, yên tĩnh, an ninh tốt",
    images: [],
    lat: 10.828966379787598,
    lng: 106.74315876450333
  },
  {
    title: "Đất mặt tiền Thống Nhất - Phước An",
    location: "Thống Nhất, Xã Phước An, Đồng Nai",
    price: 10200000,
    bedrooms: 4,
    bathrooms: 3,
    area: 200,
    description: "Đất mặt tiền đường lớn, phù hợp xây khách sạn, nhà nghỉ",
    images: [],
    lat: 10.68230873776006,
    lng: 106.87598701361742
  },
  {
    title: "Đất cao tốc Long Thành - Dầu Giây",
    location: "Cao tốc HCM - Long Thành - Dầu Giây, Long Phước",
    price: 11200000,
    bedrooms: 1,
    bathrooms: 1,
    area: 600,
    description: "Đất vị trí đẹp gần cao tốc, tiềm năng phát triển cao",
    images: [],
    lat: 10.785179358431467,
    lng: 106.84968517746958
  },
  {
    title: "Nhà vườn Xã Vĩnh Lộc",
    location: "Xã Vĩnh Lộc, Thành phố Hồ Chí Minh",
    price: 7800000,
    bedrooms: 3,
    bathrooms: 2,
    area: 160,
    description: "Nhà vườn rộng rãi, có ao cá, vườn cây ăn trái",
    images: [],
    lat: 10.822096275766446,
    lng: 106.57047983693381
  }
];

async function seedDatabase() {
  try {
    // Clear existing data
    await HouseDetail.deleteMany({});
    console.log('Cleared existing house data');

    // Insert new data
    const result = await HouseDetail.insertMany(houses);
    console.log(`Successfully inserted ${result.length} houses`);
    
    console.log('\n=== Sample of inserted data ===');
    result.slice(0, 3).forEach((house, index) => {
      console.log(`\n${index + 1}. ${house.title}`);
      console.log(`   Location: ${house.location}`);
      console.log(`   Price: ${house.price.toLocaleString('vi-VN')} VNĐ`);
      console.log(`   Coordinates: ${house.lat}, ${house.lng}`);
    });

    mongoose.connection.close();
    console.log('\nDatabase connection closed');
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.connection.close();
  }
}

seedDatabase();
