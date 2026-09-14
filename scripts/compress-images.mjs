import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const ROOT_DIR = path.resolve(__dirname, '..')
const ASSETS_DIR = path.join(ROOT_DIR, 'src', 'assets', 'images')
const SRC_DIR = path.join(ROOT_DIR, 'src')
const SIZE_THRESHOLD_BYTES = 600 * 1024 // 600 KB
const WEBP_QUALITY = 82 // >= 80% per requirements

/**
 * Format bytes into human-readable string (KB / MB)
 */
function formatBytes(bytes) {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }
  return `${(bytes / 1024).toFixed(1)} KB`
}

/**
 * Recursively find all files in a directory matching extensions
 */
function getFilesRecursively(dir, extensions = ['.png', '.jpg', '.jpeg']) {
  let results = []
  if (!fs.existsSync(dir)) return results

  const list = fs.readdirSync(dir)
  for (const file of list) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(filePath, extensions))
    } else {
      const ext = path.extname(file).toLowerCase()
      if (extensions.includes(ext)) {
        results.push(filePath)
      }
    }
  }
  return results
}

/**
 * Update import statements across all source files from old extension to .webp
 */
function updateSourceImports(replacements) {
  const sourceFiles = getFilesRecursively(SRC_DIR, ['.ts', '.tsx', '.js', '.jsx', '.css'])
  let totalUpdatedFiles = 0

  for (const srcFile of sourceFiles) {
    let content = fs.readFileSync(srcFile, 'utf8')
    let fileChanged = false

    for (const { oldName, newName } of replacements) {
      if (content.includes(oldName)) {
        content = content.replaceAll(oldName, newName)
        fileChanged = true
      }
    }

    if (fileChanged) {
      fs.writeFileSync(srcFile, content, 'utf8')
      totalUpdatedFiles++
    }
  }

  return totalUpdatedFiles
}

/**
 * Main compression pipeline
 */
async function runImageCompression() {
  console.log('\n========================================')
  console.log('🚀 Pearl University - Image Compression')
  console.log(`📁 Target Directory: ${ASSETS_DIR}`)
  console.log(`⚖️ Threshold: > ${formatBytes(SIZE_THRESHOLD_BYTES)} (600 KB)`)
  console.log(`✨ Output Quality: ${WEBP_QUALITY}% WebP`)
  console.log('========================================\n')

  const imageFiles = getFilesRecursively(ASSETS_DIR)
  const replacements = []
  let totalOriginalSize = 0
  let totalCompressedSize = 0
  let processedCount = 0

  for (const imagePath of imageFiles) {
    const stats = fs.statSync(imagePath)
    const originalSize = stats.size
    const ext = path.extname(imagePath)
    const baseName = path.basename(imagePath, ext)
    const dirName = path.dirname(imagePath)
    const webpPath = path.join(dirName, `${baseName}.webp`)

    totalOriginalSize += originalSize

    // Check if file exceeds the 600 KB threshold
    if (originalSize > SIZE_THRESHOLD_BYTES) {
      console.log(`📸 Compressing: ${path.basename(imagePath)} (${formatBytes(originalSize)})`)

      const image = sharp(imagePath)
      const metadata = await image.metadata()

      // Max width constraint of 2560px for extreme photos to optimize rendering while preserving crystal-clear sharpness
      let pipeline = image
      if (metadata.width && metadata.width > 2560) {
        pipeline = pipeline.resize({ width: 2560, withoutEnlargement: true })
      }

      await pipeline
        .webp({
          quality: WEBP_QUALITY,
          effort: 6,
          smartSubsample: true,
        })
        .toFile(webpPath)

      const compressedStats = fs.statSync(webpPath)
      const compressedSize = compressedStats.size
      totalCompressedSize += compressedSize
      processedCount++

      const savings = originalSize - compressedSize
      const percentReduction = ((savings / originalSize) * 100).toFixed(1)

      console.log(
        `   ↳ ✅ Generated ${path.basename(webpPath)}: ${formatBytes(compressedSize)} (Saved ${formatBytes(savings)} / -${percentReduction}%)\n`
      )

      replacements.push({
        oldName: path.basename(imagePath),
        newName: `${baseName}.webp`,
        oldPath: imagePath,
        newPath: webpPath,
      })
    } else {
      totalCompressedSize += originalSize
      console.log(`⏭️  Skipped: ${path.basename(imagePath)} (${formatBytes(originalSize)} <= 600 KB)`)
    }
  }

  // Update source imports if new WebP files were generated
  if (replacements.length > 0) {
    console.log('\n🔄 Updating codebase imports to use compressed .webp assets...')
    const updatedFilesCount = updateSourceImports(replacements)
    console.log(`✨ Updated imports across ${updatedFilesCount} source files.`)

    // Remove the large uncompressed legacy files
    for (const { oldPath } of replacements) {
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath)
        console.log(`🗑️  Removed uncompressed legacy asset: ${path.basename(oldPath)}`)
      }
    }
  }

  const overallSavings = totalOriginalSize - totalCompressedSize
  const overallPercent = ((overallSavings / totalOriginalSize) * 100).toFixed(1)

  console.log('\n========================================')
  console.log('🎉 Compression Summary:')
  console.log(`• Files Processed: ${processedCount}`)
  console.log(`• Original Total Size: ${formatBytes(totalOriginalSize)}`)
  console.log(`• Optimized Total Size: ${formatBytes(totalCompressedSize)}`)
  console.log(`• Total Space Saved: ${formatBytes(overallSavings)} (-${overallPercent}%)`)
  console.log('========================================\n')
}

runImageCompression().catch((err) => {
  console.error('❌ Error during image compression:', err)
  process.exit(1)
})
