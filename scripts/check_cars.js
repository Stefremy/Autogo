const fs = require('fs');
const path = require('path');

const idsToCheck = [
    "5711442", "5729674", "5729674", "5993065", "6030092",
    "6086761", "6105974", "6122583", "6150533", "6162384",
    "6192748", "6192825", "6219104", "6225001", "6226653",
    "6232992", "6249313", "6259568", "6259889", "6260999",
    "6272036", "6288801", "6297200", "6298280", "6299900",
    "6300291", "6309539", "6328598", "6330295", "6332849",
    "6343965", "6355050", "6360915", "6366916", "6371658",
    "6375512", "6381217", "6381823", "6382849", "6398078",
    "6402203", "6403676", "6407539", "6412309", "6417435",
    "6497942", "6500195", "6507257", "6507331", "6514098",
    "6515350", "6546207", "6546346"
];

// Deduplicate
const uniqueIds = [...new Set(idsToCheck)];

const filePath = path.join(__dirname, '../data/cars.json');

try {
    const data = fs.readFileSync(filePath, 'utf8');
    const cars = JSON.parse(data);

    console.log(`Checking ${uniqueIds.length} unique IDs against ${cars.length} total cars.`);

    const found = [];
    const missing = [];

    uniqueIds.forEach(id => {
        const car = cars.find(c => c.id === id);
        if (car) {
            found.push(id);
        } else {
            missing.push(id);
        }
    });

    if (found.length > 0) {
        console.log("\n✅ FOUND IDs:");
        found.forEach(id => console.log(id));
    } else {
        console.log("\n❌ No IDs found.");
    }

    // console.log("\nMISSING IDs:");
    // missing.forEach(id => console.log(id));

} catch (err) {
    console.error("Error processing file:", err);
}
