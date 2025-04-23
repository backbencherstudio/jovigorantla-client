import React, { useState, useRef, useEffect } from 'react';
import { MapPin, X, Check, Loader2, Locate } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useGeolocation } from '@/hooks/useGeolocation';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';

interface LocationSelectorProps {
  onChange?: (location: string) => void;
  className?: string;
  compact?: boolean;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ onChange, className, compact = false }) => {
  const { locationString, updateLocation, loading, radius, updateRadius } = useGeolocation();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [radiusValue, setRadiusValue] = useState(radius || 10);
  const inputRef = useRef<HTMLInputElement>(null);
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    if (locationString) {
      setDisplayText(locationString);
      setInputValue(locationString);
    }
    if (radius) {
      setRadiusValue(radius);
    }
  }, [locationString, radius]);

  // Listen for location and radius changes
  useEffect(() => {
    const handleLocationUpdate = () => {
      if (locationString) {
        setInputValue(locationString);
        setDisplayText(locationString);
      }
    };

    const handleRadiusUpdate = () => {
      if (radius !== radiusValue) {
        setRadiusValue(radius);
      }
    };

    window.addEventListener('locationUpdated', handleLocationUpdate);
    window.addEventListener('radiusUpdated', handleRadiusUpdate);

    return () => {
      window.removeEventListener('locationUpdated', handleLocationUpdate);
      window.removeEventListener('radiusUpdated', handleRadiusUpdate);
    };
  }, [locationString, radius, radiusValue]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    await updateLocation(inputValue);
    await updateRadius(radiusValue);
    
    onChange?.(inputValue);
    
    // Dispatch custom events for real-time updates
    window.dispatchEvent(new Event('locationUpdated'));
    window.dispatchEvent(new Event('radiusUpdated'));
    
    setIsOpen(false);
  };

  const handleClear = () => {
    setInputValue('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleRadiusChange = async (value: number[]) => {
    const newRadius = value[0];
    setRadiusValue(newRadius);
    
    // Update radius immediately and dispatch event
    await updateRadius(newRadius);
    window.dispatchEvent(new Event('radiusUpdated'));
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      toast('Updating your location...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const locationString = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
          
          updateLocation(locationString)
            .then(success => {
              if (success) {
                toast.success('Location updated successfully');
                setInputValue(locationString);
                setDisplayText(locationString);
              } else {
                toast.error('Failed to update location');
              }
            });
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Could not get your location. Please try again.');
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser');
    }
  };
  
  // Compact style for form input
  if (compact) {
    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className={`flex items-center justify-between text-sm w-full ${className}`}
          >
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-primary" />
              <span className="truncate">{displayText || 'Select location'}</span>
            </div>
            {radius && <span className="text-xs text-gray-500 ml-1">• {radius} mi</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3" align="start">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="City or zip code"
                className="pl-9 pr-9"
                autoFocus
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center">
                {inputValue && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="mr-1"
                  >
                    <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  className="text-brand hover:text-brand/80"
                >
                  <Locate className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-black text-sm font-medium">Search Radius</span>
                <span className="text-brand text-sm">{radiusValue} miles</span>
              </div>
              
              <Slider
                value={[radiusValue]}
                min={5}
                max={100}
                step={5}
                onValueChange={handleRadiusChange}
                className="my-2"
              />
              
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>5 mi</span>
                <span>50 mi</span>
                <span>100 mi</span>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 text-xs"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                size="sm"
                disabled={loading || !inputValue.trim()}
                className="h-8 text-xs"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Check className="h-3 w-3 mr-1" />
                    Update
                  </>
                )}
              </Button>
            </div>
          </form>
        </PopoverContent>
      </Popover>
    );
  }

  // Original style for non-form context (e.g. header)
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant={className ? "outline" : "ghost"} 
          className={`flex items-center text-sm px-2 ${className}`}
        >
          <MapPin className="h-4 w-4 mr-0.5 text-primary" />
          <span className="truncate">
            {displayText || 'Select location'}
            {radius && ` • ${radius} mi`}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="start">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="City or zip code"
              className="pl-9 pr-9"
              autoFocus
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center">
              {inputValue && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="mr-1"
                >
                  <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </button>
              )}
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                className="text-brand hover:text-brand/80"
              >
                <Locate className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-black text-sm font-medium">Search Radius</span>
              <span className="text-brand text-sm">{radiusValue} miles</span>
            </div>
            
            <Slider
              value={[radiusValue]}
              min={5}
              max={100}
              step={5}
              onValueChange={handleRadiusChange}
              className="my-2"
            />
            
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>5 mi</span>
              <span>50 mi</span>
              <span>100 mi</span>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 text-xs"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              size="sm"
              disabled={loading || !inputValue.trim()}
              className="h-8 text-xs"
            >
              {loading ? (
                <>
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Check className="h-3 w-3 mr-1" />
                  Update
                </>
              )}
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default LocationSelector;
