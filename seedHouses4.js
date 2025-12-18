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
    title: "Đất cao tốc Long Thành - Dầu Giây - An Phước",
    location: "Cao tốc HCM - Long Thành - Dầu Giây, Xã An Phước, Đồng Nai",
    price: 11000000,
    bedrooms: 1,
    bathrooms: 1,
    area: 550,
    description: "Đất mặt tiền cao tốc, tiềm năng phát triển cao",
    images: [],
    lat: 10.792476086806117,
    lng: 106.87675648562268
  },
  {
    title: "Nhà phố Tân Tạo - Khu dân cư",
    location: "Phường Tân Tạo, Thành phố Hồ Chí Minh",
    price: 7500000,
    bedrooms: 3,
    bathrooms: 2,
    area: 82,
    description: "Nhà đẹp, khu dân cư sầm uất, gần chợ",
    images: [],
    lat: 10.75637589026896,
    lng: 106.57893878350329
  },
  {
    title: "Nhà kho gần Cảng Tân Cảng - Phú Hữu",
    location: "Cảng Tân Cảng, Phường Long Trường, Thủ Đức",
    price: 10800000,
    bedrooms: 1,
    bathrooms: 2,
    area: 420,
    description: "Nhà kho rộng, gần cảng, thuận tiện vận chuyển",
    images: [],
    lat: 10.776837687344454,
    lng: 106.80805208110583
  },
  {
    title: "Đất nông nghiệp Long Hiệu - Nhơn Trạch",
    location: "Long Hiệu, Xã Nhơn Trạch, Tỉnh Đồng Nai",
    price: 4400000,
    bedrooms: 2,
    bathrooms: 1,
    area: 300,
    description: "Đất nông nghiệp, đất tốt, nguồn nước dồi dào",
    images: [],
    lat: 10.770689800716925,
    lng: 106.88228123787003
  },
  {
    title: "Nhà hẻm Lạc Long Quân - Hòa Bình",
    location: "Hẻm A-B Lạc Long Quân, Phường Hòa Bình, TP.HCM",
    price: 6900000,
    bedrooms: 2,
    bathrooms: 2,
    area: 68,
    description: "Nhà trong hẻm yên tĩnh, giá tốt",
    images: [],
    lat: 10.772662626348982,
    lng: 106.64353533911247
  },
  {
    title: "Căn hộ Long Bình - Gần KCN Hi-Tech",
    location: "Phường Long Bình, Thành phố Hồ Chí Minh",
    price: 9500000,
    bedrooms: 3,
    bathrooms: 2,
    area: 85,
    description: "Căn hộ mới, gần khu công nghệ cao",
    images: [],
    lat: 10.828324331300381,
    lng: 106.83954645400365
  },
  {
    title: "Đất vườn Rạch Kiến - Tây Ninh",
    location: "Xã Rạch Kiến, Tỉnh Tây Ninh",
    price: 2600000,
    bedrooms: 1,
    bathrooms: 1,
    area: 380,
    description: "Đất vườn rộng, giá rẻ, không khí trong lành",
    images: [],
    lat: 10.631581545073866,
    lng: 106.56786069438274
  },
  {
    title: "Nhà đất Cần Giuộc - Giá hợp lý",
    location: "Xã Cần Giuộc, Tỉnh Tây Ninh",
    price: 4700000,
    bedrooms: 3,
    bathrooms: 2,
    area: 135,
    description: "Nhà đất đẹp, khu vực đang phát triển",
    images: [],
    lat: 10.625113313591664,
    lng: 106.64029089953475
  },
  {
    title: "Biệt thự Đông Thạnh - Không gian xanh",
    location: "Xã Đông Thạnh, Thành phố Hồ Chí Minh",
    price: 10300000,
    bedrooms: 5,
    bathrooms: 4,
    area: 220,
    description: "Biệt thự sang trọng, vườn rộng, yên tĩnh",
    images: [],
    lat: 10.881625213794827,
    lng: 106.61570615239155
  },
  {
    title: "Đất thổ cư Phước Lý - Tây Ninh",
    location: "Xã Phước Lý, Tỉnh Tây Ninh",
    price: 3900000,
    bedrooms: 2,
    bathrooms: 1,
    area: 160,
    description: "Đất nền đẹp, sổ hồng riêng",
    images: [],
    lat: 10.633087288734297,
    lng: 106.60936465632342
  },
  {
    title: "Căn hộ Liên Phường - Bình Trưng",
    location: "Liên Phường, Phường Bình Trưng, Thủ Đức",
    price: 9200000,
    bedrooms: 3,
    bathrooms: 2,
    area: 86,
    description: "Căn hộ đẹp, khu vực phát triển mạnh",
    images: [],
    lat: 10.800339232089005,
    lng: 106.76121498498217
  },
  {
    title: "Nhà hẻm Bình Hưng Hòa - Đường Số 12",
    location: "Hẻm 73 Đường Số 12, Phường Bình Hưng Hòa, TP.HCM",
    price: 6200000,
    bedrooms: 2,
    bathrooms: 2,
    area: 72,
    description: "Nhà nhỏ xinh, giá tốt, gần chợ",
    images: [],
    lat: 10.781342456034004,
    lng: 106.6138632039168
  },
  {
    title: "Nhà vườn Phước Lý - Đại Phước",
    location: "Đường Lý Thái Tổ, Xã Đại Phước, Đồng Nai",
    price: 8400000,
    bedrooms: 4,
    bathrooms: 3,
    area: 175,
    description: "Nhà vườn đẹp, view hồ, không gian rộng",
    images: [],
    lat: 10.72904807578257,
    lng: 106.82553367439459
  },
  {
    title: "Đất Rạch Bảy - Đại Phước",
    location: "Rạch Bảy, Xã Đại Phước, Tỉnh Đồng Nai",
    price: 5800000,
    bedrooms: 2,
    bathrooms: 2,
    area: 150,
    description: "Đất đẹp, khu vực yên tĩnh",
    images: [],
    lat: 10.725707906444867,
    lng: 106.7580580290831
  },
  {
    title: "Biệt thự Đông Thạnh - Cao cấp",
    location: "Xã Đông Thạnh, Thành phố Hồ Chí Minh",
    price: 11400000,
    bedrooms: 5,
    bathrooms: 4,
    area: 240,
    description: "Biệt thự cao cấp, thiết kế hiện đại",
    images: [],
    lat: 10.899332601718463,
    lng: 106.6681904885703
  },
  {
    title: "Nhà phố An Nhơn - Thuận An",
    location: "Phường An Nhơn, Thuận An, Thành phố Hồ Chí Minh",
    price: 8900000,
    bedrooms: 3,
    bathrooms: 2,
    area: 88,
    description: "Nhà mới xây, khu dân cư đông đúc",
    images: [],
    lat: 10.842955470959861,
    lng: 106.68613552224568
  },
  {
    title: "Căn hộ Lavila Nam Sài Gòn - Nhà Bè",
    location: "Đường Số 7, Lavila Nam Sài Gòn, Xã Nhà Bè",
    price: 9800000,
    bedrooms: 2,
    bathrooms: 2,
    area: 74,
    description: "Căn hộ trong dự án cao cấp Lavila",
    images: [],
    lat: 10.693525086679049,
    lng: 106.72447451190627
  },
  {
    title: "Đất nông nghiệp Rạch Kiến",
    location: "Xã Rạch Kiến, Tỉnh Tây Ninh",
    price: 2200000,
    bedrooms: 1,
    bathrooms: 1,
    area: 420,
    description: "Đất rộng, giá siêu rẻ, phù hợp đầu tư",
    images: [],
    lat: 10.605555168472428,
    lng: 106.5639558143875
  },
  {
    title: "Đất Phước An - Đồng Nai",
    location: "Xã Phước An, Tỉnh Đồng Nai",
    price: 5300000,
    bedrooms: 2,
    bathrooms: 1,
    area: 190,
    description: "Đất đẹp, khu vực đang phát triển",
    images: [],
    lat: 10.648971808738727,
    lng: 106.88039717419365
  },
  {
    title: "Nhà vườn Hưng Long - Hóc Hưu",
    location: "Tổ 3 Hóc Hưu, Xã Hưng Long, TP.HCM",
    price: 6600000,
    bedrooms: 3,
    bathrooms: 2,
    area: 155,
    description: "Nhà vườn yên tĩnh, không khí trong lành",
    images: [],
    lat: 10.640046702777791,
    lng: 106.6343849911077
  },
  {
    title: "Nhà hẻm Bình Quới - Thủ Đức",
    location: "Hẻm 435 Bình Quới, Phường Bình Quới, Thủ Đức",
    price: 7600000,
    bedrooms: 3,
    bathrooms: 2,
    area: 80,
    description: "Nhà trong hẻm rộng, ô tô vào được",
    images: [],
    lat: 10.83193482259911,
    lng: 106.74060998150858
  },
  {
    title: "Đất ven sông Bình Khánh - Bình Thạnh",
    location: "Trần Quang Quờn, Ấp Bình Thạnh, Xã Bình Khánh",
    price: 8200000,
    bedrooms: 3,
    bathrooms: 2,
    area: 195,
    description: "Đất ven sông, view đẹp, mát mẻ",
    images: [],
    lat: 10.616480648055793,
    lng: 106.7783591340848
  },
  {
    title: "Nhà vườn Rạch Bảy",
    location: "Rạch Bảy, Xã Đại Phước, Tỉnh Đồng Nai",
    price: 7000000,
    bedrooms: 3,
    bathrooms: 2,
    area: 168,
    description: "Nhà vườn rộng, có ao cá, vườn cây",
    images: [],
    lat: 10.725384503805754,
    lng: 106.7647620889664
  },
  {
    title: "Đất Đại Phước - Đồng Nai",
    location: "Xã Đại Phước, Tỉnh Đồng Nai",
    price: 5600000,
    bedrooms: 2,
    bathrooms: 2,
    area: 145,
    description: "Đất đẹp, giá hợp lý, sổ hồng sẵn",
    images: [],
    lat: 10.648802217770577,
    lng: 106.85700365988062
  },
  {
    title: "Nhà phố Nguyễn Thị Minh Khai - Bàn Cờ",
    location: "Nguyễn Thị Minh Khai, Phường Bàn Cờ, Thủ Đức",
    price: 9100000,
    bedrooms: 4,
    bathrooms: 3,
    area: 94,
    description: "Nhà đẹp, vị trí trung tâm, giao thông thuận",
    images: [],
    lat: 10.772418738761608,
    lng: 106.68812351510577
  },
  {
    title: "Nhà vườn Tân Nhựt - Ấp 6",
    location: "Ấp 6, Xã Tân Nhựt, Thành phố Hồ Chí Minh",
    price: 6400000,
    bedrooms: 3,
    bathrooms: 2,
    area: 162,
    description: "Nhà vườn yên tĩnh, giá tốt",
    images: [],
    lat: 10.729258031358018,
    lng: 106.55077997265994
  },
  {
    title: "Đất ven biển An Phước - Bình Khánh",
    location: "Ấp An Phước, Xã Bình Khánh, TP.HCM",
    price: 9600000,
    bedrooms: 3,
    bathrooms: 2,
    area: 210,
    description: "Đất ven sông, view đẹp, phù hợp xây resort",
    images: [],
    lat: 10.606405662084063,
    lng: 106.84878182302994
  },
  {
    title: "Nhà hẻm Thoại Ngọc Hầu - Phú Thạnh",
    location: "Hẻm 205 Thoại Ngọc Hầu, Phường Phú Thạnh, TP.HCM",
    price: 7200000,
    bedrooms: 3,
    bathrooms: 2,
    area: 78,
    description: "Nhà trong hẻm, gần chợ, trường học",
    images: [],
    lat: 10.779295847195634,
    lng: 106.63222604158247
  },
  {
    title: "Nhà phố Trường Chinh - Đông Hưng Thuận",
    location: "Trường Chinh, Phường Đông Hưng Thuận, Thuận An",
    price: 8600000,
    bedrooms: 3,
    bathrooms: 2,
    area: 87,
    description: "Nhà mới, khu dân cư văn minh",
    images: [],
    lat: 10.831857944893873,
    lng: 106.62268304224264
  },
  {
    title: "Căn hộ Chung Cư Giai Việt - Chánh Hưng",
    location: "CC Giai Việt, Tạ Quang Bửu, Phường Chánh Hưng",
    price: 10200000,
    bedrooms: 3,
    bathrooms: 2,
    area: 82,
    description: "Căn hộ cao cấp Giai Việt, đầy đủ tiện ích",
    images: [],
    lat: 10.736264836662402,
    lng: 106.668084112055
  },
  {
    title: "Nhà phố Tân Thuận - Đường số 13",
    location: "Đường số 13, Phường Tân Thuận, Thủ Đức",
    price: 8800000,
    bedrooms: 3,
    bathrooms: 2,
    area: 85,
    description: "Nhà đẹp, gần cảng, thuận tiện kinh doanh",
    images: [],
    lat: 10.753994081459274,
    lng: 106.7442352989147
  },
  {
    title: "Căn hộ Long Bình - Đường Số 21",
    location: "Đường Số 21, Phường Long Bình, TP.HCM",
    price: 9400000,
    bedrooms: 2,
    bathrooms: 2,
    area: 75,
    description: "Căn hộ mới, khu an ninh tốt",
    images: [],
    lat: 10.841968613308829,
    lng: 106.82995274087737
  },
  {
    title: "Nhà phố Bình Đường 3 - Dĩ An",
    location: "Bình Đường 3, Phường Dĩ An, Thủ Đức",
    price: 8300000,
    bedrooms: 3,
    bathrooms: 2,
    area: 84,
    description: "Nhà mới xây, hẻm rộng",
    images: [],
    lat: 10.866334419887528,
    lng: 106.75248996207563
  },
  {
    title: "Căn hộ Long Trường - Thủ Đức",
    location: "Phường Long Trường, Thủ Đức, TP.HCM",
    price: 7800000,
    bedrooms: 2,
    bathrooms: 2,
    area: 70,
    description: "Căn hộ đẹp, gần cảng Phú Hữu",
    images: [],
    lat: 10.776843184075664,
    lng: 106.80287704293681
  },
  {
    title: "Đất Lương Hòa - Tây Ninh",
    location: "Xã Lương Hòa, Tỉnh Tây Ninh",
    price: 2500000,
    bedrooms: 1,
    bathrooms: 1,
    area: 400,
    description: "Đất rộng, giá rẻ nhất khu vực",
    images: [],
    lat: 10.679661717935316,
    lng: 106.5333870216181
  },
  {
    title: "Nhà xưởng KCN Tân Tạo - Đường Số 3",
    location: "Đường Số 3, KCN Tân Tạo, Phường Tân Tạo",
    price: 11200000,
    bedrooms: 1,
    bathrooms: 2,
    area: 480,
    description: "Nhà xưởng trong KCN, điện nước đầy đủ",
    images: [],
    lat: 10.742849523470227,
    lng: 106.59452401711984
  },
  {
    title: "Đất Hiệp Phước - Giá tốt",
    location: "Xã Hiệp Phước, Thành phố Hồ Chí Minh",
    price: 4000000,
    bedrooms: 2,
    bathrooms: 1,
    area: 210,
    description: "Đất đẹp, giá đầu tư tốt",
    images: [],
    lat: 10.653382125136629,
    lng: 106.72443383304665
  },
  {
    title: "Đất Tân Vĩnh Lộc - Rộng rãi",
    location: "Xã Tân Vĩnh Lộc, Thành phố Hồ Chí Minh",
    price: 5400000,
    bedrooms: 2,
    bathrooms: 2,
    area: 175,
    description: "Đất rộng, sổ đỏ chính chủ",
    images: [],
    lat: 10.814132085338787,
    lng: 106.52146755245613
  },
  {
    title: "Đất Cần Giuộc - Đường Tỉnh 826D",
    location: "Đường Tỉnh 826D, Xã Cần Giuộc, Tây Ninh",
    price: 3600000,
    bedrooms: 2,
    bathrooms: 1,
    area: 185,
    description: "Đất mặt tiền đường tỉnh, tiềm năng cao",
    images: [],
    lat: 10.60193908437676,
    lng: 106.70274322291067
  },
  {
    title: "Nhà phố Trần Đại Nghĩa - Tân Tạo",
    location: "Trần Đại Nghĩa, Phường Tân Tạo, TP.HCM",
    price: 8100000,
    bedrooms: 3,
    bathrooms: 2,
    area: 83,
    description: "Nhà đẹp, gần KCN Tân Tạo",
    images: [],
    lat: 10.725312480311702,
    lng: 106.5930539042937
  },
  {
    title: "Nhà phố Đông Hưng Thuận - Khu phố 68",
    location: "Khu phố 68, Phường Đông Hưng Thuận, Thuận An",
    price: 8700000,
    bedrooms: 3,
    bathrooms: 2,
    area: 86,
    description: "Nhà mới, khu dân cư đông đúc",
    images: [],
    lat: 10.841705606756838,
    lng: 106.63186095387861
  },
  {
    title: "Đất vườn Tân Vĩnh Lộc",
    location: "Xã Tân Vĩnh Lộc, Thành phố Hồ Chí Minh",
    price: 4500000,
    bedrooms: 2,
    bathrooms: 1,
    area: 230,
    description: "Đất vườn rộng, yên tĩnh",
    images: [],
    lat: 10.787111080468948,
    lng: 106.52644185333287
  },
  {
    title: "Nhà vườn Bình Hưng - Ấp 53",
    location: "Ấp 53, Xã Bình Hưng, Thành phố Hồ Chí Minh",
    price: 6800000,
    bedrooms: 3,
    bathrooms: 2,
    area: 160,
    description: "Nhà vườn đẹp, có ao cá",
    images: [],
    lat: 10.682006101320786,
    lng: 106.6645024412068
  },
  {
    title: "Căn hộ Tăng Nhơn Phú - Phước Long",
    location: "367 Đường Tăng Nhơn Phú, Phường Phước Long, Thủ Đức",
    price: 9900000,
    bedrooms: 3,
    bathrooms: 2,
    area: 88,
    description: "Căn hộ cao cấp, view đẹp",
    images: [],
    lat: 10.827337345848411,
    lng: 106.77142577264513
  },
  {
    title: "Nhà phố Nguyễn Văn Bá - Thủ Đức",
    location: "Nguyễn Văn Bá, Phường Thủ Đức, Thủ Đức",
    price: 10500000,
    bedrooms: 4,
    bathrooms: 3,
    area: 96,
    description: "Nhà mặt tiền đẹp, vị trí đắc địa",
    images: [],
    lat: 10.83742526715939,
    lng: 106.76642040269095
  },
  {
    title: "Căn hộ Long Hưng - Đồng Nai",
    location: "Khu phố 6, Phường Long Hưng, Đồng Nai",
    price: 7700000,
    bedrooms: 2,
    bathrooms: 2,
    area: 71,
    description: "Căn hộ mới, khu an ninh tốt",
    images: [],
    lat: 10.89644341276975,
    lng: 106.87199305154364
  },
  {
    title: "Đất Bình Lợi - Ấp 16",
    location: "Ấp 16, Xã Bình Lợi, Thành phố Hồ Chí Minh",
    price: 3400000,
    bedrooms: 2,
    bathrooms: 1,
    area: 240,
    description: "Đất rộng, giá hợp lý",
    images: [],
    lat: 10.747002271504668,
    lng: 106.52334616735112
  },
  {
    title: "Đất Đất Mới - Nhơn Trạch",
    location: "Đất Mới, Xã Nhơn Trạch, Tỉnh Đồng Nai",
    price: 5100000,
    bedrooms: 2,
    bathrooms: 2,
    area: 180,
    description: "Đất nền đẹp, khu vực phát triển",
    images: [],
    lat: 10.738712657317686,
    lng: 106.89855525637705
  },
  {
    title: "Nhà gần Trường Quốc tế Đài Loan - Tân Mỹ",
    location: "Đường Số 18, Phường Tân Mỹ, TP.HCM",
    price: 9300000,
    bedrooms: 4,
    bathrooms: 3,
    area: 92,
    description: "Nhà gần trường quốc tế, môi trường tốt",
    images: [],
    lat: 10.72255627687803,
    lng: 106.73152880736924
  },
  {
    title: "Nhà phố Đông Hưng Thuận 8",
    location: "Đông Hưng Thuận 8, Khu phố 64, Phường Đông Hưng Thuận",
    price: 8400000,
    bedrooms: 3,
    bathrooms: 2,
    area: 85,
    description: "Nhà đẹp, khu dân cư sầm uất",
    images: [],
    lat: 10.83668109923243,
    lng: 106.62824044521598
  }
];

async function seedDatabase() {
  try {
    // Insert new data (not clearing old data)
    const result = await HouseDetail.insertMany(houses);
    console.log(`Successfully inserted ${result.length} new houses`);
    
    // Count total houses
    const totalCount = await HouseDetail.countDocuments();
    console.log(`Total houses in database: ${totalCount}`);
    
    console.log('\n=== Sample of newly inserted data ===');
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
