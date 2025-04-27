"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    // Optional prop to indicate if the max value means "Any" or "Unlimited"
    isMaxUnlimited?: boolean;
  }
>(({ className, isMaxUnlimited = false, value, max, ...props }, ref) => {
  const isAtMax = value && max && value[1] === max; // Check if the second handle is at the maximum value

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      value={value}
      max={max}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
        <SliderPrimitive.Range
          className={cn(
            "absolute h-full bg-primary",
             // If max means unlimited AND the slider is at max, don't fill the track completely
             // This relies on specific implementation details and might need CSS tweaks
             // A simple approach is to slightly shorten the range visually when at max.
             // NOTE: This approach is primarily visual. The actual value remains max.
            //  isMaxUnlimited && isAtMax && "w-[calc(100%-8px)]" // Example: shorten by thumb width visually
             // Alternatively, CSS could target data attributes if added by Radix
             // For now, standard behavior is maintained, visual fix might need CSS override.
          )}
         />
      </SliderPrimitive.Track>
      {/* Render first thumb (min value) */}
      <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
      {/* Render second thumb (max value) only if there are two values */}
      {value && value.length > 1 && (
         <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
      )}
    </SliderPrimitive.Root>
  );
});
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
