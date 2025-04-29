// src/components/common/LocationAutocompleteInput.tsx
'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Control, FieldValues, FieldPath, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { MapPin } from 'lucide-react';
import { FormDescription, FormItem, FormLabel, FormMessage } from '@/components/ui/form'; // Import form components

interface LocationAutocompleteInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  placeholder?: string;
  description?: string;
  disabled?: boolean;
}

export function LocationAutocompleteInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  placeholder = 'Start typing location...',
  description,
  disabled,
}: LocationAutocompleteInputProps<TFieldValues, TName>) {
  const places = useMapsLibrary('places');
  const [sessionToken, setSessionToken] =
    useState<google.maps.places.AutocompleteSessionToken>();
  const [autocompleteService, setAutocompleteService] =
    useState<google.maps.places.AutocompleteService | null>(null);
  const [predictionResults, setPredictionResults] = useState<
    Array<google.maps.places.AutocompletePrediction>
  >([]);
  const [inputValue, setInputValue] = useState(''); // Internal state for the input value
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!places) return;
    setAutocompleteService(new places.AutocompleteService());
    setSessionToken(new places.AutocompleteSessionToken());

    return () => setAutocompleteService(null);
  }, [places]);

  const fetchPredictions = useCallback(
    (value: string) => {
      if (!autocompleteService || !value) {
        setPredictionResults([]);
        return;
      }
      autocompleteService.getPlacePredictions(
        { input: value, sessionToken, componentRestrictions: { country: 'ng' } }, // Restrict to Nigeria
        (predictions) => {
          setPredictionResults(predictions || []);
        }
      );
    },
    [autocompleteService, sessionToken]
  );

  // --- Removed incorrect useEffect for getting initial value ---

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value); // Update internal input state
    fetchPredictions(value);
  };

  const handleSuggestionClick = (
    prediction: google.maps.places.AutocompletePrediction,
    onChange: (...event: any[]) => void // onChange from react-hook-form Controller
  ) => {
    const locationValue = prediction.description;
    setInputValue(locationValue); // Update internal input state
    onChange(locationValue); // Update react-hook-form state
    setPredictionResults([]); // Clear suggestions
    // Optionally fetch place details if needed (e.g., for lat/lng)
    // const placesService = new places.PlacesService(inputRef.current!); // Needs a map instance or HTML element
    // placesService.getDetails({ placeId: prediction.place_id, sessionToken }, (placeDetails) => {
    //     console.log('Place Details:', placeDetails);
    //     // Update form with lat/lng if necessary: form.setValue('latitude', placeDetails?.geometry?.location?.lat());
    // });
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, onBlur, value, ref }, fieldState: { error } }) => {

        // Sync input value with react-hook-form's value on initial load or external changes
        useEffect(() => {
          if (typeof value === 'string' && value !== inputValue) {
             setInputValue(value);
          }
           // Handle case where form is reset or initial value is empty
          if (value === '' && inputValue !== '') {
               setInputValue('');
           }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [value]); // Depend only on the form field's value

       return (
          <FormItem>
            <FormLabel className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {label}
            </FormLabel>
             <div className="relative">
              <Input
                {...{ ...ref, ref: inputRef }} // Merge refs
                placeholder={placeholder}
                value={inputValue} // Use internal state for display
                onChange={(e) => {
                    handleInputChange(e); // Update internal state and fetch predictions
                    onChange(e.target.value); // Also update form state via Controller's onChange
                }}
                onBlur={onBlur} // Pass onBlur from react-hook-form
                disabled={disabled}
                className={error ? 'border-destructive' : ''}
              />
              {predictionResults.length > 0 && (
                <ul className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {predictionResults.map((prediction) => (
                    <li
                      key={prediction.place_id}
                      className="px-3 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                      onClick={() => handleSuggestionClick(prediction, onChange)}
                    >
                      {prediction.description}
                    </li>
                  ))}
                </ul>
              )}
              </div>
             {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
       );
      }}
    />
  );
}
