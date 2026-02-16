const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const BACKUP_DIR = path.join(process.cwd(), 'backup');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');

const EXTENSIONS = ['.jpg', '.jpeg', '.png'];

function getAllImages(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            getAllImages(filePath, fileList);
        } else {
            const ext = path.extname(file).toLowerCase();
            if (EXTENSIONS.includes(ext)) {
                fileList.push(filePath);
            }
        }
    });
    return fileList;
}

async function optimizeImages() {
    if (!fs.existsSync(IMAGES_DIR)) {
        console.log('No public/images directory found.');
        return;
    }

    console.log(`Scanning ${IMAGES_DIR}...`);
    const images = getAllImages(IMAGES_DIR);
    console.log(`Found ${images.length} images to optimize.`);

    let savedBytes = 0;

    for (const imagePath of images) {
        const relativePath = path.relative(PUBLIC_DIR, imagePath);
        const backupPath = path.join(BACKUP_DIR, relativePath);
        const backupDir = path.dirname(backupPath);

        // Create backup directory structure
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }

        // Backup original
        fs.copyFileSync(imagePath, backupPath);

        const ext = path.extname(imagePath);
        const basename = path.basename(imagePath, ext);
        const dir = path.dirname(imagePath);
        const webpPath = path.join(dir, `${basename}.webp`);

        try {
            const originalStats = fs.statSync(imagePath);

            // Convert to WebP with proper color space handling
            await sharp(imagePath)
                .rotate() // Auto-rotate based on EXIF
                .toColorspace('srgb') // Ensure sRGB color space to prevent "green" tint on CMYK images
                .webp({ quality: 75 })
                .toFile(webpPath);

            const newStats = fs.statSync(webpPath);
            const savings = originalStats.size - newStats.size;
            savedBytes += savings;

            console.log(`Optimized: ${relativePath} -> ${path.relative(PUBLIC_DIR, webpPath)} (${(savings / 1024).toFixed(2)} KB saved)`);

            // Delete original only if WebP was created successfully and is different file
            if (imagePath !== webpPath) {
                fs.unlinkSync(imagePath);
            }

        } catch (error) {
            console.error(`Error optimizing ${relativePath}:`, error);
        }
    }

    console.log('-----------------------------------');
    console.log(`Optimization complete.`);
    console.log(`Total space saved: ${(savedBytes / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Originals backed up to: ${BACKUP_DIR}`);
}

optimizeImages();
