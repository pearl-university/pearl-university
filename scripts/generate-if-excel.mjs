import path from 'node:path'
import { fileURLToPath } from 'node:url'
import ExcelJS from 'exceljs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const OUTPUT_DIR = path.resolve(__dirname, '..', '..', 'if')
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'contacts.xlsx')

const records = [
  // if-01.jpeg
  { sn: 1, category: 'Dress', name: 'Marycee Onuorah', phone: '09069179277', shopNo: 'F6, Opepe plaza, Kano strd.', source: 'if-01.jpeg' },
  { sn: 2, category: 'Dress', name: 'Elegance', phone: '08032065863', shopNo: '', source: 'if-01.jpeg' },
  { sn: 3, category: 'Shoes', name: 'Ngozi Mnecha', phone: '09064888027', shopNo: '', source: 'if-01.jpeg' },
  { sn: 4, category: 'Shoes', name: 'Emerald', phone: '07065342135', shopNo: '', source: 'if-01.jpeg' },
  { sn: 5, category: 'Watch', name: 'Ifeoma Jacinta', phone: '09039355181', shopNo: 'Kano plaza', source: 'if-01.jpeg' },
  { sn: 6, category: 'Bags', name: 'Grace Moses', phone: '08034187399', shopNo: '', source: 'if-01.jpeg' },
  { sn: 7, category: 'Rechargeable fans', name: 'Maky Naturals', phone: '09070059525', shopNo: '', source: 'if-01.jpeg' },
  { sn: 8, category: 'Unisex wears', name: 'Ani Chinemerem', phone: '08145497197', shopNo: '7B, Bright Street', source: 'if-01.jpeg' },
  { sn: 9, category: 'Men Wears', name: 'Nnadi Valerian', phone: '08144950515', shopNo: '', source: 'if-01.jpeg' },
  { sn: 10, category: 'Men Wears', name: 'Cynthia Oly Emmanuel', phone: '07033988501', shopNo: 'No 5, Haruna Street', source: 'if-01.jpeg' },
  { sn: 11, category: 'Fabric', name: 'Nwankwo Obioma', phone: '08103624877', shopNo: '', source: 'if-01.jpeg' },
  { sn: 12, category: 'Shoes & Bag', name: 'Okafor Mercy', phone: '07085462670', shopNo: '', source: 'if-01.jpeg' },
  { sn: 13, category: 'Shoes & Bag', name: 'Juliet Amaonye', phone: '08162076621', shopNo: '', source: 'if-01.jpeg' },
  { sn: 14, category: 'Footwears', name: 'Adaobi Cynthia', phone: '08139087537', shopNo: 'Kano plaza', source: 'if-01.jpeg' },
  { sn: 15, category: 'Footwears', name: 'Chinwendu Chikezia', phone: '09121154767', shopNo: 'Sokoto road, Important line 1', source: 'if-01.jpeg' },
  { sn: 16, category: 'Phones', name: 'Frank Obiajulu', phone: '08120490856', shopNo: 'Emeka offor', source: 'if-01.jpeg' },
  { sn: 17, category: 'Skincare', name: 'Ngozika Oranu', phone: '08060996987', shopNo: 'C7, Kano street', source: 'if-01.jpeg' },
  { sn: 18, category: 'Fashion wears', name: 'Raymond Best', phone: '08127092419', shopNo: 'City of God plaza', source: 'if-01.jpeg' },
  { sn: 19, category: 'Shoes', name: 'Lovelyn Charles', phone: '08168501295', shopNo: '', source: 'if-01.jpeg' },
  { sn: 20, category: 'Shoes', name: 'Vivian Okafor', phone: '09159128744', shopNo: 'Sokoto road, Black Eagle plaza', source: 'if-01.jpeg' },
  { sn: 21, category: 'Fashion wears', name: 'Emeribe Chinaza', phone: '0814514357', shopNo: 'No 69, Igwilo street', source: 'if-01.jpeg' },

  // if-02.jpeg
  { sn: 22, category: '', name: 'Purity Chichi', phone: '07054186420', shopNo: '', source: 'if-02.jpeg' },
  { sn: 23, category: 'Dress', name: 'Ifeanyichukwu Ben', phone: '08164830038', shopNo: 'GmT 30, White house', source: 'if-02.jpeg' },
  { sn: 24, category: 'Bags', name: 'Janny Alaje', phone: '08136708495', shopNo: '', source: 'if-02.jpeg' },
  { sn: 25, category: '', name: 'Arinze Steve', phone: '07030256933', shopNo: 'Dream plaza, Sokoto', source: 'if-02.jpeg' },
  { sn: 27, category: '', name: 'Ebuka Emmanuel', phone: '08069233530', shopNo: 'Dream plaza, Sokoto', source: 'if-02.jpeg' },
  { sn: 28, category: '', name: 'Obah Favour', phone: '0806469872', shopNo: '', source: 'if-02.jpeg' },
  { sn: 29, category: 'Men Clothes', name: 'Okechukwu Samuel', phone: '08069059533', shopNo: '', source: 'if-02.jpeg' },
  { sn: 30, category: 'Bags', name: 'Chimaobi Valerian', phone: '08149795015', shopNo: 'A19, U.O.O plaza, Sokoto rd', source: 'if-02.jpeg' },
  { sn: 31, category: 'Body Shape', name: 'Alozie Faustina', phone: '08165089164', shopNo: '', source: 'if-02.jpeg' },
  { sn: 32, category: 'Jewelry', name: 'Favour Oji', phone: '07015215912', shopNo: '', source: 'if-02.jpeg' },
  { sn: 33, category: 'Bags', name: 'Ebiem Favour', phone: '08068952479', shopNo: '', source: 'if-02.jpeg' },
  { sn: 34, category: 'Ladies wear', name: 'Onyemaechi Cynthia', phone: '08065468516', shopNo: '184 Egika Sokoto rd, Apple plaza', source: 'if-02.jpeg' },
  { sn: 35, category: 'Cosmetics', name: 'Chizzy Juliet', phone: '07043529596', shopNo: '', source: 'if-02.jpeg' },
  { sn: 36, category: '', name: 'Nweke Gabriel', phone: '08169967792', shopNo: '', source: 'if-02.jpeg' },
  { sn: 37, category: 'Unisex wears', name: 'Alexander Chidera', phone: '09125103061', shopNo: '', source: 'if-02.jpeg' },
  { sn: 38, category: '', name: 'Amarachi Nweke', phone: '09032185579', shopNo: 'Sokoto rd', source: 'if-02.jpeg' },
  { sn: 39, category: '', name: 'Ibeabuchi Esther', phone: '07081795670', shopNo: '', source: 'if-02.jpeg' },
  { sn: 40, category: '', name: 'Gabriel Ifeanyi', phone: '08169967792', shopNo: '', source: 'if-02.jpeg' },
  { sn: 41, category: '', name: 'Ohaegbu Glory', phone: '08031850338', shopNo: '', source: 'if-02.jpeg' },
  { sn: 42, category: '', name: 'Odoh Mercy', phone: '08069386093', shopNo: '', source: 'if-02.jpeg' },
  { sn: 43, category: '', name: 'Obianaka Nwaoli', phone: '09070059525', shopNo: '', source: 'if-02.jpeg' },

  // if-03.jpeg / if-04.jpeg
  { sn: 44, category: '', name: 'Ehijator Gloria', phone: '08038001205', shopNo: '', source: 'if-03.jpeg' },
  { sn: 45, category: '', name: 'Ifeoma Lilian', phone: '07033547394', shopNo: '', source: 'if-03.jpeg' },
  { sn: 46, category: '', name: 'Onuorah Hellen', phone: '09132642737', shopNo: '', source: 'if-03.jpeg' },
  { sn: 47, category: '', name: 'Nancy Chisom', phone: '08068902257', shopNo: '', source: 'if-03.jpeg' },
  { sn: 48, category: '', name: 'Oluchukwu', phone: '07033988501', shopNo: 'No 5 Haruna Street', source: 'if-03.jpeg' },
  { sn: 49, category: '', name: 'Jennifer Chisom', phone: '07066802479', shopNo: '', source: 'if-03.jpeg' },
  { sn: 50, category: '', name: 'Okafor Emmanuel', phone: '08069233530', shopNo: '', source: 'if-03.jpeg' },
  { sn: 51, category: '', name: 'Odinukwe Doris', phone: '09066507752', shopNo: '', source: 'if-03.jpeg' },
  { sn: 52, category: '', name: 'Chika Rejoice', phone: '07063912168', shopNo: '', source: 'if-03.jpeg' },
  { sn: 53, category: '', name: 'Cynthia Ogechi', phone: '09072720046', shopNo: '', source: 'if-03.jpeg' },
  { sn: 54, category: '', name: 'Okafor Chioma', phone: '08108214550', shopNo: '', source: 'if-03.jpeg' },
  { sn: 55, category: '', name: 'Nnaji Jacinta', phone: '07031835197', shopNo: '', source: 'if-03.jpeg' },
  { sn: 56, category: '', name: 'Dike Chiamaka', phone: '08165089164', shopNo: '', source: 'if-03.jpeg' },
  { sn: 57, category: '', name: 'Chinaza Perpetua', phone: '08051601584', shopNo: '', source: 'if-03.jpeg' },
  { sn: 58, category: '', name: 'Precious Ekekah', phone: '08021049821', shopNo: '', source: 'if-03.jpeg' },
  { sn: 59, category: '', name: 'Ezeagu Amarachi', phone: '07038521500', shopNo: '21/22 Kuddy Plaza', source: 'if-03.jpeg' },
  { sn: 60, category: '', name: 'Ukamaka Juliet', phone: '09074926079', shopNo: '', source: 'if-03.jpeg' },
  { sn: 61, category: '', name: 'Dike Chiamaka', phone: '08165089164', shopNo: '', source: 'if-03.jpeg' },
  { sn: 62, category: '', name: 'Josiah Chioma', phone: '07066802479', shopNo: '', source: 'if-03.jpeg' },
  { sn: 63, category: '', name: 'Kosarachi Loveday', phone: '07083254113', shopNo: '', source: 'if-03.jpeg' },
  { sn: 64, category: '', name: 'Precious Sammy', phone: '07030112675', shopNo: '', source: 'if-03.jpeg' },

  // if-05.jpeg
  { sn: 65, category: '', name: 'Emanuela Ibechukwu', phone: '08078584947', shopNo: '', source: 'if-05.jpeg' },
  { sn: 66, category: '', name: 'Oliva David', phone: '08068540892', shopNo: '', source: 'if-05.jpeg' },
  { sn: 67, category: '', name: 'Vivian Chisom', phone: '09159128744', shopNo: 'No. 3 Sokoto Rd, Eagle Plaza', source: 'if-05.jpeg' },
  { sn: 68, category: '', name: 'Okafor MaryJane', phone: '08145338910', shopNo: '', source: 'if-05.jpeg' },
  { sn: 69, category: '', name: 'Lydia Nneji', phone: '08067142514', shopNo: 'Kings Line', source: 'if-05.jpeg' },
  { sn: 70, category: '', name: 'Chiamaka', phone: '07068859953', shopNo: '', source: 'if-05.jpeg' },
  { sn: 71, category: '', name: 'Nwankwo Chineye', phone: '08033375674', shopNo: '', source: 'if-05.jpeg' },
  { sn: 72, category: '', name: 'Obinna Confidence', phone: '07034392600', shopNo: 'Sokoto Rd', source: 'if-05.jpeg' },
  { sn: 73, category: '', name: 'Chikamso Stella', phone: '09014277658', shopNo: '', source: 'if-05.jpeg' },
  { sn: 74, category: '', name: 'Esther Nnaji', phone: '08078148529', shopNo: 'Sokoto Rd', source: 'if-05.jpeg' },
  { sn: 75, category: '', name: 'Micheal Mmesoma', phone: '09161942888', shopNo: '', source: 'if-05.jpeg' },
  { sn: 76, category: '', name: 'Diana Rita', phone: '09164652273', shopNo: '', source: 'if-05.jpeg' },
  { sn: 77, category: '', name: 'Emy Thompson', phone: '08149736599', shopNo: '', source: 'if-05.jpeg' },
  { sn: 78, category: '', name: 'Ben Joshua', phone: '08164830038', shopNo: 'GmT, 30 Luck Line', source: 'if-05.jpeg' },
  { sn: 79, category: '', name: 'Ibekwe Chizzy', phone: '08130985189', shopNo: '', source: 'if-05.jpeg' },
  { sn: 80, category: '', name: 'Chinemerem', phone: '09136434077', shopNo: '', source: 'if-05.jpeg' },
  { sn: 81, category: '', name: 'Abass Godwin', phone: '09052026336', shopNo: '', source: 'if-05.jpeg' },
  { sn: 82, category: '', name: 'Jamie Egede', phone: '07049125656', shopNo: '', source: 'if-05.jpeg' },
  { sn: 83, category: '', name: 'Emmanuel Nweke', phone: '09029829571', shopNo: '', source: 'if-05.jpeg' },
  { sn: 84, category: '', name: 'Simeon Keanule', phone: '08132156441', shopNo: '', source: 'if-05.jpeg' },
  { sn: 85, category: '', name: 'Janny Alaje', phone: '08136708495', shopNo: '', source: 'if-05.jpeg' },

  // if-06.jpeg
  { sn: 86, category: 'Shoes', name: 'Risey', phone: '09071026225', shopNo: '', source: 'if-06.jpeg' },
  { sn: 87, category: 'Footwears', name: 'Amicable Ezeh', phone: '09025545594', shopNo: '', source: 'if-06.jpeg' },
  { sn: 88, category: 'Dress', name: 'Amaechi Eze', phone: '08032955610', shopNo: '', source: 'if-06.jpeg' },
  { sn: 89, category: 'Dress', name: 'Nonso Victor', phone: '07043553477', shopNo: '', source: 'if-06.jpeg' },
  { sn: 90, category: 'Dress', name: 'Onyeji Kosi', phone: '09050228776', shopNo: '', source: 'if-06.jpeg' },
  { sn: 91, category: 'Shoes', name: 'Rita Ebimobowei', phone: '07066966202', shopNo: '', source: 'if-06.jpeg' },
  { sn: 92, category: 'Furniture', name: 'Oyin Damola', phone: '07065029727', shopNo: '', source: 'if-06.jpeg' },
  { sn: 93, category: 'Phones', name: 'Kelvin Peter', phone: '08104468997', shopNo: '', source: 'if-06.jpeg' },
  { sn: 94, category: 'Dress', name: 'Vicky Chidinma', phone: '09024085727', shopNo: '', source: 'if-06.jpeg' },
  { sn: 95, category: 'Footwear', name: 'Charles Deborah', phone: '08164546034', shopNo: '', source: 'if-06.jpeg' },
  { sn: 96, category: 'Clothes', name: 'Faith Joseph', phone: '08144020031', shopNo: '', source: 'if-06.jpeg' },
  { sn: 97, category: 'Cloths', name: 'Chidinma Okani', phone: '09035445564', shopNo: '', source: 'if-06.jpeg' },
  { sn: 98, category: 'Cloths', name: 'Vicky Chidinma', phone: '09024085727', shopNo: '', source: 'if-06.jpeg' },
  { sn: 99, category: 'Phones', name: 'Atabo Lami', phone: '08106305322', shopNo: '', source: 'if-06.jpeg' },
  { sn: 100, category: 'Phones', name: 'Julie Tina', phone: '09031692531', shopNo: '', source: 'if-06.jpeg' },
  { sn: 102, category: 'Hairs', name: 'Ifunanya Goddess', phone: '09065180871', shopNo: '', source: 'if-06.jpeg' },
  { sn: 103, category: 'Phones', name: 'George Opeyemi', phone: '08106305322', shopNo: '', source: 'if-06.jpeg' },
  { sn: 104, category: 'Bottles', name: 'Del P', phone: '08132642413', shopNo: '', source: 'if-06.jpeg' },
  { sn: 105, category: 'Foot wears', name: 'Praise Chukwunwike', phone: '09121804730', shopNo: '', source: 'if-06.jpeg' },
  { sn: 106, category: 'Phones', name: 'Solomon Lucky', phone: '08132170252', shopNo: '', source: 'if-06.jpeg' },
  { sn: 107, category: '', name: 'Christable Chioma', phone: '08164663936', shopNo: '', source: 'if-06.jpeg' },

  // if-07.jpeg
  { sn: 108, category: 'Phones', name: 'Jerry', phone: '09130410710', shopNo: '', source: 'if-07.jpeg' },
  { sn: 109, category: 'Dresses', name: 'Okpara Chidera', phone: '09072519434', shopNo: '', source: 'if-07.jpeg' },
  { sn: 110, category: 'Cosmetics', name: 'Goodness', phone: '09065180871', shopNo: '', source: 'if-07.jpeg' },
  { sn: 111, category: 'Laptops', name: 'Joshua Ademolla', phone: '08078037534', shopNo: '', source: 'if-07.jpeg' },
  { sn: 112, category: 'Phones', name: 'Paul Kalu', phone: '08106305322', shopNo: '', source: 'if-07.jpeg' },
]

