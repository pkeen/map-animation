import React, { useEffect } from "react";
import { Source, Layer, useMap } from "react-map-gl";

interface RouteProps {
	route: number[][];
	setRoute: (route: number[][]) => void;
	start: number[];
	end: number[];
}

const Route: React.FC<RouteProps> = ({ route, setRoute, start, end }) => {
	useEffect(() => {
		const getRoute = async () => {
			try {
				const query = await fetch(
					`https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_KEY}`
				);
				const json = await query.json();
				const newRoute = json.routes[0].geometry.coordinates;

				// Only update state if the new route is different to prevent endless re-renders
				if (JSON.stringify(newRoute) !== JSON.stringify(route)) {
					setRoute(newRoute);
				}
			} catch (error) {
				console.error("Failed to fetch route:", error);
			}
		};

		getRoute();
	}, [start, end, setRoute]); // Removed `route` from dependencies to prevent infinite loop

	// return (
	// 	route.length > 0 && (
	// 		<Source
	// 			id="route"
	// 			type="geojson"
	// 			data={{
	// 				type: "Feature",
	// 				properties: {},
	// 				geometry: {
	// 					type: "LineString",
	// 					coordinates: route,
	// 				},
	// 			}}
	// 		>
	// 			<Layer
	// 				id="route"
	// 				type="line"
	// 				layout={{
	// 					"line-join": "round",
	// 					"line-cap": "round",
	// 				}}
	// 				paint={{
	// 					"line-color": "#8f6048",
	// 					"line-width": 5,
	// 				}}
	// 			/>
	// 		</Source>
	// 	)
	// );

	return null;
};

export default Route;
