export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  category: string;
  createdAt: Date;
  userId: string;
  radius: number;
}

export const categories = [
  "All Categories",
  "Accommodations",
  "Electronics",
  "Furniture",
  "Clothing",
  "Vehicles",
  "Services",
  "Jobs",
  "Real Estate",
  "Other",
];

export const mockListings: Listing[] = [
  {
    id: "1",
    title: "This is a sample text with spaces that is exactly sixty characters",
    description:
      "Beautiful studio apartment in downtown area with great amenities. Perfect for singles or couples.",
    price: 1200,
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    location: {
      address: "123 Main St, San Francisco, CA",
      lat: 37.7749,
      lng: -122.4194,
    },
    category: "Accommodations",
    createdAt: new Date("2023-12-01"),
    userId: "user1",
    radius: 15,
  },
  {
    id: "2",
    title: "MacBook Pro 16 - Like New",
    description:
      "Barely used MacBook Pro 16 inch. M1 Max chip, 32GB RAM, 1TB SSD. Comes with original box and charger.",
    price: 2400,
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    location: {
      address: "456 Tech Ave, San Jose, CA",
      lat: 37.3382,
      lng: -121.8863,
    },
    category: "Electronics",
    createdAt: new Date("2023-12-10"),
    userId: "user2",
    radius: 20,
  },
  {
    id: "3",
    title: "Luxury Condo With Bay View",
    description:
      "Luxury 2-bedroom condo with breathtaking views of the bay. Modern amenities, garage parking, and 24-hour security.",
    price: 3500,
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    location: {
      address: "789 Ocean Blvd, Miami, FL",
      lat: 25.7617,
      lng: -80.1918,
    },
    category: "Real Estate",
    createdAt: new Date("2023-11-28"),
    userId: "user3",
    radius: 10,
  },
  {
    id: "4",
    title: "Professional Photography Services",
    description:
      "Professional photography for events, portraits, and commercial projects. High-quality equipment and years of experience.",
    price: 500,
    image:
      "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    location: {
      address: "101 Artistic Lane, Brooklyn, NY",
      lat: 40.6782,
      lng: -73.9442,
    },
    category: "Services",
    createdAt: new Date("2023-12-15"),
    userId: "user4",
    radius: 25,
  },
  {
    id: "5",
    title: "Vintage Mid-Century Chair",
    description:
      "Authentic mid-century modern lounge chair in excellent condition. Teak wood with original upholstery.",
    price: 850,
    image:
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    location: {
      address: "202 Vintage Road, Austin, TX",
      lat: 30.2672,
      lng: -97.7431,
    },
    category: "Furniture",
    createdAt: new Date("2023-12-05"),
    userId: "user5",
    radius: 15,
  },
  {
    id: "6",
    title: "Remote Software Developer Position",
    description:
      "Seeking experienced React developer for remote position. Competitive salary and benefits. Flexible hours.",
    price: 120000,
    image:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    location: {
      address: "303 Tech Park, Seattle, WA",
      lat: 47.6062,
      lng: -122.3321,
    },
    category: "Jobs",
    createdAt: new Date("2023-12-18"),
    userId: "user6",
    radius: 30,
  },
  {
    id: "7",
    title: "Electric Scooter - Perfect Condition",
    description:
      "High-performance electric scooter with 30-mile range. Barely used, comes with charger and lock.",
    price: 700,
    image:
      "https://images.unsplash.com/photo-1604357209793-fca5dca89f97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    location: {
      address: "404 Green Street, Portland, OR",
      lat: 45.5152,
      lng: -122.6784,
    },
    category: "Vehicles",
    createdAt: new Date("2023-12-12"),
    userId: "user7",
    radius: 20,
  },
  {
    id: "8",
    title: "Designer Clothing Collection",
    description:
      "Collection of luxury designer clothing, sizes S-M. Items from Gucci, Prada, and Balenciaga. All authentic.",
    price: 3000,
    image:
      "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    location: {
      address: "505 Fashion Ave, Los Angeles, CA",
      lat: 34.0522,
      lng: -118.2437,
    },
    category: "Clothing",
    createdAt: new Date("2023-12-08"),
    userId: "user8",
    radius: 15,
  },
  // New listings (12 additional ones to reach 20 total)
  {
    id: "9",
    title: "Cozy 1BR Apartment near Downtown",
    description:
      "Charming 1-bedroom apartment within walking distance of downtown. Fully furnished with modern amenities and fast internet.",
    price: 1100,
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    location: {
      address: "321 Pine St, San Francisco, CA",
      lat: 37.7929,
      lng: -122.4094,
    },
    category: "Accommodations",
    createdAt: new Date("2023-12-03"),
    userId: "user9",
    radius: 12,
  },
  {
    id: "10",
    title: "Graphic Design Services - Logo & Branding",
    description:
      "Professional graphic design services specializing in logo design, branding, and visual identity for businesses of all sizes.",
    price: 450,
    image:
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    location: {
      address: "987 Creative Blvd, Oakland, CA",
      lat: 37.8044,
      lng: -122.2711,
    },
    category: "Services",
    createdAt: new Date("2023-12-17"),
    userId: "user10",
    radius: 18,
  },
  {
    id: "11",
    title: "Sony PlayStation 5 - Bundle Deal",
    description:
      "Brand new PS5 with extra controller, 3 games, and 1-year PlayStation Plus subscription. Perfect holiday gift!",
    price: 650,
    image:
      "https://images.unsplash.com/photo-1605901309584-818e25960a8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    location: {
      address: "555 Gamer Ave, Daly City, CA",
      lat: 37.6879,
      lng: -122.4702,
    },
    category: "Electronics",
    createdAt: new Date("2023-12-11"),
    userId: "user11",
    radius: 15,
  },
  {
    id: "12",
    title: "Luxury SUV - 2021 Range Rover Sport",
    description:
      "2021 Range Rover Sport HSE in excellent condition. Low mileage, fully loaded with all options, and recently serviced.",
    price: 75000,
    image:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    location: {
      address: "789 Auto Row, San Mateo, CA",
      lat: 37.563,
      lng: -122.3255,
    },
    category: "Vehicles",
    createdAt: new Date("2023-12-09"),
    userId: "user12",
    radius: 25,
  },
  {
    id: "13",
    title: "Sectional Sofa - Modern Design",
    description:
      "Contemporary L-shaped sectional sofa in light gray. Perfect condition, pet-free and smoke-free home. Includes throw pillows.",
    price: 1200,
    image:
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    location: {
      address: "432 Home Plaza, South San Francisco, CA",
      lat: 37.6547,
      lng: -122.4077,
    },
    category: "Furniture",
    createdAt: new Date("2023-12-14"),
    userId: "user13",
    radius: 20,
  },
  {
    id: "14",
    title: "Marketing Assistant - Entry Level",
    description:
      "Entry-level marketing position at growing tech startup. Social media management, content creation, and market research.",
    price: 55000,
    image:
      "https://images.unsplash.com/photo-1542744094-3a31f272c490?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    location: {
      address: "101 Startup Way, Palo Alto, CA",
      lat: 37.4419,
      lng: -122.143,
    },
    category: "Jobs",
    createdAt: new Date("2023-12-16"),
    userId: "user14",
    radius: 30,
  },
  {
    id: "15",
    title: "Men's Designer Watch Collection",
    description:
      "Collection of luxury men's watches including Rolex, Omega, and TAG Heuer. All authentic with boxes and papers.",
    price: 15000,
    image:
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    location: {
      address: "789 Luxury Lane, Sausalito, CA",
      lat: 37.859,
      lng: -122.4853,
    },
    category: "Clothing",
    createdAt: new Date("2023-12-07"),
    userId: "user15",
    radius: 15,
  },
  {
    id: "16",
    title: "Beachfront Cottage - Weekend Rental",
    description:
      "Charming beachfront cottage available for weekend rentals. Direct beach access, stunning views, and fully equipped kitchen.",
    price: 350,
    image:
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    location: {
      address: "123 Beach Drive, Half Moon Bay, CA",
      lat: 37.4636,
      lng: -122.4286,
    },
    category: "Accommodations",
    createdAt: new Date("2023-12-04"),
    userId: "user16",
    radius: 35,
  },
  {
    id: "17",
    title: "Investment Property - Duplex",
    description:
      "Fully rented duplex in growing neighborhood. Great investment opportunity with positive cash flow and strong rental history.",
    price: 950000,
    image:
      "https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    location: {
      address: "456 Investor Street, Berkeley, CA",
      lat: 37.8715,
      lng: -122.273,
    },
    category: "Real Estate",
    createdAt: new Date("2023-12-02"),
    userId: "user17",
    radius: 25,
  },
  {
    id: "18",
    title: "Drone with 4K Camera - DJI Mavic Air 2",
    description:
      "DJI Mavic Air 2 drone in excellent condition. 4K camera, 34-minute flight time, and obstacle avoidance technology.",
    price: 800,
    image:
      "https://images.unsplash.com/photo-1533310266095-8d66e298032e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    location: {
      address: "789 Tech Circle, San Bruno, CA",
      lat: 37.6305,
      lng: -122.4111,
    },
    category: "Electronics",
    createdAt: new Date("2023-12-13"),
    userId: "user18",
    radius: 18,
  },
  {
    id: "19",
    title: "Personal Fitness Training",
    description:
      "Certified personal trainer offering one-on-one fitness sessions. Customized workout plans and nutrition guidance included.",
    price: 75,
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    location: {
      address: "333 Fitness Way, Mill Valley, CA",
      lat: 37.906,
      lng: -122.545,
    },
    category: "Services",
    createdAt: new Date("2023-12-19"),
    userId: "user19",
    radius: 22,
  },
  {
    id: "20",
    title: "Handcrafted Wooden Dining Table",
    description:
      "Solid oak dining table handcrafted by local artisan. Seats 8 comfortably. One-of-a-kind piece with natural live edge.",
    price: 2200,
    image:
      "https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    location: {
      address: "101 Craftsman Lane, San Rafael, CA",
      lat: 37.9735,
      lng: -122.5311,
    },
    category: "Furniture",
    createdAt: new Date("2023-12-06"),
    userId: "user20",
    radius: 28,
  },
];

