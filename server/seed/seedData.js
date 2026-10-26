const categories = [
  {
    name: 'Fruits',
    slug: 'fruits',
    description: 'Farm-fresh, crisp, and nutrient-packed seasonal and exotic fruits',
    image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=600&q=80',
    icon: 'Apple'
  },
  {
    name: 'Vegetables',
    slug: 'vegetables',
    description: 'Crisp green vegetables, fresh roots, and daily kitchen cooking essentials',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    icon: 'Carrot'
  },
  {
    name: 'Dairy',
    slug: 'dairy',
    description: 'Fresh milk, farm butter, artisanal cheeses, curd, and daily dairy items',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
    icon: 'Milk'
  },
  {
    name: 'Bakery',
    slug: 'bakery',
    description: 'Artisanal breads, golden croissants, cookies, and oven-fresh baked goods',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    icon: 'Croissant'
  },
  {
    name: 'Beverages',
    slug: 'beverages',
    description: '100% pure cold-pressed juices, sparkling water, coffees, and teas',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80',
    icon: 'Coffee'
  },
  {
    name: 'Snacks',
    slug: 'snacks',
    description: 'Crunchy chips, roasted nuts, organic trail mixes, and gourmet snacks',
    image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=600&q=80',
    icon: 'Cookie'
  },
  {
    name: 'Rice & Grains',
    slug: 'rice-grains',
    description: 'Aromatic basmati rice, ancient grains, pulses, lentils, and premium flour',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    icon: 'Wheat'
  },
  {
    name: 'Personal Care',
    slug: 'personal-care',
    description: 'Clean personal hygiene, gentle soaps, herbal shampoos, and body care',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
    icon: 'Sparkles'
  },
  {
    name: 'Household',
    slug: 'household',
    description: 'Eco-friendly cleaning supplies, laundry detergents, and paper essentials',
    image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=600&q=80',
    icon: 'Home'
  },
  {
    name: 'Frozen Foods',
    slug: 'frozen-foods',
    description: 'Quick-freeze green peas, frozen berries, sweet corn, and ready delicacies',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    icon: 'Snowflake'
  }
];

