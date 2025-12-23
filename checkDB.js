const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/houplatform')
  .then(async () => {
    console.log('=== IMAGE AUDIT REPORT ===\n');
    
    const HouseDetail = require('./models/HouseDetail');
    
    // Count houses with and without images
    const totalHouses = await HouseDetail.countDocuments();
    const housesWithImages = await HouseDetail.countDocuments({ images: { $exists: true, $ne: [] } });
    const housesWithoutImages = totalHouses - housesWithImages;
    
    console.log(`Total Houses: ${totalHouses}`);
    console.log(`Houses WITH images: ${housesWithImages}`);
    console.log(`Houses WITHOUT images: ${housesWithoutImages}`);
    
    // Show all unique image filenames referenced in DB
    const allHouses = await HouseDetail.find({ images: { $exists: true, $ne: [] } });
    const uniqueImages = new Set();
    allHouses.forEach(h => h.images.forEach(img => uniqueImages.add(img)));
    
    console.log(`\nUnique image files referenced: ${uniqueImages.size}`);
    console.log('Image files:', Array.from(uniqueImages).join(', '));
    
    // Show sample houses without images
    const housesNoImages = await HouseDetail.find({ $or: [{ images: { $exists: false } }, { images: [] }] }).limit(5);
    console.log(`\nSample houses WITHOUT images:`);
    housesNoImages.forEach((h, i) => {
      console.log(`${i+1}. ${h.title} - ${h.location}`);
    });
    
    // Show all houses WITH images
    console.log(`\nAll houses WITH images:`);
    allHouses.forEach((h, i) => {
      console.log(`${i+1}. ${h.title}: [${h.images.join(', ')}]`);
    });
    
    mongoose.connection.close();
  })
  .catch(err => console.error('Error:', err));
