import { clsx, type ClassValue } from "clsx"
import { formatDistanceToNow } from "date-fns";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// export const formatTime = (date: string) => {
//   const timeAgo = formatDistanceToNow(new Date(date), {
//     addSuffix: true,
//   });

//   // Replace "about" with empty string
//   let formattedTime = timeAgo.replace("about ", "");

//   // Replace "less than a minute" with "1m"
//   formattedTime = formattedTime.replace("less than a minute ago", "1m ago");

//   // Replace "1 minute" with "1m"
//   formattedTime = formattedTime.replace("1 minute ago", "1m ago");

//   // Replace "X minutes" with "Xm"
//   formattedTime = formattedTime.replace(/(\d+) minutes? ago/, "$1m ago");

//   // Replace "1 hour" with "1h"
//   formattedTime = formattedTime.replace("1 hour ago", "1h ago");

//   // Replace "X hours" with "Xh"
//   formattedTime = formattedTime.replace(/(\d+) hours? ago/, "$1h ago");

//   // Replace "1 day" with "1d"
//   formattedTime = formattedTime.replace("1 day ago", "1d ago");

//   // Replace "X days" with "Xd"
//   formattedTime = formattedTime.replace(/(\d+) days? ago/, "$1d ago");
//   return formattedTime;
// };


// export const formatTime = (date: string) => {
//   const now = new Date();
//   const targetDate = new Date(date);
//   const differenceInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);

//   // Calculate the difference in years, days, hours, minutes, and seconds
//   const seconds = differenceInSeconds;
//   const minutes = Math.floor(differenceInSeconds / 60);
//   const hours = Math.floor(differenceInSeconds / 3600);
//   const days = Math.floor(differenceInSeconds / 86400);
//   const years = Math.floor(differenceInSeconds / (3600 * 24 * 365)); // Seconds in a year

//   let formattedTime = '';

//   // Formatting the time
//   if (years > 0) {
//     formattedTime = years === 1 ? "1y ago" : `${years}y ago`;
//   } else if (days < 1) {
//     formattedTime = seconds < 1 ? "Just now" : `${seconds} seconds ago`;
//   } else if (days < 30) {
//     formattedTime = days === 1 ? "1d ago" : `${days}d ago`;
//   } else if (days < 365) {
//     const months = Math.floor(days / 30);
//     formattedTime = months === 1 ? "1m ago" : `${months} m ago`;
//   } else if (hours < 24) {
//     formattedTime = hours === 1 ? "1h ago" : `${hours}h ago`;
//   } else if (minutes < 60) {
//     formattedTime = minutes === 1 ? "1m ago" : `${minutes}m ago`;
//   } else {
//     formattedTime = hours === 1 ? "1h ago" : `${hours}h ago`;
//   }

//   return formattedTime;
// };

export const formatTime = (date: string) => {
  const now = new Date();
  const targetDate = new Date(date);
  const differenceInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);

  // Calculate the difference in years, months, days, hours, minutes, and seconds
  const seconds = differenceInSeconds;
  const minutes = Math.floor(differenceInSeconds / 60);
  const hours = Math.floor(differenceInSeconds / 3600);
  const days = Math.floor(differenceInSeconds / 86400);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  let formattedTime = '';

  // Formatting the time
  if (years > 0) {
    formattedTime = years === 1 ? "1y ago" : `${years}y ago`;
  } else if (months > 0) {
    formattedTime = months === 1 ? "1m ago" : `${months}m ago`;
  } else if (days > 0) {
    formattedTime = days === 1 ? "1d ago" : `${days}d ago`;
  } else if (hours > 0) {
    formattedTime = hours === 1 ? "1h ago" : `${hours}h ago`;
  } else if (minutes > 0) {
    formattedTime = minutes === 1 ? "1m ago" : `${minutes}m ago`;
  } else {
    formattedTime = seconds === 1 ? "1s ago" : `${seconds}s ago`;
  }

  return formattedTime;
};


