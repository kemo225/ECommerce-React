const fs = require('fs');

const dirs = [
  'src/schemas',
  'src/components/forms',
  'src/pages/AdminDashboard/TripsAdmin/CreateTrip',
  'src/pages/AdminDashboard/TripsAdmin/EditTrip'
];

dirs.forEach(dir => {
  try {
    fs.mkdirSync(dir, { recursive: true });
    console.log('✓ Created:', dir);
  } catch (error) {
    console.error('✗ Failed to create:', dir, error.message);
  }
});

console.log('\nAll directories created successfully!');
