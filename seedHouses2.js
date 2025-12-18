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
    title: "Đất ven biển Ấp An Phước - Bình Khánh",
    location: "Ấp An Phước, Xã Bình Khánh, Thành phố Hồ Chí Minh",
    price: 11900000,
    bedrooms: 4,
    bathrooms: 3,
    area: 280,
    description: "Đất ven sông, view đẹp, phù hợp xây resort nghỉ dưỡng",
    images: [],
    lat: 10.604861207844515,
    lng: 106.84424933502044
  },
  {
    title: "Nhà hẻm Xã Nhà Bè - Giá tốt",
    location: "Hẻm 15, Xã Nhà Bè, Thành phố Hồ Chí Minh",
    price: 5600000,
    bedrooms: 3,
    bathrooms: 2,
    area: 70,
    description: "Nhà trong hẻm yên tĩnh, gần chợ và trường học",
    images: [],
    lat: 10.688784643781643,
    lng: 106.7123080761072
  },
  {
    title: "Căn hộ gần Cầu Kỳ Hà - Cát Lái",
    location: "Cầu Kỳ Hà 1, Phường Cát Lái, Thành phố Hồ Chí Minh",
    price: 8100000,
    bedrooms: 3,
    bathrooms: 2,
    area: 78,
    description: "Căn hộ view cầu, giao thông thuận lợi, gần cảng",
    images: [],
    lat: 10.754638909526028,
    lng: 106.75839327001798
  },
  {
    title: "Nhà vườn Ấp Bình Lợi - Bình Khánh",
    location: "Ấp Bình Lợi, Xã Bình Khánh, Thành phố Hồ Chí Minh",
    price: 8700000,
    bedrooms: 4,
    bathrooms: 2,
    area: 190,
    description: "Nhà vườn rộng, có ao cá, vườn cây xanh mát",
    images: [],
    lat: 10.625032026874038,
    lng: 106.83982626972578
  },
  {
    title: "Đất nông nghiệp Đoàn Kết - Phước An",
    location: "Đoàn Kết, Xã Phước An, Tỉnh Đồng Nai",
    price: 4500000,
    bedrooms: 2,
    bathrooms: 1,
    area: 350,
    description: "Đất nông nghiệp rộng, đất màu mỡ, có nguồn nước tốt",
    images: [],
    lat: 10.68785563206982,
    lng: 106.89903399588405
  },
  {
    title: "Nhà phố Bình Quới - Gần chợ",
    location: "Hẻm 558/50 Bình Quới, Phường Bình Quới, Thủ Đức",
    price: 7900000,
    bedrooms: 3,
    bathrooms: 2,
    area: 82,
    description: "Nhà đẹp trong hẻm, gần chợ, an ninh tốt",
    images: [],
    lat: 10.8251454279095,
    lng: 106.74379127686308
  },
  {
    title: "Mặt tiền Xa lộ Hà Nội - Đông Hòa",
    location: "Ngã ba Tân Vạn, Xa lộ Hà Nội, Đông Hòa",
    price: 11700000,
    bedrooms: 5,
    bathrooms: 4,
    area: 150,
    description: "Mặt tiền đẹp, vị trí đắc địa, kinh doanh sầm uất",
    images: [],
    lat: 10.89752716896777,
    lng: 106.82895477775223
  },
  {
    title: "Đất vườn Xã Rạch Kiến - Tây Ninh",
    location: "Xã Rạch Kiến, Tỉnh Tây Ninh",
    price: 2800000,
    bedrooms: 2,
    bathrooms: 1,
    area: 400,
    description: "Đất vườn rộng, yên tĩnh, phù hợp làm trang trại",
    images: [],
    lat: 10.616080491644787,
    lng: 106.58488497313576
  },
  {
    title: "Nhà gần Trường Kim Đồng - Tân Thuận",
    location: "Đường N2, Phường Tân Thuận, Thành phố Hồ Chí Minh",
    price: 6800000,
    bedrooms: 3,
    bathrooms: 2,
    area: 75,
    description: "Nhà gần trường học, môi trường giáo dục tốt",
    images: [],
    lat: 10.747878632767874,
    lng: 106.72534121728157
  },
  {
    title: "Đất thổ cư Xã Hưng Long",
    location: "Xã Hưng Long, Thành phố Hồ Chí Minh",
    price: 4900000,
    bedrooms: 3,
    bathrooms: 2,
    area: 140,
    description: "Đất nền đẹp, sổ hồng sẵn, giá hợp lý",
    images: [],
    lat: 10.629165123620734,
    lng: 106.63695735325129
  },
  {
    title: "Nhà kho Bến Ngự - Đại Phước",
    location: "Bến Ngự, Xã Đại Phước, Tỉnh Đồng Nai",
    price: 10800000,
    bedrooms: 1,
    bathrooms: 2,
    area: 450,
    description: "Nhà kho rộng, gần bến cảng, thuận tiện vận chuyển",
    images: [],
    lat: 10.713914138605972,
    lng: 106.80955948541948
  },
  {
    title: "Nhà vườn Giồng Ông Đông - Đại Phước",
    location: "Giồng Ông Đông, Xã Đại Phước, Đồng Nai",
    price: 8500000,
    bedrooms: 4,
    bathrooms: 3,
    area: 200,
    description: "Nhà vườn đẹp, không gian xanh, yên tĩnh",
    images: [],
    lat: 10.720973017820752,
    lng: 106.79819226860077
  },
  {
    title: "Đất nông nghiệp Xã Lương Hòa - Tây Ninh",
    location: "Xã Lương Hòa, Tỉnh Tây Ninh",
    price: 2300000,
    bedrooms: 1,
    bathrooms: 1,
    area: 500,
    description: "Đất rộng, giá rẻ, phù hợp đầu tư dài hạn",
    images: [],
    lat: 10.662833032261208,
    lng: 106.52647712747239
  },
  {
    title: "Mặt tiền Nguyễn Văn Linh - Tân Mỹ",
    location: "Nguyễn Văn Linh, Phường Tân Mỹ, TP.HCM",
    price: 11300000,
    bedrooms: 5,
    bathrooms: 4,
    area: 135,
    description: "Mặt tiền đường lớn, vị trí đẹp, kinh doanh tốt",
    images: [],
    lat: 10.729923854912132,
    lng: 106.71808996009617
  },
  {
    title: "Nhà hẻm Phạm Hữu Lầu - Nhà Bè",
    location: "Hẻm 360 Phạm Hữu Lầu, Xã Nhà Bè, TP.HCM",
    price: 6400000,
    bedrooms: 3,
    bathrooms: 2,
    area: 73,
    description: "Nhà trong hẻm yên tĩnh, gần chợ và bệnh viện",
    images: [],
    lat: 10.712870842932663,
    lng: 106.72110764500752
  },
  {
    title: "Đất ven sông Trần Quang Quờn - Bình Khánh",
    location: "Trần Quang Quờn, Ấp Bình Thạnh, Bình Khánh",
    price: 9900000,
    bedrooms: 4,
    bathrooms: 2,
    area: 220,
    description: "Đất ven sông, view đẹp, mát mẻ quanh năm",
    images: [],
    lat: 10.633119020830296,
    lng: 106.77425981727885
  },
  {
    title: "Nhà xưởng Bến Đình - Đại Phước",
    location: "Bến Đình, Xã Đại Phước, Tỉnh Đồng Nai",
    price: 11600000,
    bedrooms: 1,
    bathrooms: 2,
    area: 650,
    description: "Nhà xưởng sẵn, điện 3 pha, gần cảng",
    images: [],
    lat: 10.705541202304323,
    lng: 106.8200710880231
  },
  {
    title: "Căn hộ Bình Quới - Thủ Đức",
    location: "Hẻm 558/64/27 Bình Quới, Phường Bình Quới, Thủ Đức",
    price: 6700000,
    bedrooms: 2,
    bathrooms: 2,
    area: 66,
    description: "Căn hộ mới, nội thất cơ bản, giá tốt",
    images: [],
    lat: 10.814394728859495,
    lng: 106.74645008585726
  },
  {
    title: "Nhà phố gần BV Lê Văn Thịnh",
    location: "130 Lê Văn Thịnh, Phường Bình Trưng, Thủ Đức",
    price: 9600000,
    bedrooms: 4,
    bathrooms: 3,
    area: 92,
    description: "Nhà gần bệnh viện, trường học, an ninh tốt",
    images: [],
    lat: 10.782596231335743,
    lng: 106.76889532403834
  },
  {
    title: "Đất công nghiệp Nguyễn Ái Quốc - Nhơn Trạch",
    location: "Nguyễn Ái Quốc, Xã Nhơn Trạch, Đồng Nai",
    price: 10300000,
    bedrooms: 1,
    bathrooms: 1,
    area: 750,
    description: "Đất công nghiệp, mặt tiền đường lớn, vị trí đẹp",
    images: [],
    lat: 10.701500882397228,
    lng: 106.86872778264141
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
