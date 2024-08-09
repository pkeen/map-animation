"use client";
import React, { useState, useEffect } from "react";
import Map, { Marker, useMap } from "react-map-gl";

interface MapLoadingHandlerProps {
	children: React.ReactNode;
}

const MapLoadingHandler: React.FC<MapLoadingHandlerProps> = ({ children }) => {
	const mapRef = useMap().current;
	const [mapLoaded, setMapLoaded] = useState(false);

	useEffect(() => {
		if (mapRef) {
			console.log("Map reference exists, checking if style is loaded...");
			if (mapRef.isStyleLoaded()) {
				console.log("Map style is already loaded.");
				setMapLoaded(true);
				// onMapLoaded();
			} else {
				mapRef.on("load", () => {
					console.log("Waiting for map style to load...");
					setMapLoaded(true);
					// onMapLoaded();
				});
			}
		}
	}, [mapRef, setMapLoaded]);

	return <>{mapLoaded && children}</>;
};

export default MapLoadingHandler;
