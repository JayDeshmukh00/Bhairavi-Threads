const Product = require('../models/Product');
const cloudinary = require('cloudinary').v2;
const xlsx = require('xlsx');

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ updatedAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
};

exports.addSingleSaree = async (req, res) => {
  try {
    const { name, material, description, color, design, price, stockStatus } = req.body;
    let imageUrls = [];
    let videoUrl = "";

    if (req.files && req.files['images']) {
      for (const file of req.files['images']) {
        const b64 = Buffer.from(file.buffer).toString('base64');
        const dataURI = "data:" + file.mimetype + ";base64," + b64;
        const uploadRes = await cloudinary.uploader.upload(dataURI, { folder: "bhairavi_threads" });
        imageUrls.push(uploadRes.secure_url);
      }
    }

    if (req.files && req.files['video']) {
      const b64 = Buffer.from(req.files['video'][0].buffer).toString('base64');
      const dataURI = "data:" + req.files['video'][0].mimetype + ";base64," + b64;
      const uploadRes = await cloudinary.uploader.upload(dataURI, { resource_type: "video", folder: "bhairavi_threads" });
      videoUrl = uploadRes.secure_url;
    }

    const newVariant = {
      color: color || 'Default',
      design: design || 'Standard',
      price: Number(price) || 0,
      stockStatus: stockStatus || 'In Stock',
      images: imageUrls,
      videoUrl
    };

    let product = await Product.findOne({ name, material });
    if (product) {
      product.variants.push(newVariant);
      await product.save();
    } else {
      product = new Product({ name, material: material || 'Cotton', description, variants: [newVariant] });
      await product.save();
    }

    res.status(201).json({ message: "Saree variant uploaded successfully!", product });
  } catch (error) {
    res.status(500).json({ message: "Error uploading", error: error.message });
  }
};

exports.addSareeWithVariants = async (req, res) => {
  try {
    const { name, material, description, variantsMeta } = req.body;
    const variantsParsed = JSON.parse(variantsMeta);
    let processedVariants = [];

    for (let i = 0; i < variantsParsed.length; i++) {
      let vMeta = variantsParsed[i];
      let imageUrls = [];
      let videoUrl = vMeta.videoUrl || '';

      const variantFiles = req.files ? req.files.filter(f => f.fieldname === `variantImages_${i}`) : [];
      for (const file of variantFiles) {
        const b64 = Buffer.from(file.buffer).toString('base64');
        const dataURI = "data:" + file.mimetype + ";base64," + b64;
        const uploadRes = await cloudinary.uploader.upload(dataURI, { folder: "bhairavi_threads" });
        imageUrls.push(uploadRes.secure_url);
      }

      const variantVideoFile = req.files ? req.files.find(f => f.fieldname === `variantVideo_${i}`) : null;
      if (variantVideoFile) {
        const b64 = Buffer.from(variantVideoFile.buffer).toString('base64');
        const dataURI = "data:" + variantVideoFile.mimetype + ";base64," + b64;
        const uploadRes = await cloudinary.uploader.upload(dataURI, { resource_type: "video", folder: "bhairavi_threads" });
        videoUrl = uploadRes.secure_url;
      }

      processedVariants.push({
        color: vMeta.color || 'Standard',
        design: vMeta.design || 'Classic',
        price: Number(vMeta.price) || 0,
        stockStatus: vMeta.stockStatus || 'In Stock',
        images: imageUrls,
        videoUrl
      });
    }

    let product = await Product.findOne({ name, material });
    if (product) {
      product.variants.push(...processedVariants);
      if (description) product.description = description;
      await product.save();
    } else {
      product = new Product({ name, material: material || 'Cotton', description, variants: processedVariants });
      await product.save();
    }

    res.status(201).json({ message: "Saree with all variants and videos uploaded successfully!", product });
  } catch (error) {
    res.status(500).json({ message: "Multi-variant upload failed", error: error.message });
  }
};

// --- FIXED EXCEL UPLOAD FUNCTION MATCHING TEMPLATE HEADERS ---
exports.uploadExcelSarees = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded." });
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const excelData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    for (const row of excelData) {
      // Handles Capitalized template keys: Name, Material, Category, Description, Color, Design, Price, StockStatus, ImageURL
      const name = row.Name || row.name;
      if (!name) continue;

      let imgs = row.ImageURL ? row.ImageURL.split(',').map(url => url.trim()) : (row.images ? row.images.split(',').map(url => url.trim()) : []);
      
      let variant = {
        color: row.Color || row.color || 'Standard',
        design: row.Design || row.design || 'Classic',
        price: Number(row.Price || row.price) || 0,
        stockStatus: row.StockStatus || row.stockStatus || 'In Stock',
        images: imgs,
        videoUrl: row.videoUrl || ''
      };

      let product = await Product.findOne({ name });
      if (product) {
        product.variants.push(variant);
        if (row.Category) product.category = row.Category;
        if (row.Material) product.material = row.Material;
        if (row.Description) product.description = row.Description;
        await product.save();
      } else {
        await new Product({
          name: name,
          material: row.Material || row.material || 'Cotton',
          category: row.Category || row.category || 'Traditional',
          description: row.Description || row.description || 'Exclusive handloom collection.',
          variants: [variant]
        }).save();
      }
    }

    res.status(201).json({ message: `Successfully processed Excel inventory upload!` });
  } catch (error) {
    res.status(500).json({ message: "Error parsing Excel", error: error.message });
  }
};

