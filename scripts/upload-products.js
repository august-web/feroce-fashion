const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read env vars from .env.local
const env = fs.readFileSync('.env.local', 'utf8');
const vars = {};
env.split('\n').forEach(l => {
  const [k, ...rest] = l.split('=');
  if (k && rest.length) vars[k.trim()] = rest.join('=').trim();
});

const supabase = createClient(vars.NEXT_PUBLIC_SUPABASE_URL, vars.SUPABASE_SERVICE_ROLE_KEY);

const IMAGES = [
  {
    productId: '00000001-0000-0000-0000-000000000001',
    folder: 'denim-de-ville/blue-gold',
    main: 'public/images/products/Denim De Ville Collection/Blue & Gold/Denim De Ville Collection --Blue & Gold.jpg',
    models: [
      'public/images/products/Denim De Ville Collection/Blue & Gold/Preserve_the_EXACT_F_ROCE_hand_2.jpg',
      'public/images/products/Denim De Ville Collection/Blue & Gold/Preserve_the_EXACT_F_ROCE_hand_5.jpg',
    ],
  },
  {
    productId: '00000001-0000-0000-0000-000000000002',
    folder: 'denim-de-ville/cream-gold',
    main: 'public/images/products/Denim De Ville Collection/Cream & Gold/Denim De Ville Collection -- Cream & Gold.jpg',
    models: [
      'public/images/products/Denim De Ville Collection/Cream & Gold/Preview 1.jpg',
      'public/images/products/Denim De Ville Collection/Cream & Gold/Preview 2.jpg',
    ],
  },
  {
    productId: '00000001-0000-0000-0000-000000000003',
    folder: 'naji/gold-fur',
    main: 'public/images/products/Naji Collection/Gold Fur Bag/Naji Collection -- Golden Fur.jpg',
    models: [
      'public/images/products/Naji Collection/Gold Fur Bag/Main-Preview.jpg',
      'public/images/products/Naji Collection/Gold Fur Bag/Preview 2.jpg',
      'public/images/products/Naji Collection/Gold Fur Bag/Preview 3.jpg',
    ],
  },
  {
    productId: '00000001-0000-0000-0000-000000000004',
    folder: 'naji/maroon-red-fur',
    main: 'public/images/products/Naji Collection/Maroon Fur Bag/Naji Collection -- Maroon Red Fur.jpg',
    models: [
      'public/images/products/Naji Collection/Maroon Fur Bag/Main-Preview.jpg',
      'public/images/products/Naji Collection/Maroon Fur Bag/Preview 2.jpg',
      'public/images/products/Naji Collection/Maroon Fur Bag/Preview 3.jpg',
      'public/images/products/Naji Collection/Maroon Fur Bag/Preview 4.jpg',
    ],
  },
];

async function uploadFile(localPath, storagePath) {
  const buffer = fs.readFileSync(localPath);
  const { error } = await supabase.storage
    .from('products')
    .upload(storagePath, buffer, { contentType: 'image/jpeg', upsert: true });
  if (error) { console.error('  Upload error:', error.message); return null; }
  const { data } = supabase.storage.from('products').getPublicUrl(storagePath);
  return data?.publicUrl || null;
}

async function main() {
  for (const item of IMAGES) {
    console.log('\nUploading ' + item.folder + '...');
    const mainExt = path.extname(item.main);
    const mainUrl = await uploadFile(item.main, item.folder + '/main' + mainExt);
    console.log('  Main: ' + mainUrl);
    const modelUrls = [];
    for (let i = 0; i < item.models.length; i++) {
      const ext = path.extname(item.models[i]);
      const url = await uploadFile(item.models[i], item.folder + '/model-' + (i+1) + ext);
      console.log('  Model ' + (i+1) + ': ' + url);
      if (url) modelUrls.push(url);
    }
    const allUrls = mainUrl ? [mainUrl, ...modelUrls] : modelUrls;
    const { error } = await supabase.from('products').update({ image_urls: allUrls }).eq('id', item.productId);
    if (error) console.error('  DB error: ' + error.message);
    else console.log('  DB updated: ' + allUrls.length + ' images');
  }
  console.log('\nDone!');
}
main().catch(console.error);
