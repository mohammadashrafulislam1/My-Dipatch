import { AddressAutofill } from "@mapbox/search-js-react";

export default function LocationInput({ placeholder, icon, onSelect }) {
  return (
    <div className="relative">
      {icon}
      <AddressAutofill
        accessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        onRetrieve={(res) => {
          const feature = res.features[0];
          if (!feature) return;

          onSelect({
            address: feature.place_name,
            lat: feature.geometry.coordinates[1],
            lng: feature.geometry.coordinates[0],
          });
        }}
      >
        <input
          type="text"
          placeholder={placeholder}
          className="w-full border dark:bg-white border-gray-300 rounded-md pl-10 p-3"
        />
      </AddressAutofill>
    </div>
  );
}