// --- RUNTIME LIVE INVENTORY CSV EXPORT ROUTE ---
exports.exportInventoryCSV = async (req, res) => {
  try {
    const products = await Product.find({});
    let csv = "Name,Material,Category,Description,Color,Design,Price,StockStatus,ImageURL\n";
    
    products.forEach(p => {
      if (p.variants && p.variants.length > 0) {
        p.variants.forEach(v => {
          csv += `"${p.name || ''}","${p.material || ''}","${p.category || ''}","${(p.description || '').replace(/"/g, '""')}","${v.color || ''}","${v.design || ''}",${v.price || 0},"${v.stockStatus || 'In Stock'}","${v.images?.[0] || ''}"\n`;
        });
      } else {
        csv += `"${p.name || ''}","${p.material || ''}","${p.category || ''}","${(p.description || '').replace(/"/g, '""')}","Default","Classic",0,"In Stock",""\n`;
      }
    });

    res.header('Content-Type', 'text/csv');
    res.attachment(`Bhairavi_Threads_Live_Inventory_${Date.now()}.csv`);
    return res.send(csv);
  } catch (error) {
    res.status(500).json({ message: "Failed to export inventory CSV", error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const body = req.body || {};
    const name = body.name;
    const material = body.material;
    const description = body.description;
    
    let variantsParsed = [];
    if (body.variantsMeta) {
      variantsParsed = JSON.parse(body.variantsMeta);
    } else if (body.variants) {
      variantsParsed = body.variants;
    }

    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) return res.status(404).json({ message: "Product not found" });

    let processedVariants = [];

    for (let i = 0; i < variantsParsed.length; i++) {
      let vMeta = variantsParsed[i];
      let oldVariant = existingProduct.variants[i] || {};
      let imageUrls = vMeta.existingImages || vMeta.images || oldVariant.images || [];
      let videoUrl = vMeta.existingVideo || vMeta.videoUrl || oldVariant.videoUrl || '';

      const variantFiles = req.files ? req.files.filter(f => f.fieldname === `variantImages_${i}`) : [];
      for (const file of variantFiles) {
        const b64 = Buffer.from(file.buffer).toString('base64');
        const dataURI = "data:" + file.mimetype + ";base64," + b64;
        const uploadRes = await cloudinary.uploader.upload(dataURI, { folder: "bhairavi_threads" });
        imageUrls.push(uploadRes.secure_url);
      }

      const variantVideoFile = req.files ? req.files.find(f => f.fieldname === `variantVideo_${i}`) : null;
      if (variantVideoFile) {
        const b64 = Buffer.from(variantVideoFile.buffer).toString('base64');
        const dataURI = "data:" + variantVideoFile.mimetype + ";base64," + b64;
        const uploadRes = await cloudinary.uploader.upload(dataURI, { resource_type: "video", folder: "bhairavi_threads" });
        videoUrl = uploadRes.secure_url;
      }

      processedVariants.push({
        color: vMeta.color || oldVariant.color || 'Standard',
        design: vMeta.design || oldVariant.design || 'Classic',
        price: Number(vMeta.price) !== undefined ? Number(vMeta.price) : (oldVariant.price || 0),
        stockStatus: vMeta.stockStatus || oldVariant.stockStatus || 'In Stock',
        images: imageUrls,
        videoUrl
      });
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id, 
      { 
        name: name || existingProduct.name, 
        material: material || existingProduct.material, 
        description: description !== undefined ? description : existingProduct.description, 
        variants: processedVariants.length > 0 ? processedVariants : existingProduct.variants 
      }, 
      { returnDocument: 'after' }
    );

    res.json({ message: "Product updated successfully!", updated });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Deletion failed", error: error.message });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { userName, rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.reviews.push({ userName, rating: Number(rating), comment });
    const totalRating = product.reviews.reduce((sum, item) => sum + item.rating, 0);
    product.averageRating = Number((totalRating / product.reviews.length).toFixed(1));

    await product.save();
    res.status(201).json({ message: "Review added successfully!", product });
  } catch (error) {
    res.status(500).json({ message: "Error adding review", error: error.message });
  }
};