require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./src/modules/users/models/user.model');
const RoommateProfile = require('./src/modules/roommates/models/roommateProfile.model');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/houplatform';

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log(`Connected to MongoDB at ${MONGODB_URI}`))
.catch(err => console.error('MongoDB connection error:', err));

const dummyRoommates = [
  {
    name: 'Lê Minh Hoàng',
    email: 'hoang.le@student.edu.vn',
    password: 'password123',
    age: 21,
    phone: '0901234567',
    profile: {
      bio: 'Third-year CS student at IU. I love coding and evening coffee. Looking for someone with a similar "night owl" vibe to share a productive space.',
      studyProgram: 'Computer Science',
      university: 'International University - VNUHCM',
      profilePhoto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop',
      moveInDate: new Date('2025-12-25'),
      budgetMin: 3500000,
      budgetMax: 5000000,
      sleepSchedule: 'Night Owl',
      cleanliness: 2,
      noiseTolerance: 'Lively',
      smoking: 'No',
      socialPreference: 'Moderate',
      studyHabits: 'Study at home',
      preferredUniversities: ['International University - VNUHCM', 'University of Science - VNUHCM'],
      status: 'published'
    }
  },
  {
    name: 'Nguyễn Thu Hà',
    email: 'ha.nguyen@ueh.edu.vn',
    password: 'password123',
    age: 20,
    phone: '0912345678',
    profile: {
      bio: "Hi, I'm Ha! I'm a marketing student at UEH. I'm very social and love meeting new people. I'm looking for a friendly roommate who doesn't mind a bit of music and lively conversation.",
      studyProgram: 'Marketing',
      university: 'University of Economics Ho Chi Minh City',
      profilePhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      moveInDate: new Date('2026-01-10'),
      budgetMin: 4000000,
      budgetMax: 6000000,
      sleepSchedule: 'Flexible',
      cleanliness: 3,
      noiseTolerance: 'Moderate',
      smoking: 'No',
      socialPreference: 'Very social',
      studyHabits: 'Library',
      preferredUniversities: ['University of Economics Ho Chi Minh City', 'Foreign Trade University'],
      status: 'published'
    }
  },
  {
    name: 'Phạm Anh Đức',
    email: 'duc.pham@fpt.edu.vn',
    password: 'password123',
    age: 22,
    phone: '0987654321',
    profile: {
      bio: 'Graphic designer at FPT. I prefer a quiet and peaceful environment to focus on my creative work. I have a cat and value a tidy living space.',
      studyProgram: 'Graphic Design',
      university: 'FPT University',
      profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      moveInDate: new Date('2026-01-05'),
      budgetMin: 5000000,
      budgetMax: 8000000,
      sleepSchedule: 'Early Bird',
      cleanliness: 3,
      noiseTolerance: 'Quiet',
      smoking: 'No',
      socialPreference: 'Prefer privacy',
      studyHabits: 'Study at home',
      preferredUniversities: ['FPT University', 'RMIT University Vietnam'],
      status: 'published'
    }
  },
  {
    name: 'Trần Bảo Nhi',
    email: 'nhi.tran@rmit.edu.vn',
    password: 'password123',
    age: 19,
    phone: '0933445566',
    profile: {
      bio: 'IU student looking for a calm roommate. I spend a lot of time at the gym and prefer a healthy, smoke-free lifestyle. Very disciplined with cleaning.',
      studyProgram: 'International Business',
      university: 'International University - VNUHCM',
      profilePhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
      moveInDate: new Date('2025-12-28'),
      budgetMin: 4000000,
      budgetMax: 7000000,
      sleepSchedule: 'Early Bird',
      cleanliness: 3,
      noiseTolerance: 'Quiet',
      smoking: 'No',
      socialPreference: 'Moderate',
      studyHabits: 'Library',
      preferredUniversities: ['International University - VNUHCM', 'Ton Duc Thang University'],
      status: 'published'
    }
  },
  {
    name: 'Đặng Quốc Việt',
    email: 'viet.dang@hcmut.edu.vn',
    password: 'password123',
    age: 23,
    phone: '0944556677',
    profile: {
      bio: "Just graduated and working as a junior dev. I'm a night owl and enjoy gaming. Looking for someone chill to share a place in District 9 near High-Tech Park.",
      studyProgram: 'Computer Science',
      university: 'University of Technology - VNUHCM',
      profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      moveInDate: new Date('2026-02-01'),
      budgetMin: 3000000,
      budgetMax: 4500000,
      sleepSchedule: 'Night Owl',
      cleanliness: 2,
      noiseTolerance: 'Moderate',
      smoking: 'No',
      socialPreference: 'Moderate',
      studyHabits: 'Study at home',
      preferredUniversities: ['University of Technology - VNUHCM', 'University of Science - VNUHCM'],
      status: 'published'
    }
  }
];

async function seedRoommates() {
  try {
    // Delete existing dummy roommates
    // We include both the legacy generic emails and the new realistic ones
    const oldDummyEmails = [
      'vana@example.com', 'thib@example.com', 'vanc@example.com', 
      'thid@example.com', 'vane@example.com'
    ];
    const currentDummyEmails = dummyRoommates.map(r => r.email);
    const allDummyEmails = [...oldDummyEmails, ...currentDummyEmails];
    const dummyPhones = dummyRoommates.map(r => r.phone);
    
    const usersToDelete = await User.find({ 
      $or: [
        { email: { $in: allDummyEmails } },
        { phone: { $in: dummyPhones } }
      ]
    });
    const userIdsToDelete = usersToDelete.map(u => u._id);
    
    await RoommateProfile.deleteMany({ userId: { $in: userIdsToDelete } });
    await User.deleteMany({ _id: { $in: userIdsToDelete } });
    
    console.log('Cleared all old and current dummy roommate data.');

    for (const data of dummyRoommates) {
      // Create user
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const user = new User({
        name: data.name,
        email: data.email,
        password: hashedPassword,
        age: data.age,
        phone: data.phone,
        roles: ['User']
      });
      await user.save();

      // Create roommate profile
      const profile = new RoommateProfile({
        userId: user._id,
        ...data.profile
      });
      await profile.save();
      
      console.log(`Created dummy roommate: ${data.name}`);
    }

    console.log('\nSeeding completed successfully!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding roommate data:', error);
    mongoose.connection.close();
  }
}

seedRoommates();