async function generateExcel() {
  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'Antigravity AI'
  workbook.created = new Date()

  const worksheet = workbook.addWorksheet('Contacts Directory', {
    views: [{ state: 'frozen', ySplit: 1 }],
  })

  // Columns definition
  worksheet.columns = [
    { header: 'S/N', key: 'sn', width: 8 },
    { header: 'Category / Trade', key: 'category', width: 22 },
    { header: 'Name', key: 'name', width: 28 },
    { header: 'Phone Number', key: 'phone', width: 18 },
    { header: 'Shop No. / Address', key: 'shopNo', width: 38 },
    { header: 'Source File', key: 'source', width: 15 },
  ]

  // Header styling
  const headerRow = worksheet.getRow(1)
  headerRow.height = 28
  headerRow.font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FFFFFFFF' } }
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF200441' }, // Premium Brand Navy/Purple
  }
  headerRow.alignment = { vertical: 'middle', horizontal: 'center' }

  // Add rows
  records.forEach((rec, idx) => {
    const row = worksheet.addRow({
      sn: rec.sn,
      category: rec.category || '-',
      name: rec.name,
      phone: rec.phone, // string to preserve leading zeros
      shopNo: rec.shopNo || '-',
      source: rec.source,
    })

    row.height = 22
    row.font = { name: 'Arial', size: 10 }

    // Alternate row zebra shading
    if (idx % 2 === 1) {
      row.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF7F5FA' },
      }
    }

    // Alignments
    row.getCell('sn').alignment = { vertical: 'middle', horizontal: 'center' }
    row.getCell('category').alignment = { vertical: 'middle', horizontal: 'left' }
    row.getCell('name').alignment = { vertical: 'middle', horizontal: 'left' }
    row.getCell('phone').alignment = { vertical: 'middle', horizontal: 'center' }
    row.getCell('phone').numFmt = '@' // Text format for phone numbers
    row.getCell('shopNo').alignment = { vertical: 'middle', horizontal: 'left' }
    row.getCell('source').alignment = { vertical: 'middle', horizontal: 'center' }

    // Thin border
    row.eachCell({ includeEmpty: true }, (cell) => {
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE0DCE8' } },
        left: { style: 'thin', color: { argb: 'FFE0DCE8' } },
        bottom: { style: 'thin', color: { argb: 'FFE0DCE8' } },
        right: { style: 'thin', color: { argb: 'FFE0DCE8' } },
      }
    })
  })

  // Header border
  headerRow.eachCell((cell) => {
    cell.border = {
      top: { style: 'medium', color: { argb: 'FF200441' } },
      left: { style: 'thin', color: { argb: 'FF4A2A6B' } },
      bottom: { style: 'medium', color: { argb: 'FF200441' } },
      right: { style: 'thin', color: { argb: 'FF4A2A6B' } },
    }
  })

  await workbook.xlsx.writeFile(OUTPUT_FILE)
  console.log(`\n✅ Excel spreadsheet successfully created at:\n   ${OUTPUT_FILE}`)
  console.log(`📊 Total extracted records: ${records.length}\n`)
}

generateExcel().catch((err) => {
  console.error('Error creating Excel file:', err)
  process.exit(1)
})
