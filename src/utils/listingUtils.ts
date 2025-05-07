
import { formatDistanceToNow } from 'date-fns';
import { ListingType } from '@/types/listing';

export const formatTime = (date: Date) => {
  const timeAgo = formatDistanceToNow(date, { addSuffix: true });
  
  // Replace "about" with empty string
  let formattedTime = timeAgo.replace('about ', '');
  
  // Replace "less than a minute" with "1m"
  formattedTime = formattedTime.replace('less than a minute ago', '1m ago');
  
  // Replace "1 minute" with "1m"
  formattedTime = formattedTime.replace('1 minute ago', '1m ago');
  
  // Replace "X minutes" with "Xm"
  formattedTime = formattedTime.replace(/(\d+) minutes? ago/, '$1m ago');
  
  // Replace "1 hour" with "1h"
  formattedTime = formattedTime.replace('1 hour ago', '1h ago');
  
  // Replace "X hours" with "Xh"
  formattedTime = formattedTime.replace(/(\d+) hours? ago/, '$1h ago');
  
  // Replace "1 day" with "1d"
  formattedTime = formattedTime.replace('1 day ago', '1d ago');
  
  // Replace "X days" with "Xd"
  formattedTime = formattedTime.replace(/(\d+) days? ago/, '$1d ago');
  
  // Replace "yesterday" with "1d ago"
  formattedTime = formattedTime.replace('yesterday', '1d ago');
  
  // Replace "today" with appropriate hours
  formattedTime = formattedTime.replace('today', new Date().getHours() + 'h ago');
  
  return formattedTime;
};

export const generateMockListings = (category: string, count: number = 50) => {
  const statuses = category === 'Jobs' 
    ? ['Hiring', 'Looking'] 
    : category === 'Marketplace' 
      ? ['Items', 'Services']
      : ['Available', 'Looking'];
  
  const locations = ['Denton, TX', 'Irving, TX', 'Plano, TX', 'Dallas, TX', 'Fort Worth, TX'];
  const userNames = ['Ramesh', 'Krishna', 'Ravi', 'Priya', 'Sundar', 'Lakshmi', 'Arjun'];
  
  // Generate different creation dates
  const getRandomDate = () => {
    const now = new Date();
    const daysAgo = Math.floor(Math.random() * 14); // 0 to 14 days ago
    const hoursAgo = Math.floor(Math.random() * 24); // 0 to 24 hours ago
    const minutesAgo = Math.floor(Math.random() * 60); // 0 to 60 minutes ago
    
    const result = new Date(now);
    result.setDate(result.getDate() - daysAgo);
    result.setHours(result.getHours() - hoursAgo);
    result.setMinutes(result.getMinutes() - minutesAgo);
    return result;
  };
  
  // Different titles based on category
  const getTitles = () => {
    switch (category) {
      case 'Accommodations':
        return [
          'Looking for a private room in 2b2b near irving',
          'Apartment for rent near UNT',
          'Room available in 3BHK apartment',
          'Looking for roommate in downtown',
          'Studio apartment available near UTD',
          'Private room with attached bathroom',
          'Shared apartment available immediately',
          'Looking for female roommate near Frisco'
        ];
      case 'Jobs':
        return [
          'Software Developer position available',
          'Looking for part-time job in retail',
          'Hiring experienced chef',
          'Job opening for UI/UX designer',
          'Looking for accounting position',
          'Hiring delivery drivers',
          'Remote job opportunity for content writer',
          'Looking for internship in marketing'
        ];
      case 'Rides':
        return [
          'Daily ride share to downtown Dallas',
          'Looking for ride to Houston this weekend',
          'Offering carpool to Austin',
          'Need ride to DFW airport on Friday',
          'Daily commute share to Plano',
          'Looking for long-term ride share partner',
          'Weekend rides available to Oklahoma',
          'Need ride to San Antonio next week'
        ];
      case 'Marketplace':
        return [
          'iPhone 13 Pro for sale',
          'Offering math tutoring services',
          'IKEA furniture for sale',
          'Professional photography services',
          'Moving sale - everything must go',
          'PlayStation 5 barely used',
          'Web development services',
          'Brand new Nike shoes for sale'
        ];
      default:
        return [
          'Looking for a private room in 2b2b near irving',
          'iPhone 13 Pro for sale',
          'Daily ride share to downtown Dallas',
          'Software Developer position available',
          'Room available in 3BHK apartment',
          'IKEA furniture for sale',
          'Need ride to DFW airport on Friday',
          '0123456789 0123456789 0123456789 0123456789 0123456789 '
        ];
    }
  };
  
  const titles = getTitles();
  
  return Array.from({ length: count }, (_, i) => {
    const createdAt = getRandomDate();
    
    return {
      id: `${category}-${i + 1}`,
      title: titles[i % titles.length],
      category: category === 'Home' ? ['Accommodations', 'Marketplace', 'Rides', 'Jobs'][i % 4] : category,
      status: statuses[i % statuses.length],
      userName: userNames[i % userNames.length],
      postedTime: formatTime(createdAt),
      location: locations[i % locations.length],
      createdAt,
      saved: false
    };
  });
};

export const getSavedListingsIds = (userId: string | undefined) => {
  if (!userId) return [];
  console.log("Getting saved listings for user:", userId);
  return JSON.parse(localStorage.getItem(`savedListings_${userId}`) || '[]');
};

export const updateSavedStatus = (listingsToUpdate: ListingType[], userId: string | undefined) => {
  if (!userId) return listingsToUpdate;
  
  const savedIds = getSavedListingsIds(userId);
  console.log("Saved IDs:", savedIds);
  return listingsToUpdate.map(listing => ({
    ...listing,
    saved: savedIds.includes(listing.id)
  }));
};

// Helper function to get different filter tabs based on category
export const getFilterTabs = (category: string) => {
  switch (category) {
    case 'Home':
      return ['Nearby', 'USA'];
    case 'Marketplace':
      return ['All', 'Items', 'Services'];
    case 'Accommodations':
      return ['All', 'Available', 'Looking'];
    case 'Rides':
      return ['All', 'Available', 'Looking'];
    case 'Jobs':
      return ['All', 'Hiring', 'Looking'];
    default:
      return ['All', 'Available', 'Looking'];
  }
};

// Helper function to determine the current category based on path
export const getPageCategory = (path: string) => {
  if (path === '/') return 'Home';
  if (path === '/marketplace') return 'Marketplace';
  if (path === '/accommodations') return 'Accommodations';
  if (path === '/rides') return 'Rides';
  if (path === '/jobs') return 'Jobs';
  return 'Home';
};
