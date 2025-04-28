

'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";
import { Search, Gamepad2 } from "lucide-react"; // Added Gamepad2
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

// Initial state definition (useful for resetting)
const initialFilterState: FilterValues = {
    location: '',
    propertyType: 'all',
    bedrooms: 'all',
    minPrice: null,
    maxPrice: null,
    amenities: [],
};

interface FilterSidebarProps {
    onApplyFilters: (filters: FilterValues) => void; // Callback to parent
    // Add a key prop that changes when filters should be reset
    resetKey: number;
}

const ALL_AMENITIES = [
    "Water Supply", "Electricity", "Security", "Parking Space",
    "Furnished", "Air Conditioning", "Tiled Floors", "Prepaid Meter",
    "Generator", "Water Heater", "Gated Estate", "Garden", "Balcony", "Swimming Pool",
    "Wifi", "PS5", // Added Wifi and PS5
];


export function FilterSidebar({ onApplyFilters, resetKey }: FilterSidebarProps) {
    // State for filter inputs - Initialize with default values
    const [location, setLocation] = useState(initialFilterState.location);
    const [propertyType, setPropertyType] = useState(initialFilterState.propertyType);
    const [bedrooms, setBedrooms] = useState(initialFilterState.bedrooms);
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>(initialFilterState.amenities);

    // State for the selected price range [min, max] used *only* by the Slider
    const [sliderPriceRange, setSliderPriceRange] = useState<[number, number]>([SLIDER_MIN_PRICE, SLIDER_MAX_PRICE]);
    // State for the input field values (as strings), independent of slider limits
    const [minPriceInput, setMinPriceInput] = useState<string>(initialFilterState.minPrice?.toString() || ''); // Start empty
    const [maxPriceInput, setMaxPriceInput] = useState<string>(initialFilterState.maxPrice?.toString() || ''); // Start empty

     // Effect to reset state when resetKey changes (and it's not the initial render)
     useEffect(() => {
        // Only reset if resetKey has actually changed from its initial value (e.g., 0)
        // This prevents resetting on the first render.
        if (resetKey > 0) {
            console.log("Resetting FilterSidebar state...");
            setLocation(initialFilterState.location);
            setPropertyType(initialFilterState.propertyType);
            setBedrooms(initialFilterState.bedrooms);
            setSelectedAmenities(initialFilterState.amenities);
            setMinPriceInput(initialFilterState.minPrice?.toString() || '');
            setMaxPriceInput(initialFilterState.maxPrice?.toString() || '');
            setSliderPriceRange([SLIDER_MIN_PRICE, SLIDER_MAX_PRICE]);
        }
    }, [resetKey]);


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
            propertyType: propertyType === 'all' ? '' : propertyType, // Convert 'all' back to empty string if needed by filtering logic
            bedrooms: bedrooms === 'all' ? '' : bedrooms, // Convert 'all' back to empty string if needed
            minPrice: isNaN(minPrice as number) ? null : minPrice,
            maxPrice: isNaN(maxPrice as number) ? null : maxPrice,
            amenities: selectedAmenities,
        };
        console.log("Applying Filters:", filters); // Log filters before applying
        onApplyFilters(filters);
    };


    return (
        // Adjusted width lg:w-64, xl:w-72
        <Card className="lg:w-64 xl:w-72 h-fit sticky top-20 shadow-sm">
            <CardHeader className="pb-4 pt-5"> {/* Reduced padding */}
                <CardTitle className="text-md">Filter Properties</CardTitle> {/* Smaller title */}
            </CardHeader>
            <CardContent className="space-y-4 text-sm"> {/* Reduced spacing and text size */}
                <div className="space-y-1.5"> {/* Reduced spacing */}
                    <Label htmlFor="location" className="text-xs">Location</Label> {/* Smaller label */}
                    <Input
                        id="location"
                        placeholder="e.g., Lekki, Yaba"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="h-8 text-xs" // Smaller input
                    />
                </div>

                <div className="space-y-1.5"> {/* Reduced spacing */}
                    <Label htmlFor="propertyType" className="text-xs">Property Type</Label> {/* Smaller label */}
                    <Select value={propertyType} onValueChange={setPropertyType}>
                        <SelectTrigger id="propertyType" className="h-8 text-xs"> {/* Smaller trigger */}
                            <SelectValue placeholder="Any Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Any Type</SelectItem>
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

                 <div className="space-y-1.5"> {/* Reduced spacing */}
                    <Label htmlFor="bedrooms" className="text-xs">Bedrooms</Label> {/* Smaller label */}
                    <Select value={bedrooms} onValueChange={setBedrooms}>
                        <SelectTrigger id="bedrooms" className="h-8 text-xs"> {/* Smaller trigger */}
                            <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Any</SelectItem>
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
                <div className="space-y-3"> {/* Reduced spacing */}
                   <Label className="text-xs">Price Range (₦/year - estimate)</Label> {/* Smaller label */}
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
                      className="my-3" // Reduced margin
                   />
                    {/* Min/Max Input Boxes */}
                    <div className="flex justify-between items-center gap-1.5"> {/* Reduced gap */}
                        <div className="flex-1 space-y-0.5"> {/* Reduced spacing */}
                             <Label htmlFor="minPrice" className="text-xs text-muted-foreground">Min Price</Label>
                             <Input
                                id="minPrice"
                                type="text" // Use text to allow commas during input
                                value={minPriceInput} // Controlled by independent string state
                                onChange={handleMinInputChange} // Update only input state
                                onBlur={handleMinInputBlur} // Format input on blur
                                placeholder={`e.g., ${SLIDER_MIN_PRICE.toLocaleString()}`}
                                className="h-8 text-xs" // Smaller input
                            />
                        </div>
                         <span className="text-muted-foreground pt-4 text-xs">-</span> {/* Adjusted alignment */}
                        <div className="flex-1 space-y-0.5"> {/* Reduced spacing */}
                             <Label htmlFor="maxPrice" className="text-xs text-muted-foreground">Max Price</Label>
                             <Input
                                id="maxPrice"
                                type="text" // Use text to allow commas
                                value={maxPriceInput} // Controlled by independent string state
                                onChange={handleMaxInputChange} // Update only input state
                                onBlur={handleMaxInputBlur} // Format input on blur
                                placeholder="Any"
                                className="h-8 text-xs" // Smaller input
                            />
                        </div>
                    </div>
                     {/* TODO: Add frequency selector (Year/Month/Week/Day) if needed */}
                </div>


                <div className="space-y-1.5"> {/* Reduced spacing */}
                    <Label className="text-xs">Amenities</Label> {/* Smaller label */}
                    <div className="space-y-1 max-h-36 overflow-y-auto pr-2"> {/* Reduced height and spacing */}
                        {ALL_AMENITIES.map(amenity => (
                            <div key={amenity} className="flex items-center space-x-1.5"> {/* Reduced spacing */}
                                <Checkbox
                                    id={amenity.replace(/\s+/g, '-').toLowerCase()} // Generate unique ID
                                    checked={selectedAmenities.includes(amenity)}
                                    onCheckedChange={(checked) => handleAmenityChange(amenity, !!checked)}
                                    className="h-3.5 w-3.5" // Smaller checkbox
                                />
                                <Label htmlFor={amenity.replace(/\s+/g, '-').toLowerCase()} className="font-normal text-xs flex items-center gap-1"> {/* Smaller label, flex for icon */}
                                    {amenity === "PS5" ? <Gamepad2 className="w-3.5 h-3.5 text-purple-600" /> : null}
                                    {amenity}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>

                <Button className="w-full bg-primary hover:bg-primary/90 h-9 text-xs" onClick={handleApplyFilters}> {/* Smaller button */}
                   <Search className="mr-1.5 h-3.5 w-3.5" /> Apply Filters {/* Smaller icon/margin */}
                </Button>
            </CardContent>
        </Card>
    );
}
