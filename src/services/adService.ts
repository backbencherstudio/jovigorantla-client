
import { AdGroup } from "@/types/ads";

// This is a client-side service to manage ads globally across the application
class AdService {
  private adGroups: AdGroup[] = [];
  private currentAdIndex: Record<string, number> = {}; // Track current ad index per group
  private adPositions: Record<string, number[]> = {}; // Track ad positions inserted into listing pages
  private sidebarAds: Record<string, {imageUrl: string; targetUrl: string; active: boolean; views: number; clicks: number}> = {
    top: {
      imageUrl: "https://via.placeholder.com/300x600?text=Top+Sidebar",
      targetUrl: "https://example.com",
      active: true,
      views: 0,
      clicks: 0
    },
    bottom: {
      imageUrl: "https://via.placeholder.com/300x600?text=Bottom+Sidebar",
      targetUrl: "https://example.com",
      active: true,
      views: 0,
      clicks: 0
    },
  };

  constructor() {
    this.loadAdGroups();
    this.loadSidebarAds();
  }

  private loadAdGroups(): void {
    try {
      const adGroupsData = localStorage.getItem('adGroups');
      if (adGroupsData) {
        this.adGroups = JSON.parse(adGroupsData, (key, value) => {
          // Convert date strings back to Date objects
          if (key === 'createdAt' || key === 'startDate' || key === 'endDate') {
            return value ? new Date(value) : null;
          }
          return value;
        });
        
        // Initialize ad indexes
        this.adGroups.forEach(group => {
          this.currentAdIndex[group.id] = 0;
          this.adPositions[group.id] = [];
        });
      }
    } catch (error) {
      console.error('Error loading ad groups:', error);
      this.adGroups = [];
    }
  }

  private loadSidebarAds(): void {
    try {
      const sidebarAdsData = localStorage.getItem('sidebarAds');
      if (sidebarAdsData) {
        this.sidebarAds = JSON.parse(sidebarAdsData);
      }
    } catch (error) {
      console.error('Error loading sidebar ads:', error);
      // Default values are already set in the property definition
    }
  }

  public saveSidebarAds(): void {
    localStorage.setItem('sidebarAds', JSON.stringify(this.sidebarAds));
  }

  public getSidebarAd(position: 'top' | 'bottom'): { imageUrl: string; targetUrl: string; active: boolean } | null {
    return this.sidebarAds[position];
  }

  public updateSidebarAd(position: 'top' | 'bottom', imageUrl: string, targetUrl: string): void {
    this.sidebarAds[position] = {
      ...this.sidebarAds[position],
      imageUrl,
      targetUrl
    };
    this.saveSidebarAds();
  }

  public toggleSidebarAdActive(position: 'top' | 'bottom'): void {
    if (this.sidebarAds[position]) {
      this.sidebarAds[position].active = !this.sidebarAds[position].active;
      this.saveSidebarAds();
    }
  }

  public recordSidebarAdView(position: 'top' | 'bottom'): void {
    if (this.sidebarAds[position] && this.sidebarAds[position].active) {
      this.sidebarAds[position].views++;
      this.saveSidebarAds();
    }
  }

  public recordSidebarAdClick(position: 'top' | 'bottom'): void {
    if (this.sidebarAds[position] && this.sidebarAds[position].active) {
      this.sidebarAds[position].clicks++;
      this.saveSidebarAds();
    }
  }

  public getAdForPage(pageName: string, listingIndex: number): { id: string; imageUrl: string; targetUrl: string; name?: string } | null {
    // If no ad groups, return null
    if (this.adGroups.length === 0) return null;
    
    // Find active ad groups assigned to this page
    const activeGroups = this.adGroups.filter(group => 
      group.active && 
      group.pages.includes(pageName.toLowerCase()) &&
      group.ads.some(ad => ad.active)
    );
    
    if (activeGroups.length === 0) return null;
    
    // For now, use the first active group
    const group = activeGroups[0];
    
    // Check if we should insert an ad at this index based on frequency
    if (listingIndex % group.frequency !== 0 || listingIndex === 0) return null;
    
    // Get active ads
    const activeAds = group.ads.filter(ad => ad.active);
    if (activeAds.length === 0) return null;
    
    // Get the next ad based on rotation mode
    let ad;
    if (group.rotationMode === 'sequential') {
      ad = activeAds[this.currentAdIndex[group.id] % activeAds.length];
      this.currentAdIndex[group.id] = (this.currentAdIndex[group.id] + 1) % activeAds.length;
    } else {
      // Random mode
      const randomIndex = Math.floor(Math.random() * activeAds.length);
      ad = activeAds[randomIndex];
    }
    
    // Record this ad view (in a real app, would track this in the backend)
    // For this demo, we just increment the local count
    const updatedAdGroups = this.adGroups.map(g => {
      if (g.id === group.id) {
        return {
          ...g,
          ads: g.ads.map(a => {
            if (a.id === ad.id) {
              return {
                ...a,
                views: a.views + 1
              };
            }
            return a;
          })
        };
      }
      return g;
    });
    
    // Update localStorage
    localStorage.setItem('adGroups', JSON.stringify(updatedAdGroups));
    
    return {
      id: ad.id,
      imageUrl: ad.imageUrl,
      targetUrl: ad.targetUrl,
      name: ad.name
    };
  }

  public recordAdClick(adId: string): void {
    // Find the ad and increment its click count
    const updatedAdGroups = this.adGroups.map(group => {
      return {
        ...group,
        ads: group.ads.map(ad => {
          if (ad.id === adId) {
            return {
              ...ad,
              clicks: ad.clicks + 1
            };
          }
          return ad;
        })
      };
    });
    
    // Update in-memory state and localStorage
    this.adGroups = updatedAdGroups;
    localStorage.setItem('adGroups', JSON.stringify(updatedAdGroups));
  }
}

// Create a singleton instance
const adService = new AdService();

export default adService;
