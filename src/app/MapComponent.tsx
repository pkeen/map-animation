"use client";
import React, { useState, useEffect } from "react";
import Map, { Marker, useMap } from "react-map-gl";

const accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;
if (!accessToken) {
	throw new Error("MAPBOX_API_KEY is not defined");
}

interface MapComponentProps {
	mapStyle: string;
	viewState: any;
	setViewState: (viewState: any) => void;
	children: React.ReactNode;
}

const MapComponent: React.FC<MapComponentProps> = ({
	mapStyle,
	viewState,
	setViewState,
	children,
}) => {
	// const mapRef = useMap().current;
	// const [mapLoaded, setMapLoaded] = useState(false);

	// useEffect(() => {
	// 	if (mapRef) {
	// 		console.log("Map reference exists, checking if style is loaded...");
	// 		if (mapRef.isStyleLoaded()) {
	// 			console.log("Map style is already loaded.");
	// 			setMapLoaded(true);
	// 			// onMapLoaded();
	// 		} else {
	// 			mapRef.on("load", () => {
	// 				console.log("Waiting for map style to load...");
	// 				setMapLoaded(true);
	// 				// onMapLoaded();
	// 			});
	// 		}
	// 	}
	// }, [mapRef, setMapLoaded]);

	return (
		<Map
			{...viewState}
			onMove={(evt) => setViewState(evt.viewState)}
			mapboxAccessToken={accessToken}
			style={{ width: "100%", height: "90vh" }}
			mapStyle={mapStyle}
		>
			{/* <Marker longitude={-122.4} latitude={37.8} color="red" /> */}
            {children}
		</Map>
	);
};

export default MapComponent;
