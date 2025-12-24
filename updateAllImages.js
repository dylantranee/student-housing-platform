const mongoose = require('mongoose');
const HouseDetail = require('./src/modules/listings/models/houseDetail.model');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/houplatform', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// The 3 images we have
const availableImages = ['house1.png', 'house2.png', 'house3.png'];

async function updateAllHousesWithImages() {
  try {
    console.log('Updating all houses with cycling images...\n');
    
    // Get all houses
    const allHouses = await HouseDetail.find();
    console.log(`Found ${allHouses.length} houses`);
    
    let updated = 0;
    
    // Update each house with cycling images
    for (let i = 0; i < allHouses.length; i++) {
      const house = allHouses[i];
      
      // Cycle through images based on index
      // Every house gets 1-3 images
      const numImages = (i % 3) + 1; // 1, 2, or 3 images
      const images = [];
      
      for (let j = 0; j < numImages; j++) {
        images.push(availableImages[(i + j) % 3]);
      }
      
      // Update the house
      await HouseDetail.findByIdAndUpdate(house._id, { images });
      updated++;
      
      if (updated % 20 === 0) {
        console.log(`Updated ${updated}/${allHouses.length} houses...`);
      }
    }
    
    console.log(`\n✅ Successfully updated ${updated} houses with images`);
    
    // Show summary
    const housesWithImages = await HouseDetail.countDocuments({ images: { $exists: true, $ne: [] } });
    console.log(`\nFinal count: ${housesWithImages} houses now have images`);
    
    // Show sample
    const samples = await HouseDetail.find({ images: { $exists: true, $ne: [] } }).limit(5);
    console.log('\nSample houses:');
    samples.forEach((h, i) => {
      console.log(`${i+1}. ${h.title}: [${h.images.join(', ')}]`);
    });
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    mongoose.connection.close();
  }
}

updateAllHousesWithImages();
