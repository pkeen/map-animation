import React, { useEffect } from "react";
import { Source, Layer } from "react-map-gl";

const accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;
if (!accessToken) {
	throw new Error("MAPBOX_API_KEY is not defined");
}

interface RouteProps {
	route: any[];
	setRoute: (route: any[]) => void;
	start: number[];
	end: number[];
}

const Route: React.FC<RouteProps> = ({ route, setRoute, start, end }) => {
	useEffect(() => {
		const getRoute = async () => {
			try {
				const query = await fetch(
					`https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${accessToken}`,
					{ method: "GET" }
				);
				const json = await query.json();
				setRoute(json.routes[0].geometry.coordinates);
			} catch (error) {
				console.error("Failed to fetch route:", error);
			}
		};
		getRoute();
	}, [start, end, setRoute]);

	return (
		route.length > 0 && (
			<Source
				id="route"
				type="geojson"
				data={{
					type: "Feature",
					properties: {},
					geometry: {
						type: "LineString",
						coordinates: route,
					},
				}}
			>
				<Layer
					id="route"
					type="line"
					layout={{
						"line-join": "round",
						"line-cap": "round",
					}}
					paint={{
						"line-color": "#888",
						"line-width": 5,
					}}
				/>
			</Source>
		)
	);
};

export default Route;
