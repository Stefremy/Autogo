const fs = require('fs');
const path = require('path');

const idsToUpdate = [
    "5729674", "6192748", "6225001", "6288801",
    "6375512", "6500195", "6546207", "6546346"
];

const filePath = path.join(__dirname, '../data/cars.json');

try {
    const data = fs.readFileSync(filePath, 'utf8');
    const cars = JSON.parse(data);

    let updatedCount = 0;

    const updatedCars = cars.map(car => {
        if (idsToUpdate.includes(car.id)) {
            car.status = "Vendido";
            updatedCount++;
        }
        return car;
    });

    fs.writeFileSync(filePath, JSON.stringify(updatedCars, null, 2));

    console.log(`Successfully updated ${updatedCount} cars to 'Vendido'.`);

    // Check if all were updated
    if (updatedCount < idsToUpdate.length) {
        console.log(`Warning: Only updated ${updatedCount} out of ${idsToUpdate.length} IDs.`);
    }

} catch (err) {
    console.error("Error processing file:", err);
    process.exit(1);
}
