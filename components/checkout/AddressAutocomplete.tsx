'use client';

import { useEffect, useRef, useState } from 'react';

interface AddressData {
  address1: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
}

interface AddressAutocompleteProps {
  onAddressSelect: (data: AddressData) => void;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

interface AddressComponent {
  types: string[];
  long_name: string;
  short_name: string;
}

interface GoogleAutocomplete {
  addListener: (event: string, cb: () => void) => void;
  getPlace: () => { address_components?: AddressComponent[] };
}

interface GoogleMapsWindow extends Window {
  google?: {
    maps?: {
      places?: {
        Autocomplete: new (
          input: HTMLInputElement,
          opts: object
        ) => GoogleAutocomplete;
      };
    };
  };
}

function googleMaps() {
  return (window as GoogleMapsWindow).google?.maps?.places;
}

export function AddressAutocomplete({
  onAddressSelect,
  value,
  onChange,
  placeholder,
  className,
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) return;

    if (googleMaps()) {
      setLoaded(true);
      return;
    }

    if (document.querySelector('script[data-google-maps]')) {
      const interval = setInterval(() => {
        if (googleMaps()) {
          setLoaded(true);
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
    script.async = true;
    script.defer = true;
    script.dataset.googleMaps = 'true';
    script.onload = () => setLoaded(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    const places = googleMaps();
    if (!loaded || !inputRef.current || !places) return;

    const autocomplete = new places.Autocomplete(inputRef.current, {
      types: ['address'],
      componentRestrictions: { country: ['us', 'ca', 'gb', 'au'] },
      fields: ['address_components'],
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.address_components) return;

      const get = (type: string) =>
        place.address_components!.find((c) => c.types.includes(type))?.long_name || '';
      const getShort = (type: string) =>
        place.address_components!.find((c) => c.types.includes(type))?.short_name || '';

      const address1 = `${get('street_number')} ${get('route')}`.trim();

      onChange(address1);
      onAddressSelect({
        address1,
        city: get('locality') || get('postal_town') || get('sublocality_level_1') || '',
        state: getShort('administrative_area_level_1'),
        postcode: get('postal_code'),
        country: getShort('country'),
      });
    });
  }, [loaded, onChange, onAddressSelect]);

  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder || 'Start typing your address...'}
      autoComplete="street-address"
      className={className}
    />
  );
}
