'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { Search } from "lucide-react";

export function FilterSidebar() {
    const [priceRange, setPriceRange] = useState([500000, 10000000]); // Example range in Naira

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

                <div className="space-y-4">
                   <Label>Price Range (₦/year)</Label>
                   <Slider
                      defaultValue={priceRange}
                      min={100000}
                      max={20000000}
                      step={100000}
                      onValueChange={(value) => setPriceRange(value)}
                      className="my-4"
                   />
                   <div className="flex justify-between text-sm text-muted-foreground">
                      <span>₦{priceRange[0].toLocaleString()}</span>
                      <span>₦{priceRange[1].toLocaleString()}</span>
                   </div>
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
