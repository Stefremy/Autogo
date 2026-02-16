const fs = require('fs');
const path = require('path');

const carsPath = path.join(__dirname, '../data/cars.json');
const cars = JSON.parse(fs.readFileSync(carsPath, 'utf8'));

let updatedCount = 0;

function updatePath(p) {
    if (typeof p === 'string' && p.startsWith('/images/')) {
        if (p.endsWith('.jpg') || p.endsWith('.jpeg') || p.endsWith('.png')) {
            return p.replace(/\.(jpg|jpeg|png)$/, '.webp');
        }
    }
    return p;
}

cars.forEach(car => {
    const originalImage = car.image;
    car.image = updatePath(car.image);
    if (car.image !== originalImage) updatedCount++;

    if (car.images && Array.isArray(car.images)) {
        car.images = car.images.map(img => {
            const newPath = updatePath(img);
            if (newPath !== img) updatedCount++;
            return newPath;
        });
    }
});

fs.writeFileSync(carsPath, JSON.stringify(cars, null, 2));
console.log(`Updated ${updatedCount} image paths in cars.json to .webp`);
