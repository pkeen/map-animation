"use client";
import React from "react";
import Map, { Marker } from "react-map-gl";

const accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;
if (!accessToken) {
	throw new Error("MAPBOX_API_KEY is not defined");
}

interface MapComponentProps {
	viewState: any;
	setViewState: (viewState: any) => void;
	children: React.ReactNode;
}

const MapComponent: React.FC<MapComponentProps> = ({
	viewState,
	setViewState,
	children,
}) => {
	return (
		<Map
			{...viewState}
			onMove={(evt) => setViewState(evt.viewState)}
			mapboxAccessToken={accessToken}
			style={{ width: "100%", height: "90vh" }}
			mapStyle="mapbox://styles/mapbox/streets-v9"
		>
			<Marker longitude={-122.4} latitude={37.8} color="red" />
			{children}
		</Map>
	);
};

export default MapComponent;