// Function to generate dynamically positioned listings based on user location
export const generateDynamicListings = (
  baseLocation: { lat: number; lng: number },
  count: number = 75
): Listing[] => {
  const listings: Listing[] = [];

  for (let i = 0; i < count; i++) {
    // Create random offset in latitude and longitude (roughly within 30 miles)
    // 0.01 degree is approximately 0.7 miles at the equator
    const latOffset = Math.random() * 0.8 - 0.4; // +/- 0.4 degrees (roughly +/- 28 miles)
    const lngOffset = Math.random() * 0.8 - 0.4;

    // Calculate new coordinates
    const lat = baseLocation.lat + latOffset;
    const lng = baseLocation.lng + lngOffset;

    // Calculate distance from center (in miles)
    const distance = calculateDistance(
      baseLocation.lat,
      baseLocation.lng,
      lat,
      lng
    );
    const radius = Math.min(
      30,
      Math.max(5, Math.floor(distance) + Math.floor(Math.random() * 15))
    );

    // Select random category (except the first "All Categories" option)
    const randomCategory =
      categories[Math.floor(Math.random() * (categories.length - 1)) + 1];

    // Generate random price based on category
    let price = 0;
    switch (randomCategory) {
      case "Real Estate":
        price = Math.floor(Math.random() * 1000000) + 300000;
        break;
      case "Vehicles":
        price = Math.floor(Math.random() * 50000) + 5000;
        break;
      case "Electronics":
        price = Math.floor(Math.random() * 2000) + 200;
        break;
      case "Accommodations":
        price = Math.floor(Math.random() * 2000) + 800;
        break;
      case "Jobs":
        price = Math.floor(Math.random() * 70000) + 30000;
        break;
      default:
        price = Math.floor(Math.random() * 1000) + 50;
    }

    // Generate a mock address
    const streets = [
      "Main St",
      "Oak Ave",
      "Pine Rd",
      "Maple Dr",
      "Cedar Ln",
      "Elm St",
      "Park Ave",
      "Washington Blvd",
      "Lincoln Ave",
      "Jefferson St",
      "Roosevelt Dr",
      "Highland Ave",
      "Sunset Blvd",
      "Willow Way",
      "Meadow Ln",
      "Forest Dr",
      "River Rd",
      "Lake Ave",
    ];
    const cities = [
      "San Francisco",
      "Oakland",
      "Berkeley",
      "San Jose",
      "Palo Alto",
      "Daly City",
      "South SF",
      "Fremont",
      "Hayward",
      "Richmond",
      "Walnut Creek",
      "Concord",
      "San Rafael",
      "Sunnyvale",
      "Mountain View",
      "Santa Clara",
      "Redwood City",
      "San Mateo",
      "Burlingame",
    ];
    const address = `${Math.floor(Math.random() * 999) + 1} ${
      streets[Math.floor(Math.random() * streets.length)]
    }, ${cities[Math.floor(Math.random() * cities.length)]}, CA`;

    // Generate random date within last 30 days
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));

    // Generate random descriptive titles based on category
    const categoryTitles = {
      Accommodations: [
        "Cozy Studio Near Downtown",
        "Spacious 2BR with View",
        "Luxury Condo for Rent",
        "Room in Shared House",
        "Private Guest Suite",
        "Beachfront Cottage",
        "Modern Apartment in High-Rise",
        "Charming Bungalow",
        "Furnished Room for Student",
        "Downtown Loft with Amenities",
        "Garden Apartment Available",
        "Quiet Studio for Professional",
      ],
      Electronics: [
        "MacBook Pro - Barely Used",
        "Samsung 4K Smart TV",
        "iPhone 14 Pro Max",
        "Gaming PC Setup",
        "Sony Wireless Headphones",
        "iPad Pro with Pencil",
        "DSLR Camera Bundle",
        "Home Theater System",
        "Gaming Console with Games",
        "Bluetooth Speakers",
        "Smartwatch - Latest Model",
        "Professional Microphone Set",
      ],
      Furniture: [
        "Mid-Century Modern Sofa",
        "Solid Wood Dining Table",
        "King Size Bed Frame",
        "Vintage Leather Armchair",
        "IKEA Desk and Chair",
        "Custom Built Bookshelf",
        "Outdoor Patio Set",
        "Antique Coffee Table",
        "Ergonomic Office Chair",
        "Storage Cabinet",
        "Handcrafted Kitchen Island",
        "Memory Foam Mattress",
      ],
      Clothing: [
        "Designer Jacket - Size M",
        "Vintage Denim Collection",
        "Formal Dress - Never Worn",
        "Men's Suit - Italian Made",
        "Brand New Running Shoes",
        "Luxury Handbag Collection",
        "Casual Wardrobe Bundle",
        "Winter Coat - Like New",
        "Professional Workwear Set",
        "Handmade Jewelry Pieces",
        "Limited Edition Sneakers",
        "Premium Sunglasses",
      ],
      Vehicles: [
        "Toyota Camry - Low Miles",
        "Luxury SUV - 2022 Model",
        "Electric Car - Like New",
        "Motorcycle with Accessories",
        "Commuter Bicycle",
        "Vintage Convertible",
        "Pickup Truck - Great Condition",
        "Family Minivan",
        "Off-Road 4x4 Vehicle",
        "Scooter for City Commute",
        "Project Car for Enthusiast",
        "Boat with Trailer",
      ],
      Services: [
        "Professional Photography",
        "House Cleaning Services",
        "Web Development & Design",
        "Math Tutoring for Students",
        "Personal Training Sessions",
        "Mobile Massage Therapy",
        "Language Lessons - Spanish",
        "Home Repair and Maintenance",
        "Music Production Services",
        "Resume Writing & Career Help",
        "Dog Walking & Pet Sitting",
        "Mobile Car Detailing",
      ],
      Jobs: [
        "Software Developer Position",
        "Part-time Retail Associate",
        "Marketing Coordinator Needed",
        "Remote Customer Support Role",
        "Restaurant Staff Wanted",
        "Graphic Designer - Freelance",
        "Administrative Assistant",
        "Sales Representative",
        "Healthcare Professional Opening",
        "Delivery Driver - Flexible Hours",
        "Teaching Position Available",
        "Construction Worker Needed",
      ],
      "Real Estate": [
        "Investment Property - Great ROI",
        "Commercial Space for Sale",
        "Fixer-Upper with Potential",
        "New Construction Townhouse",
        "Land for Development",
        "Luxury Home in Gated Community",
        "Multi-Family Building",
        "Vacation Property Near Beach",
        "Historic Home Downtown",
        "Move-in Ready Condo",
        "Suburban Family Home",
        "Urban Loft for Sale",
      ],
      Other: [
        "Vintage Comic Book Collection",
        "Camping Gear Bundle",
        "Musical Instruments",
        "Gardening Tools and Supplies",
        "Craft Supplies Lot",
        "Home Gym Equipment",
        "Baby Items in Great Condition",
        "Art Supplies for Students",
        "Pet Accessories",
        "Tools and Workshop Items",
        "Board Game Collection",
        "Sports Equipment Bundle",
      ],
    };

    // Get titles for this category or use a generic one
    const titles = categoryTitles[
      randomCategory as keyof typeof categoryTitles
    ] || [
      "Great Deal",
      "Must See",
      "Priced to Sell",
      "Great Condition",
      "Like New Item",
    ];

    // Add listing
    listings.push({
      id: `dynamic-${i + 1}`,
      title: titles[Math.floor(Math.random() * titles.length)],
      description: `This is a dynamically generated listing located approximately ${distance.toFixed(
        1
      )} miles from your location. It's in great condition and priced to sell quickly.`,
      price,
      image: `https://source.unsplash.com/random/900x600/?${randomCategory.toLowerCase()}`,
      location: {
        address,
        lat,
        lng,
      },
      category: randomCategory,
      createdAt: date,
      userId: `dynamic-user-${i + 1}`,
      radius,
    });
  }

  return listings;
};

