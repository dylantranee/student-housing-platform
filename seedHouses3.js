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
    title: "Nhà phố Tân Tạo - Gần KCN",
    location: "Phường Tân Tạo, Thành phố Hồ Chí Minh",
    price: 7300000,
    bedrooms: 3,
    bathrooms: 2,
    area: 80,
    description: "Nhà gần khu công nghiệp, thuận tiện đi làm",
    images: [],
    lat: 10.741557783437457,
    lng: 106.55938955963059
  },
  {
    title: "Nhà kho Bến Cộ - Đại Phước",
    location: "Bến Cộ, Xã Đại Phước, Tỉnh Đồng Nai",
    price: 9200000,
    bedrooms: 1,
    bathrooms: 2,
    area: 400,
    description: "Kho bãi rộng, gần cảng, vận chuyển thuận tiện",
    images: [],
    lat: 10.752699405958387,
    lng: 106.81076156546818
  },
  {
    title: "Đất vườn Xã Rạch Kiến - Giá rẻ",
    location: "Xã Rạch Kiến, Tỉnh Tây Ninh",
    price: 2400000,
    bedrooms: 1,
    bathrooms: 1,
    area: 350,
    description: "Đất rộng, giá tốt, phù hợp làm nông nghiệp",
    images: [],
    lat: 10.608371505635914,
    lng: 106.58196220206095
  },
  {
    title: "Biệt thự Xuân Thới Sơn",
    location: "Xã Xuân Thới Sơn, Thành phố Hồ Chí Minh",
    price: 10700000,
    bedrooms: 5,
    bathrooms: 4,
    area: 200,
    description: "Biệt thự sang trọng, không gian rộng rãi",
    images: [],
    lat: 10.871955210798106,
    lng: 106.54946407150526
  },
  {
    title: "Đất nông nghiệp Rạch Kiến",
    location: "Xã Rạch Kiến, Tỉnh Tây Ninh",
    price: 2100000,
    bedrooms: 1,
    bathrooms: 1,
    area: 400,
    description: "Đất nông nghiệp giá siêu tốt",
    images: [],
    lat: 10.617375527892607,
    lng: 106.56537185770941
  },
  {
    title: "Nhà phố An Lạc - KCN Tân Tạo",
    location: "Đường 17A, Phường An Lạc, TP.HCM",
    price: 8600000,
    bedrooms: 4,
    bathrooms: 3,
    area: 95,
    description: "Nhà mới, gần KCN, tiện đi làm",
    images: [],
    lat: 10.7419378292899,
    lng: 106.60800285746178
  },
  {
    title: "Căn hộ gần BIDV Lê Quang Định",
    location: "1 Lê Quang Định, Phường Bình Lợi Trung, Thủ Đức",
    price: 9400000,
    bedrooms: 3,
    bathrooms: 2,
    area: 85,
    description: "Căn hộ đẹp, gần ngân hàng, trung tâm thành phố",
    images: [],
    lat: 10.803641125063557,
    lng: 106.69781735358062
  },
  {
    title: "Nhà vườn Rạch Bảy - Đại Phước",
    location: "Rạch Bảy, Xã Đại Phước, Đồng Nai",
    price: 6900000,
    bedrooms: 3,
    bathrooms: 2,
    area: 170,
    description: "Nhà vườn yên tĩnh, không khí trong lành",
    images: [],
    lat: 10.724011602237434,
    lng: 106.7864619553302
  },
  {
    title: "Căn hộ Long Hưng - Đồng Nai",
    location: "Khu phố 6, Phường Long Hưng, Đồng Nai",
    price: 7800000,
    bedrooms: 2,
    bathrooms: 2,
    area: 68,
    description: "Căn hộ mới, khu dân cư văn minh",
    images: [],
    lat: 10.896114950183497,
    lng: 106.87595103893061
  },
  {
    title: "Đất vườn Lương Hòa - Tây Ninh",
    location: "Xã Lương Hòa, Tỉnh Tây Ninh",
    price: 2000000,
    bedrooms: 1,
    bathrooms: 1,
    area: 500,
    description: "Đất giá rẻ nhất, phù hợp đầu tư",
    images: [],
    lat: 10.70545045143696,
    lng: 106.5089436853063
  },
  {
    title: "Nhà đất Cần Giuộc",
    location: "Xã Cần Giuộc, Tỉnh Tây Ninh",
    price: 4600000,
    bedrooms: 3,
    bathrooms: 2,
    area: 140,
    description: "Nhà đất đẹp, khu vực phát triển",
    images: [],
    lat: 10.620918344372784,
    lng: 106.65322258294259
  },
  {
    title: "Đất thổ cư Mỹ Hạnh",
    location: "Xã Mỹ Hạnh, Tỉnh Tây Ninh",
    price: 5200000,
    bedrooms: 2,
    bathrooms: 2,
    area: 120,
    description: "Đất nền sổ đỏ, giá đầu tư tốt",
    images: [],
    lat: 10.859331942156238,
    lng: 106.5177700378199
  },
  {
    title: "Đất KCN Long Hậu 1",
    location: "KCN Long Hậu 1, Xã Cần Giuộc, Tây Ninh",
    price: 8900000,
    bedrooms: 1,
    bathrooms: 1,
    area: 300,
    description: "Đất trong KCN, phù hợp xây xưởng",
    images: [],
    lat: 10.638118837947612,
    lng: 106.71429637130213
  },
  {
    title: "Nhà phố Bình Trưng - Thủ Đức",
    location: "95 Đường số 8B, Phường Bình Trưng, Thủ Đức",
    price: 9100000,
    bedrooms: 4,
    bathrooms: 3,
    area: 90,
    description: "Nhà đẹp, gần cửa hàng xe đạp",
    images: [],
    lat: 10.799426818389676,
    lng: 106.73720181971153
  },
  {
    title: "Nhà vườn Ấp Bình Lợi",
    location: "Ấp Bình Lợi, Xã Bình Khánh, TP.HCM",
    price: 7100000,
    bedrooms: 3,
    bathrooms: 2,
    area: 160,
    description: "Nhà vườn rộng, view đẹp",
    images: [],
    lat: 10.62164668509787,
    lng: 106.84144198283501
  },
  {
    title: "Đất nông nghiệp Mỹ Yên",
    location: "Đường tỉnh 830C, Xã Lương Hòa, Tây Ninh",
    price: 3200000,
    bedrooms: 2,
    bathrooms: 1,
    area: 280,
    description: "Đất nông nghiệp, đất màu mỡ",
    images: [],
    lat: 10.683893617161615,
    lng: 106.54758002820945
  },
  {
    title: "Nhà vườn Phước Lương - Đại Phước",
    location: "Phước Lương, Xã Đại Phước, Đồng Nai",
    price: 8300000,
    bedrooms: 4,
    bathrooms: 2,
    area: 180,
    description: "Nhà vườn đẹp, không gian xanh",
    images: [],
    lat: 10.746546464354237,
    lng: 106.78341378385421
  },
  {
    title: "Đất ven sông Lòng Tàu",
    location: "Ấp Lòng Tàu, Xã Bình Khánh, TP.HCM",
    price: 9800000,
    bedrooms: 3,
    bathrooms: 2,
    area: 200,
    description: "Đất ven sông, view đẹp, mát mẻ",
    images: [],
    lat: 10.637055141098417,
    lng: 106.80480968540652
  },
  {
    title: "Nhà phố Trung Mỹ Tây - Thuận An",
    location: "Khu phố 18, Phường Trung Mỹ Tây, Thuận An",
    price: 8800000,
    bedrooms: 3,
    bathrooms: 2,
    area: 85,
    description: "Nhà mới xây, hẻm rộng",
    images: [],
    lat: 10.858512234697848,
    lng: 106.61532823262075
  },
  {
    title: "Nhà xưởng An Lạc - Gần SINCO",
    location: "Đường SINCO, Phường An Lạc, TP.HCM",
    price: 10900000,
    bedrooms: 1,
    bathrooms: 2,
    area: 450,
    description: "Nhà xưởng rộng, điện nước đầy đủ",
    images: [],
    lat: 10.735629936529163,
    lng: 106.60486729022725
  },
  {
    title: "Nhà hẻm Tô Hiến Thành - Diên Hồng",
    location: "Hẻm 473 Tô Hiến Thành, Phường Diên Hồng, Thủ Đức",
    price: 7700000,
    bedrooms: 3,
    bathrooms: 2,
    area: 75,
    description: "Nhà trong hẻm yên tĩnh, an ninh tốt",
    images: [],
    lat: 10.774035691302773,
    lng: 106.66186817586988
  },
  {
    title: "Căn hộ Lạc Long Quân - Bình Thới",
    location: "Hẻm 26A Lạc Long Quân, Phường Bình Thới, TP.HCM",
    price: 6800000,
    bedrooms: 2,
    bathrooms: 2,
    area: 65,
    description: "Căn hộ đẹp, giá tốt, gần chợ",
    images: [],
    lat: 10.75932366097317,
    lng: 106.64144486094197
  },
  {
    title: "Nhà phố Trung Mỹ Tây",
    location: "Khu phố 9, Phường Trung Mỹ Tây, Thuận An",
    price: 8100000,
    bedrooms: 3,
    bathrooms: 2,
    area: 82,
    description: "Nhà mới, khu dân cư đông đúc",
    images: [],
    lat: 10.851685406414314,
    lng: 106.61486886847382
  },
  {
    title: "Nhà xưởng KCN Tân Tạo",
    location: "Đường Số 2, KCN Tân Tạo, Phường Tân Tạo",
    price: 11500000,
    bedrooms: 1,
    bathrooms: 2,
    area: 500,
    description: "Nhà xưởng trong KCN, vị trí đẹp",
    images: [],
    lat: 10.732756683700952,
    lng: 106.59929781095259
  },
  {
    title: "Đất nông nghiệp Thành Công - Phước An",
    location: "Thành Công, Xã Phước An, Đồng Nai",
    price: 4100000,
    bedrooms: 2,
    bathrooms: 1,
    area: 320,
    description: "Đất nông nghiệp, đất tốt, giá hợp lý",
    images: [],
    lat: 10.68452094889039,
    lng: 106.86128623795962
  },
  {
    title: "Đất cao tốc Bến Lức - Long Thành",
    location: "Cao tốc Bến Lức - Long Thành, Xã Hiệp Phước",
    price: 10400000,
    bedrooms: 1,
    bathrooms: 1,
    area: 600,
    description: "Đất gần cao tốc, tiềm năng cao",
    images: [],
    lat: 10.664749798607055,
    lng: 106.70905768083578
  },
  {
    title: "Căn hộ Phước Hội - Long Hưng",
    location: "Phước Hội, Phường Long Hưng, Đồng Nai",
    price: 7500000,
    bedrooms: 2,
    bathrooms: 2,
    area: 70,
    description: "Căn hộ mới, khu an ninh tốt",
    images: [],
    lat: 10.87543391047832,
    lng: 106.86177122766229
  },
  {
    title: "Nhà hẻm Phạm Hùng - Bình Hưng",
    location: "Hẻm C4 Phạm Hùng, Xã Bình Hưng, TP.HCM",
    price: 6300000,
    bedrooms: 3,
    bathrooms: 2,
    area: 78,
    description: "Nhà trong hẻm, gần chợ trường",
    images: [],
    lat: 10.730786349313364,
    lng: 106.67277092458727
  },
  {
    title: "Nhà đường Nguyễn Bình - Hiệp Phước",
    location: "Nguyễn Bình, Xã Hiệp Phước, TP.HCM",
    price: 5900000,
    bedrooms: 3,
    bathrooms: 2,
    area: 80,
    description: "Nhà gần chợ, tiện ích đầy đủ",
    images: [],
    lat: 10.685519347983888,
    lng: 106.69381653561851
  },
  {
    title: "Căn hộ Nguyễn Văn Hưởng - An Khánh",
    location: "Nguyễn Văn Hưởng, Phường An Khánh, Thủ Đức",
    price: 9600000,
    bedrooms: 3,
    bathrooms: 2,
    area: 88,
    description: "Căn hộ cao cấp, khu vực phát triển",
    images: [],
    lat: 10.804255566757261,
    lng: 106.72631312656587
  },
  {
    title: "Đất thổ cư Tân Vĩnh Lộc",
    location: "Xã Tân Vĩnh Lộc, Thành phố Hồ Chí Minh",
    price: 5500000,
    bedrooms: 2,
    bathrooms: 2,
    area: 130,
    description: "Đất nền đẹp, sổ đỏ chính chủ",
    images: [],
    lat: 10.782990120734244,
    lng: 106.56845579878292
  },
  {
    title: "Nhà phố Tân Thuận - Gần cảng",
    location: "Đường số 3, Phường Tân Thuận, TP.HCM",
    price: 8700000,
    bedrooms: 4,
    bathrooms: 3,
    area: 92,
    description: "Nhà gần cảng Cát Lái, tiện kinh doanh",
    images: [],
    lat: 10.754890139182564,
    lng: 106.73557330242441
  },
  {
    title: "Đất vườn Đông Thạnh",
    location: "Xã Đông Thạnh, Thành phố Hồ Chí Minh",
    price: 4800000,
    bedrooms: 2,
    bathrooms: 1,
    area: 250,
    description: "Đất vườn rộng, yên tĩnh",
    images: [],
    lat: 10.879178027523531,
    lng: 106.61708217735438
  },
  {
    title: "Nhà KDC Long Hậu",
    location: "Đường D8, KDC TĐC Long Hậu, Xã Cần Giuộc",
    price: 7900000,
    bedrooms: 3,
    bathrooms: 2,
    area: 85,
    description: "Nhà trong khu dân cư, an ninh tốt",
    images: [],
    lat: 10.627129854068604,
    lng: 106.72763580314918
  },
  {
    title: "Căn hộ An Phú Đông - Thủ Đức",
    location: "Khu phố 21, Phường An Phú Đông, Thủ Đức",
    price: 8400000,
    bedrooms: 2,
    bathrooms: 2,
    area: 72,
    description: "Căn hộ mới, gần chợ siêu thị",
    images: [],
    lat: 10.856966329804429,
    lng: 106.71291092683936
  },
  {
    title: "Đất Tân Vĩnh Lộc - Giá tốt",
    location: "Xã Tân Vĩnh Lộc, Thành phố Hồ Chí Minh",
    price: 4300000,
    bedrooms: 2,
    bathrooms: 1,
    area: 180,
    description: "Đất rộng, giá đầu tư tốt",
    images: [],
    lat: 10.781496421884441,
    lng: 106.53940944887871
  },
  {
    title: "Nhà phố Thủ Đức - Đường Số 11",
    location: "Đường Số 11, Phường Thủ Đức, Thủ Đức",
    price: 10100000,
    bedrooms: 4,
    bathrooms: 3,
    area: 100,
    description: "Nhà mặt tiền, vị trí đẹp",
    images: [],
    lat: 10.844055425879034,
    lng: 106.75315701579619
  },
  {
    title: "Nhà hẻm Phạm Thế Hiển - Bình Đông",
    location: "Hẻm 2941/32 Phạm Thế Hiển, Phường Bình Đông",
    price: 6600000,
    bedrooms: 3,
    bathrooms: 2,
    area: 76,
    description: "Nhà trong hẻm yên tĩnh",
    images: [],
    lat: 10.717086258020407,
    lng: 106.63378222369528
  },
  {
    title: "Nhà gần Trường Lê Văn Sỹ",
    location: "322 Nguyễn Trọng Tuyển, Phường Tân Sơn Hòa, Thủ Đức",
    price: 9300000,
    bedrooms: 4,
    bathrooms: 3,
    area: 95,
    description: "Nhà gần trường học, môi trường tốt",
    images: [],
    lat: 10.798269127208686,
    lng: 106.66737101519249
  },
  {
    title: "Căn hộ Green Square - Dĩ An",
    location: "Đường GS 01, Green Square, Phường Dĩ An",
    price: 10600000,
    bedrooms: 3,
    bathrooms: 2,
    area: 80,
    description: "Căn hộ trong khu cao cấp Green Square",
    images: [],
    lat: 10.895304175347425,
    lng: 106.76826416166737
  },
  {
    title: "Đất Hiệp Phước - Giá rẻ",
    location: "Xã Hiệp Phước, Thành phố Hồ Chí Minh",
    price: 3800000,
    bedrooms: 2,
    bathrooms: 1,
    area: 220,
    description: "Đất rộng, giá tốt để đầu tư",
    images: [],
    lat: 10.653103679016276,
    lng: 106.7125639943253
  },
  {
    title: "Đất vườn Vĩnh Lộc",
    location: "Xã Vĩnh Lộc, Thành phố Hồ Chí Minh",
    price: 5100000,
    bedrooms: 2,
    bathrooms: 2,
    area: 150,
    description: "Đất vườn đẹp, sổ hồng sẵn",
    images: [],
    lat: 10.8366703781328,
    lng: 106.56370861106059
  },
  {
    title: "Nhà KCN Hi-Tech - Long Bình",
    location: "Đường D1, KCN Hi-Tech, Phường Long Bình",
    price: 11900000,
    bedrooms: 1,
    bathrooms: 2,
    area: 350,
    description: "Nhà trong khu công nghệ cao, vị trí đắc địa",
    images: [],
    lat: 10.833238142105658,
    lng: 106.82093640019298
  },
  {
    title: "Nhà phố Thạnh Mỹ Tây - Thủ Đức",
    location: "Khu phố 75, Phường Thạnh Mỹ Tây, Thủ Đức",
    price: 8200000,
    bedrooms: 3,
    bathrooms: 2,
    area: 83,
    description: "Nhà mới, khu dân cư sầm uất",
    images: [],
    lat: 10.809155930966151,
    lng: 106.7184741476187
  },
  {
    title: "Căn hộ Long Phước - Đường N7",
    location: "Đường N7, Phường Long Phước, TP.HCM",
    price: 9700000,
    bedrooms: 3,
    bathrooms: 2,
    area: 86,
    description: "Căn hộ đẹp, khu vực phát triển mạnh",
    images: [],
    lat: 10.816725009867692,
    lng: 106.817737291841
  },
  {
    title: "Nhà phố Bình Trưng - Đường Số 5",
    location: "Đường Số 5, Phường Bình Trưng, Thủ Đức",
    price: 9000000,
    bedrooms: 3,
    bathrooms: 2,
    area: 84,
    description: "Nhà đẹp, gần bệnh viện, trường học",
    images: [],
    lat: 10.776106151275938,
    lng: 106.77479963056099
  },
  {
    title: "Nhà vườn Lòng Tàu - Bình Khánh",
    location: "Ấp Lòng Tàu, Xã Bình Khánh, TP.HCM",
    price: 7200000,
    bedrooms: 3,
    bathrooms: 2,
    area: 165,
    description: "Nhà vườn rộng, view sông đẹp",
    images: [],
    lat: 10.636620669995764,
    lng: 106.8157186737166
  },
  {
    title: "Nhà phố Hiệp Bình - Thủ Đức",
    location: "Đường số 48, Phường Hiệp Bình, Thủ Đức",
    price: 8500000,
    bedrooms: 3,
    bathrooms: 2,
    area: 87,
    description: "Nhà mới xây, hẻm rộng, ô tô vào được",
    images: [],
    lat: 10.838746933435935,
    lng: 106.72618968812068
  },
  {
    title: "Nhà hẻm Thống Nhất - An Hội Đông",
    location: "Hẻm 778/32/27 Thống Nhất, Phường An Hội Đông",
    price: 7400000,
    bedrooms: 3,
    bathrooms: 2,
    area: 79,
    description: "Nhà trong hẻm, an ninh tốt, gần chợ",
    images: [],
    lat: 10.85327268289634,
    lng: 106.6667414252329
  },
  {
    title: "Nhà hẻm Phạm Đăng Giảng - Bình Hưng Hòa",
    location: "Hẻm 205 Phạm Đăng Giảng, Phường Bình Hưng Hòa",
    price: 6500000,
    bedrooms: 2,
    bathrooms: 2,
    area: 70,
    description: "Nhà nhỏ xinh, giá tốt, phù hợp gia đình nhỏ",
    images: [],
    lat: 10.813155830946789,
    lng: 106.60421875079713
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
