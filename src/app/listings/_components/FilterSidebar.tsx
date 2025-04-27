
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

// Define reasonable limits for the slider, but inputs can go beyond
const SLIDER_MIN_PRICE = 150000;
const SLIDER_MAX_PRICE = 50000000; // Slider max remains 50M for practical range selection

// Define the type for the filter values
export type FilterValues = {
    location: string;
    propertyType: string;
    bedrooms: string;
    minPrice: number | null;
    maxPrice: number | null;
    amenities: string[];
};

interface FilterSidebarProps {
    onApplyFilters: (filters: FilterValues) => void; // Callback to parent
}

const ALL_AMENITIES = [
    "Water Supply", "Electricity", "Security", "Parking Space",
    "Furnished", "Air Conditioning", "Tiled Floors", "Prepaid Meter",
    "Generator", "Water Heater", "Gated Estate", "Garden", "Balcony", "Swimming Pool"
];


export function FilterSidebar({ onApplyFilters }: FilterSidebarProps) {
    // State for filter inputs
    const [location, setLocation] = useState('');
    const [propertyType, setPropertyType] = useState('');
    const [bedrooms, setBedrooms] = useState('');
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

    // State for the selected price range [min, max] used *only* by the Slider
    const [sliderPriceRange, setSliderPriceRange] = useState<[number, number]>([SLIDER_MIN_PRICE, SLIDER_MAX_PRICE]);
    // State for the input field values (as strings), independent of slider limits
    const [minPriceInput, setMinPriceInput] = useState<string>(''); // Start empty
    const [maxPriceInput, setMaxPriceInput] = useState<string>(''); // Start empty

    // Update inputs when slider changes
    const handleSliderChange = (value: number[]) => {
        const [min, max] = value;
        setSliderPriceRange([min, max]); // Update slider's internal state
        setMinPriceInput(min.toLocaleString()); // Update min input to match slider
        setMaxPriceInput(max === SLIDER_MAX_PRICE ? '' : max.toLocaleString()); // Update max input, leave empty if at slider max
    };

    // Handle changes in the Min Price input field
    const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMinPriceInput(e.target.value); // Update string state directly
    };

    // Handle changes in the Max Price input field
    const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMaxPriceInput(e.target.value); // Update string state directly
    };

    // Format Min Price input when it loses focus
    const handleMinInputBlur = () => {
        const rawValue = minPriceInput;
        const numericValue = parseInt(rawValue.replace(/,/g, ''), 10);

        if (!isNaN(numericValue) && numericValue >= 0) {
             setMinPriceInput(numericValue.toLocaleString());
        } else if (rawValue.trim() !== '') {
             setMinPriceInput(''); // Clear if invalid
        }
    };

     // Format Max Price input when it loses focus
    const handleMaxInputBlur = () => {
        const rawValue = maxPriceInput;
        const numericValue = parseInt(rawValue.replace(/,/g, '').replace(/\+/g, ''), 10);

        if (!isNaN(numericValue) && numericValue >= 0) {
             setMaxPriceInput(numericValue.toLocaleString());
        } else if (rawValue.trim() !== '') {
             setMaxPriceInput(''); // Clear if invalid
        }
    };

    // Handle Amenity Checkbox Change
    const handleAmenityChange = (amenity: string, checked: boolean) => {
        setSelectedAmenities(prev =>
            checked ? [...prev, amenity] : prev.filter(item => item !== amenity)
        );
    };

    // Handle Apply Filters button click
    const handleApplyFilters = () => {
        // Parse prices from input strings
        const minPrice = minPriceInput ? parseInt(minPriceInput.replace(/,/g, ''), 10) : null;
        const maxPrice = maxPriceInput ? parseInt(maxPriceInput.replace(/,/g, ''), 10) : null;

        const filters: FilterValues = {
            location,
            propertyType,
            bedrooms,
            minPrice: isNaN(minPrice as number) ? null : minPrice,
            maxPrice: isNaN(maxPrice as number) ? null : maxPrice,
            amenities: selectedAmenities,
        };
        console.log("Applying Filters:", filters); // Log filters before applying
        onApplyFilters(filters);
    };

    return (
        <Card className="lg:w-1/4 xl:w-1/5 h-fit sticky top-20 shadow-sm">
            <CardHeader>
                <CardTitle className="text-lg">Filter Properties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                        id="location"
                        placeholder="e.g., Lekki, Yaba"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="propertyType">Property Type</Label>
                    <Select value={propertyType} onValueChange={setPropertyType}>
                        <SelectTrigger id="propertyType">
                            <SelectValue placeholder="Any Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">Any Type</SelectItem> {/* Add empty value */}
                            <SelectItem value="apartment">Apartment / Flat</SelectItem>
                            <SelectItem value="duplex">Duplex</SelectItem>
                            <SelectItem value="studio">Studio Apartment</SelectItem>
                            <SelectItem value="bungalow">Bungalow</SelectItem>
                            <SelectItem value="terrace">Terrace House</SelectItem>
                            <SelectItem value="penthouse">Penthouse</SelectItem>
                            <SelectItem value="self-contain">Self-Contain</SelectItem>
                            <SelectItem value="airbnb">Airbnb / Short Let</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                 <div className="space-y-2">
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Select value={bedrooms} onValueChange={setBedrooms}>
                        <SelectTrigger id="bedrooms">
                            <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">Any</SelectItem> {/* Add empty value */}
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="4">4</SelectItem>
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="6">6+</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Price Range Filter */}
                <div className="space-y-4">
                   <Label>Price Range (₦/year)</Label> {/* Assuming yearly for now */}
                   {/* Display current slider range */}
                   <div className="flex justify-between text-xs text-muted-foreground">
                      <span>₦{SLIDER_MIN_PRICE.toLocaleString()}</span>
                      <span>₦{SLIDER_MAX_PRICE.toLocaleString()}+</span>
                   </div>
                   <Slider
                      value={sliderPriceRange} // Slider is controlled by its own state
                      min={SLIDER_MIN_PRICE}
                      max={SLIDER_MAX_PRICE}
                      step={100000}
                      onValueChange={handleSliderChange} // Updates inputs when slider moves
                      className="my-4"
                   />
                    {/* Min/Max Input Boxes */}
                    <div className="flex justify-between items-center gap-2">
                        <div className="flex-1 space-y-1">
                             <Label htmlFor="minPrice" className="text-xs text-muted-foreground">Min Price</Label>
                             <Input
                                id="minPrice"
                                type="text" // Use text to allow commas during input
                                value={minPriceInput} // Controlled by independent string state
                                onChange={handleMinInputChange} // Update only input state
                                onBlur={handleMinInputBlur} // Format input on blur
                                placeholder={`e.g., ${SLIDER_MIN_PRICE.toLocaleString()}`}
                                className="h-9 text-sm"
                            />
                        </div>
                         <span className="text-muted-foreground pt-5">-</span>
                        <div className="flex-1 space-y-1">
                             <Label htmlFor="maxPrice" className="text-xs text-muted-foreground">Max Price</Label>
                             <Input
                                id="maxPrice"
                                type="text" // Use text to allow commas
                                value={maxPriceInput} // Controlled by independent string state
                                onChange={handleMaxInputChange} // Update only input state
                                onBlur={handleMaxInputBlur} // Format input on blur
                                placeholder="Any"
                                className="h-9 text-sm"
                            />
                        </div>
                    </div>
                     {/* TODO: Add frequency selector (Year/Month/Week) if needed */}
                </div>


                <div className="space-y-2">
                    <Label>Amenities</Label>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2"> {/* Scrollable amenities */}
                        {ALL_AMENITIES.map(amenity => (
                            <div key={amenity} className="flex items-center space-x-2">
                                <Checkbox
                                    id={amenity.replace(/\s+/g, '-').toLowerCase()} // Generate unique ID
                                    checked={selectedAmenities.includes(amenity)}
                                    onCheckedChange={(checked) => handleAmenityChange(amenity, !!checked)}
                                />
                                <Label htmlFor={amenity.replace(/\s+/g, '-').toLowerCase()} className="font-normal text-sm">
                                    {amenity}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>

                <Button className="w-full bg-primary hover:bg-primary/90" onClick={handleApplyFilters}>
                   <Search className="mr-2 h-4 w-4" /> Apply Filters
                </Button>
            </CardContent>
        </Card>
    );
}