// Function to get listings with simulated filtering
export const getFilteredListings = (
  search: string = "",
  category: string = "All Categories",
  maxDistance: number = 30,
  currentLocation: { lat: number; lng: number } = {
    lat: 37.7749,
    lng: -122.4194,
  }
): Listing[] => {
  // Start with static listings
  let allListings = [...mockListings];

  // Add dynamically generated listings around the user's location - increased to 60
  const dynamicListings = generateDynamicListings(currentLocation, 60);
  allListings = [...allListings, ...dynamicListings];

  // Filter by search term
  let filtered = allListings.filter(
    (listing) =>
      listing.title.toLowerCase().includes(search.toLowerCase()) ||
      listing.description.toLowerCase().includes(search.toLowerCase())
  );

  // Filter by category
  if (category !== "All Categories") {
    filtered = filtered.filter((listing) => listing.category === category);
  }

  // Filter by distance
  filtered = filtered.filter((listing) => {
    // Calculate distance between current location and listing
    const distance = calculateDistance(
      currentLocation.lat,
      currentLocation.lng,
      listing.location.lat,
      listing.location.lng
    );

    return distance <= maxDistance;
  });

  return filtered;
};

// Simple distance calculation using Haversine formula
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 3958.8; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};

const toRad = (degrees: number): number => (degrees * Math.PI) / 180;
