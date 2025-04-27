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
import { cn } from "@/lib/utils"; // Import cn utility

const MIN_PRICE_LIMIT = 150000;
const MAX_PRICE_LIMIT = 20000000;

export function FilterSidebar() {
    // State for the selected price range [min, max] used by the Slider
    const [priceRange, setPriceRange] = useState<[number, number]>([MIN_PRICE_LIMIT, MAX_PRICE_LIMIT]);
    // State for the input field values (as strings)
    const [minPriceInput, setMinPriceInput] = useState<string>(MIN_PRICE_LIMIT.toLocaleString());
    const [maxPriceInput, setMaxPriceInput] = useState<string>(MAX_PRICE_LIMIT.toLocaleString());

    // Update inputs when slider changes
    const handleSliderChange = (value: number[]) => {
        const [min, max] = value;
        setPriceRange([min, max]);
        setMinPriceInput(min.toLocaleString());
        setMaxPriceInput(max.toLocaleString());
    };

    // Handle changes in the Min Price input field
    const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMinPriceInput(e.target.value); // Update string state directly
    };

    // Handle changes in the Max Price input field
    const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMaxPriceInput(e.target.value); // Update string state directly
    };

    // Validate and update slider state when Min Price input loses focus
    const handleMinInputBlur = () => {
        const rawValue = minPriceInput;
        const numericValue = parseInt(rawValue.replace(/,/g, ''), 10);

        if (!isNaN(numericValue)) {
            const newMin = Math.max(MIN_PRICE_LIMIT, Math.min(numericValue, priceRange[1]));
            setPriceRange(prev => [newMin, prev[1]]);
            setMinPriceInput(newMin.toLocaleString()); // Format the input
        } else {
            // Reset input to current valid slider value if input is invalid
            setMinPriceInput(priceRange[0].toLocaleString());
        }
    };

     // Validate and update slider state when Max Price input loses focus
    const handleMaxInputBlur = () => {
        const rawValue = maxPriceInput;
        const numericValue = parseInt(rawValue.replace(/,/g, ''), 10);

        if (!isNaN(numericValue)) {
            const newMax = Math.min(MAX_PRICE_LIMIT, Math.max(numericValue, priceRange[0]));
            setPriceRange(prev => [prev[0], newMax]);
            setMaxPriceInput(newMax.toLocaleString()); // Format the input
        } else {
             // Reset input to current valid slider value if input is invalid
            setMaxPriceInput(priceRange[1].toLocaleString());
        }
    };


    return (
        <Card className="lg:w-1/4 xl:w-1/5 h-fit sticky top-20 shadow-sm">
            <CardHeader>
                <CardTitle className="text-lg">Filter Properties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" placeholder="e.g., Lekki, Yaba" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="propertyType">Property Type</Label>
                    <Select>
                        <SelectTrigger id="propertyType">
                            <SelectValue placeholder="Any Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="apartment">Apartment</SelectItem>
                            <SelectItem value="duplex">Duplex</SelectItem>
                            <SelectItem value="studio">Studio</SelectItem>
                            <SelectItem value="bungalow">Bungalow</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                 <div className="space-y-2">
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Select>
                        <SelectTrigger id="bedrooms">
                            <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="4">4+</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Price Range Filter */}
                <div className="space-y-4">
                   <Label>Price Range (₦/year)</Label>
                   <Slider
                      value={priceRange} // Controlled component based on validated state
                      min={MIN_PRICE_LIMIT}
                      max={MAX_PRICE_LIMIT}
                      step={50000}
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
                                value={minPriceInput} // Controlled by string state
                                onChange={handleMinInputChange} // Update string state on change
                                onBlur={handleMinInputBlur} // Validate and update slider on blur
                                placeholder={MIN_PRICE_LIMIT.toLocaleString()}
                                className="h-9 text-sm"
                            />
                        </div>
                         <span className="text-muted-foreground pt-5">-</span>
                        <div className="flex-1 space-y-1">
                             <Label htmlFor="maxPrice" className="text-xs text-muted-foreground">Max Price</Label>
                             <Input
                                id="maxPrice"
                                type="text" // Use text to allow commas during input
                                value={maxPriceInput} // Controlled by string state
                                onChange={handleMaxInputChange} // Update string state on change
                                onBlur={handleMaxInputBlur} // Validate and update slider on blur
                                placeholder={MAX_PRICE_LIMIT.toLocaleString()}
                                className="h-9 text-sm"
                            />
                        </div>
                    </div>
                   {/* Display current slider range (optional but helpful for debugging) */}
                   {/* <div className="flex justify-between text-xs text-muted-foreground">
                      <span>₦{priceRange[0].toLocaleString()}</span>
                      <span>₦{priceRange[1].toLocaleString()}</span>
                   </div> */}
                </div>


                <div className="space-y-2">
                    <Label>Amenities</Label>
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="water" />
                            <Label htmlFor="water" className="font-normal">Constant Water Supply</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="electricity" />
                            <Label htmlFor="electricity" className="font-normal">Good Electricity</Label>
                        </div>
                         <div className="flex items-center space-x-2">
                            <Checkbox id="security" />
                            <Label htmlFor="security" className="font-normal">Security</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="furnished" />
                            <Label htmlFor="furnished" className="font-normal">Furnished</Label>
                        </div>
                         <div className="flex items-center space-x-2">
                            <Checkbox id="parking" />
                            <Label htmlFor="parking" className="font-normal">Parking Space</Label>
                        </div>
                    </div>
                </div>

                <Button className="w-full bg-primary hover:bg-primary/90">
                   <Search className="mr-2 h-4 w-4" /> Apply Filters
                </Button>
            </CardContent>
        </Card>
    );
}
