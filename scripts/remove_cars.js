const fs = require('fs');
const path = require('path');

const idsToRemove = [
    "6449115", "6503682", "6513994", "6521857", "6526052",
    "6539353", "6547408", "6547412", "6555470", "6560821",
    "6579252", "6579384", "6579386", "6582483", "6614964",
    "6618143", "6618291", "6642025", "6649383", "6651365",
    "6652865", "6652908", "6656950", "6658409", "6658859",
    "6665339", "6665351", "6667509", "6667609", "6668815",
    "6672017", "6672344", "6672389", "6678446", "6700497",
    "6702121", "6708858", "6714778", "6715191", "6715292",
    "6721362", "6721387", "6726402", "6728366", "6730394",
    "6735539", "6737723"
];

const filePath = path.join(__dirname, '../data/cars.json');

try {
    const data = fs.readFileSync(filePath, 'utf8');
    const cars = JSON.parse(data);

    const originalCount = cars.length;
    const filteredCars = cars.filter(car => !idsToRemove.includes(car.id));
    const newCount = filteredCars.length;
    const removedCount = originalCount - newCount;

    fs.writeFileSync(filePath, JSON.stringify(filteredCars, null, 2));

    console.log(`Successfully removed ${removedCount} cars.`);
    console.log(`Original count: ${originalCount}`);
    console.log(`New count: ${newCount}`);

    // List IDs that were NOT found (optional check)
    if (removedCount < idsToRemove.length) {
        console.log("Warning: Not all IDs were found.");
    }

} catch (err) {
    console.error("Error processing file:", err);
    process.exit(1);
}
