const fs = require('fs');
const path = require('path');

const projectPath = "c:\\Users\\NVIDIA PLUS\\OneDrive - South Valley University\\Desktop\\React Project 1.worktrees\\agents-trips-module-integration-react-ts\\reactproject";

const directories = [
    "src/schemas",
    "src/components/forms",
    "src/components/ui",
    "src/utils",
    "src/pages/AdminDashboard/TripsAdmin/CreateTrip",
    "src/pages/AdminDashboard/TripsAdmin/EditTrip"
];

console.log("Creating directories...\n");

directories.forEach((dir) => {
    const fullPath = path.join(projectPath, dir);
    
    if (fs.existsSync(fullPath)) {
        console.log(`✓ [EXISTING] ${dir}`);
    } else {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`✓ [CREATED] ${dir}`);
    }
});

console.log("\nDirectory creation complete.");
