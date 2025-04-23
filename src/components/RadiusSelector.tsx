
import { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';

interface RadiusSelectorProps {
  onChange: (radius: number) => void;
  defaultValue?: number;
}

const RadiusSelector = ({ onChange, defaultValue = 30 }: RadiusSelectorProps) => {
  const [radius, setRadius] = useState(defaultValue);
  
  useEffect(() => {
    // Update the radius state if defaultValue changes
    if (defaultValue !== radius) {
      setRadius(defaultValue);
    }
  }, [defaultValue]);

  const handleRadiusChange = (value: number[]) => {
    const newRadius = value[0];
    setRadius(newRadius);
    // Call onChange immediately
    onChange(newRadius);
    
    // Dispatch a custom event for components that need to know about radius changes
    window.dispatchEvent(new CustomEvent('radiusChanged', { detail: { radius: newRadius } }));
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">Search Radius</h3>
        <span className="text-sm font-medium text-primary">{radius} miles</span>
      </div>
      
      <Slider
        value={[radius]}
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
  );
};

export default RadiusSelector;
