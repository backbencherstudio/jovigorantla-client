import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { api } from "@/lib/axois";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Search } from "lucide-react";

import CategoryIcons from "@/components/CategoryIcons";
import ListingItem from "@/components/ListingItem";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Input } from "@/components/ui/input";
import LocationWithRadius from "@/components/LocationWithRedius";
import SidebarAds from "@/components/ui/Sidebar-Ads";
import FilterTabs from "@/components/FilterTabs";
import { useLocationContext } from "@/context/LocationContext";

export default function Rides() {
    const isMobile = useIsMobile();
    const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
    const isDesktop = useMediaQuery("(min-width: 1024px)");
    const navigate = useNavigate();
    const location = useLocation();

    const searchParams = new URLSearchParams(location.search);
    const initialQuery = searchParams.get("query") || "";
    const [searchInput, setSearchInput] = useState(initialQuery); // used for typing

    const [searchQuery, setSearchQuery] = useState(initialQuery);

    const [isLoading, setLoading] = useState(false);
    const [listings, setListings] = useState<any[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const loadMoreRef = useRef<HTMLDivElement>(null);
    const numberOfShownListings = useRef(0);
    const listingCutoffTime = useRef("");
    const isFetchingRef = useRef(false);
    const [activeFilter, setActiveFilter] = useState("All");
    const [oldFilter, setOldFilter] = useState("");
    const {lat, lng, radius} = useLocationContext()

    const leftSidebarWidth = isDesktop ? "240px" : isTablet ? "70px" : "0px";
    const rightSidebarWidth = isDesktop ? "300px" : "0px";


    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchInput(value);

        // Optional: if cleared, reset URL and search results
        if (!value.trim()) {
            navigate(location.pathname);
            setSearchQuery(""); // clear fetched results
        }
    };

    console.log("lat => ", lat, lng, radius)

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const trimmed = searchInput.trim();

        if (trimmed) {
            navigate(`${location.pathname}?query=${encodeURIComponent(trimmed)}`);
            setSearchQuery(trimmed); // trigger search
        } else {
            navigate(location.pathname);
            setSearchQuery(""); // reset to default
        }
    };



    const fetchNearByListings = async (filter: string, query: string) => {
        if (isFetchingRef.current) return;
        isFetchingRef.current = true;

        try {
            setLoading(true);
            const shownCount = numberOfShownListings.current || 0;

            const sub_category = filter !== "All" ? filter : null;

            const { data: listingResponse } = await api.get("/listings/nearby", {
                params: {
                    category: "RIDES",
                    sub_category,
                    search: query,
                    limit: 10,
                    numberOfShownListings: shownCount,
                    lat: lat,
                    lng: lng,
                    radius: radius,
                },
            });

            const data = listingResponse.data;


            if (data.listings && data.listings.length > 0) {
                if (shownCount === 0 || oldFilter !== filter) {
                    setListings(data.listings);
                    setOldFilter(filter);
                    listingCutoffTime.current = data.listings.listingCutoffTime;
                    numberOfShownListings.current = data.listings.filter(listing => listing.type === "listing").length;
                } else {
                    setListings(prev => [...prev, ...data.listings]);
                    numberOfShownListings.current += data.listings.filter(listing => listing.type === "listing").length;
                }
                setHasMore(data.hasMore);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Error fetching listings:", error);
        } finally {
            setLoading(false);
            isFetchingRef.current = false;
        }
    };

    useEffect(() => {
        numberOfShownListings.current = 0;
        setListings([]);
        setHasMore(true);
        fetchNearByListings(activeFilter, searchQuery);
    }, [activeFilter, searchQuery, lat, lng, radius]);


    useEffect(() => {
        const queryParam = new URLSearchParams(location.search).get("query") || "";
        setSearchQuery(queryParam);
        setSearchInput(queryParam); // keep input updated too
    }, [location.search]);


    const handleFilterClick = (filter: string) => {
        setActiveFilter(filter);
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                const first = entries[0];
                if (first.isIntersecting && hasMore && !isLoading) {
                    fetchNearByListings(activeFilter, searchQuery);
                }
            },
            { threshold: 1 }
        );

        const currentElement = loadMoreRef.current;
        if (currentElement) observer.observe(currentElement);

        return () => {
            if (currentElement) observer.unobserve(currentElement);
        };
    }, [hasMore, isLoading]);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header
                searchInput={searchInput}
                onSearchInputChange={setSearchInput}
                onSearchSubmit={(value) => {
                    const trimmed = value.trim();
                    if (trimmed) {
                        navigate(`${location.pathname}?query=${encodeURIComponent(trimmed)}`);
                        setSearchQuery(trimmed);
                    } else {
                        navigate(location.pathname);
                        setSearchQuery("");
                    }
                }}
            />


            <div className="flex flex-1">
                {!isMobile && (
                    <div className="fixed left-0 top-[60px] h-[calc(100vh-60px)] overflow-y-auto z-10 bg-white shadow-sm">
                        <Sidebar collapsed={isTablet} />
                    </div>
                )}

                <div
                    className="flex-1 listings-container"
                    style={{
                        marginLeft: !isMobile ? leftSidebarWidth : "0",
                        marginRight: isDesktop ? rightSidebarWidth : "0",
                    }}
                >
                    <main className="w-full mx-auto max-w-3xl bg-transparent">
                        {isMobile && (
                            <div className="z-10 transition-transform bg-white px-4 pt-2 pb-2">
                                <form onSubmit={handleSearchSubmit}>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                        <Input
                                            type="text"
                                            placeholder="Search"
                                            value={searchInput}
                                            onChange={handleSearchChange}
                                            className="pl-10 pr-4 py-2 rounded-full bg-gray-100 border-none h-10"
                                        />
                                    </div>
                                </form>
                                <div className="mt-2 flex items-center justify-end">
                                    <LocationWithRadius />
                                </div>
                                <div className="pb-2">
                                    <CategoryIcons />
                                </div>
                            </div>
                        )}

                        <div className="sticky top-[60px] z-10 border-b border-gray-100 bg-[#F9FAFB]">
                            <FilterTabs tabs={["All", "Available", "Looking"]} activeTab={activeFilter} onTabClick={handleFilterClick} />
                        </div>

                        <div className="px-4 mt-4 space-y-4">
                            {listings.map((listing, index) => (
                                <div key={`${listing.id}-${index}`}>
                                    {listing?.type === "listing" && (
                                        <ListingItem listing={listing} onToggleSave={() => { }} isUsa={false} />
                                    )}
                                    {listing?.type === "ad" && (
                                        <a href={listing.target_url} target="_blank" className="block" rel="noreferrer">
                                            <div
                                                className="relative w-full max-w-full rounded-lg shadow-md bg-white cursor-pointer"
                                                style={{ aspectRatio: "574/300", maxWidth: "574px" }}
                                            >
                                                <img
                                                    src={listing.image_url}
                                                    alt={listing.title}
                                                    className="absolute inset-0 w-full h-full object-cover rounded-lg"
                                                />
                                            </div>
                                        </a>
                                    )}
                                </div>
                            ))}

                            {hasMore && (
                                <div
                                    ref={loadMoreRef}
                                    className="w-full flex justify-center py-6 text-gray-400 text-sm"
                                >
                                    Loading more...
                                </div>
                            )}
                        </div>
                    </main>
                </div>

                {isDesktop && (
                    <div className="w-[260px] fixed right-0 top-[60px] bottom-0 bg-white shadow-sm">
                        <div className="sticky top-[70px] p-2 space-y-4 overflow-y-auto h-[calc(100vh-70px)] thin-scrollbar">
                            <SidebarAds className="mb-4" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