const sampleProducts = [
  // Fruits
  {
    name: 'Fresh Kashmir Red Apples',
    categorySlug: 'fruits',
    brand: 'NatureFresh',
    price: 150,
    discountPrice: 120,
    stock: 45,
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
    description: 'Crisp, sweet, and hand-picked Red Delicious apples from Kashmir orchards. High in antioxidants and dietary fiber.',
    isFeatured: true,
    isPopular: true,
    rating: 4.9,
    numReviews: 84
  },
  {
    name: 'Organic Cavendish Bananas',
    categorySlug: 'fruits',
    brand: 'GreenOrganics',
    price: 60,
    discountPrice: 48,
    stock: 35,
    unit: 'dozen',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80',
    description: 'Naturally ripened Cavendish bananas, naturally sweet and energy-dense for breakfast or smoothies.',
    isFeatured: true,
    isPopular: true,
    rating: 4.8,
    numReviews: 120
  },
  {
    name: 'Fresh Valencia Oranges',
    categorySlug: 'fruits',
    brand: 'CitrusFarm',
    price: 110,
    discountPrice: 95,
    stock: 22,
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=600&q=80',
    description: 'Juicy, sun-kissed Valencia oranges overflowing with natural Vitamin C. Perfect for morning juicing.',
    isFeatured: false,
    isPopular: true,
    rating: 4.7,
    numReviews: 43
  },
  {
    name: 'Imported Hass Avocados',
    categorySlug: 'fruits',
    brand: 'GlobalGroves',
    price: 240,
    discountPrice: 199,
    stock: 8, // Low Stock Demo!
    unit: '2 pcs',
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=600&q=80',
    description: 'Rich, creamy Hass avocados bursting with heart-healthy monounsaturated fats. Ideal for avocado toast and guacamole.',
    isFeatured: true,
    isPopular: false,
    rating: 4.9,
    numReviews: 31
  },

  // Vegetables
  {
    name: 'Farm Fresh Tomatoes (Hybrid)',
    categorySlug: 'vegetables',
    brand: 'NatureFresh',
    price: 45,
    discountPrice: 35,
    stock: 60,
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
    description: 'Firm, glossy red hybrid tomatoes ideal for curries, salads, and fresh salsa.',
    isFeatured: true,
    isPopular: true,
    rating: 4.6,
    numReviews: 95
  },
  {
    name: 'Baby Spinach (Palak)',
    categorySlug: 'vegetables',
    brand: 'GreenOrganics',
    price: 40,
    discountPrice: 30,
    stock: 5, // Low stock demo
    unit: '250g pack',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80',
    description: 'Tender, hydroponically washed baby spinach leaves loaded with iron, vitamin K, and minerals.',
    isFeatured: false,
    isPopular: true,
    rating: 4.8,
    numReviews: 54
  },
  {
    name: 'Fresh Red Onions',
    categorySlug: 'vegetables',
    brand: 'FarmDirect',
    price: 50,
    discountPrice: null,
    stock: 80,
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80',
    description: 'Pungent, dry, and crunchy red onions. Essential staple for everyday culinary dishes.',
    isFeatured: false,
    isPopular: true,
    rating: 4.5,
    numReviews: 110
  },
  {
    name: 'Crisp English Cucumbers',
    categorySlug: 'vegetables',
    brand: 'GreenOrganics',
    price: 40,
    discountPrice: 32,
    stock: 0, // Out of stock demo!
    unit: '500g',
    image: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?auto=format&fit=crop&w=600&q=80',
    description: 'Seedless, hydrating, and crisp cucumbers ideal for cooling summer salads and detox water.',
    isFeatured: false,
    isPopular: false,
    rating: 4.6,
    numReviews: 18
  },

  // Dairy
  {
    name: 'Organic Whole Cow Milk',
    categorySlug: 'dairy',
    brand: 'PurePastures',
    price: 70,
    discountPrice: 62,
    stock: 30,
    unit: '1 L',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
    description: 'Pasteurized, homogenized whole cow milk sourced directly from grass-fed dairy farms. Rich in calcium and protein.',
    isFeatured: true,
    isPopular: true,
    rating: 4.9,
    numReviews: 140
  },
  {
    name: 'Artisanal Salted Butter',
    categorySlug: 'dairy',
    brand: 'PurePastures',
    price: 130,
    discountPrice: 115,
    stock: 18,
    unit: '200g',
    image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80',
    description: 'Golden, slow-churned salted butter made from fresh dairy cream with unmatched richness.',
    isFeatured: false,
    isPopular: true,
    rating: 4.8,
    numReviews: 67
  },
  {
    name: 'Natural Greek Yogurt',
    categorySlug: 'dairy',
    brand: 'PurePastures',
    price: 90,
    discountPrice: 80,
    stock: 4, // Low stock demo
    unit: '400g tub',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80',
    description: 'Thick, creamy strained Greek yogurt packed with live probiotics and twice the protein of normal curd.',
    isFeatured: true,
    isPopular: true,
    rating: 4.9,
    numReviews: 53
  },

  // Bakery
  {
    name: 'Artisan Sourdough Loaf',
    categorySlug: 'bakery',
    brand: 'BakeCraft',
    price: 140,
    discountPrice: 120,
    stock: 15,
    unit: '400g loaf',
    image: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=600&q=80',
    description: 'Naturally fermented for 24 hours with wild sourdough culture. Blistered golden crust with airy, tangy crumb.',
    isFeatured: true,
    isPopular: true,
    rating: 4.9,
    numReviews: 76
  },
  {
    name: '100% Whole Wheat Bread',
    categorySlug: 'bakery',
    brand: 'DailyBake',
    price: 55,
    discountPrice: 45,
    stock: 25,
    unit: '400g pack',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    description: 'No added maida or refined sugars. Soft sliced whole wheat bread ideal for healthy daily sandwiches.',
    isFeatured: false,
    isPopular: true,
    rating: 4.7,
    numReviews: 88
  },

  // Beverages
  {
    name: 'Cold Pressed Valencia Orange Juice',
    categorySlug: 'beverages',
    brand: 'JuicePress',
    price: 120,
    discountPrice: 99,
    stock: 20,
    unit: '500 ml',
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=600&q=80',
    description: 'Raw, unpasteurized cold-pressed orange juice with zero added sugars, preservatives, or artificial colors.',
    isFeatured: true,
    isPopular: true,
    rating: 4.9,
    numReviews: 62
  },
  {
    name: 'Premium Roast Arabica Coffee Beans',
    categorySlug: 'beverages',
    brand: 'MountainRoast',
    price: 420,
    discountPrice: 380,
    stock: 12,
    unit: '250g pack',
    image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=600&q=80',
    description: 'Single-origin Coorg Arabica beans medium-dark roasted with notes of dark chocolate and caramel.',
    isFeatured: false,
    isPopular: true,
    rating: 4.9,
    numReviews: 47
  },

  // Snacks
  {
    name: 'Roasted & Salted California Almonds',
    categorySlug: 'snacks',
    brand: 'NutriBites',
    price: 280,
    discountPrice: 245,
    stock: 19,
    unit: '250g pouch',
    image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=600&q=80',
    description: 'Crunchy California almonds lightly dusted with pink Himalayan salt. Perfect protein-rich snack.',
    isFeatured: true,
    isPopular: true,
    rating: 4.8,
    numReviews: 59
  },

  // Rice & Grains
  {
    name: 'Royal Aged Basmati Rice (XXL Grain)',
    categorySlug: 'rice-grains',
    brand: 'HeritageGrains',
    price: 220,
    discountPrice: 185,
    stock: 50,
    unit: '1 kg pack',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    description: 'Aged for 2 years for unparalleled aroma and extra-long fluffy grains that do not break when cooked.',
    isFeatured: true,
    isPopular: true,
    rating: 4.9,
    numReviews: 114
  },
  {
    name: 'Organic Rolled Oats',
    categorySlug: 'rice-grains',
    brand: 'NutriBites',
    price: 160,
    discountPrice: 135,
    stock: 24,
    unit: '500g pouch',
    image: 'https://images.unsplash.com/photo-1517093708454-e0b0e9803262?auto=format&fit=crop&w=600&q=80',
    description: 'Gluten-free, high-fiber 100% whole grain rolled oats for creamy morning oatmeal or homemade granola.',
    isFeatured: false,
    isPopular: true,
    rating: 4.8,
    numReviews: 42
  },

  // Household & Personal Care
  {
    name: 'Eco Dishwashing Gel (Citrus Blossom)',
    categorySlug: 'household',
    brand: 'EcoCleanse',
    price: 115,
    discountPrice: 95,
    stock: 35,
    unit: '750 ml bottle',
    image: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=600&q=80',
    description: 'Tough on grease yet gentle on hands. Plant-based formula scented with natural essential lemon oils.',
    isFeatured: false,
    isPopular: false,
    rating: 4.7,
    numReviews: 29
  },
  {
    name: 'Sweet Green Peas (IQF Frozen)',
    categorySlug: 'frozen-foods',
    brand: 'FrostFresh',
    price: 90,
    discountPrice: 75,
    stock: 28,
    unit: '500g pack',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80',
    description: 'Individually Quick Frozen (IQF) sweet green tender peas that retain their fresh sweet taste and bright color.',
    isFeatured: false,
    isPopular: true,
    rating: 4.7,
    numReviews: 36
  }
];

module.exports = { categories, sampleProducts };
