import React, { useEffect } from "react";
import { Source, Layer } from "react-map-gl";
import * as turf from "@turf/turf";

interface InterpolatedRouteProps {
	route: number[][];
	interpolatedRoute: number[][];
	setInterpolatedRoute: (interpolatedRoute: number[][]) => void;
	setBearings: (bearings: number[]) => void;
	steps: number; // Add steps as a prop
}

const InterpolatedRoute: React.FC<InterpolatedRouteProps> = ({
	route,
	interpolatedRoute,
	setInterpolatedRoute,
	setBearings,
	steps,
}) => {
	useEffect(() => {
		if (route.length > 0) {
			const routeLineString = {
				type: "Feature",
				geometry: {
					type: "LineString",
					coordinates: route,
				},
				properties: {}, // Add this line
			};

			const lineDistance = turf.length(routeLineString);
			const increment = lineDistance / steps;
			const newInterpolatedRoute: number[][] = [];
			const newBearings: number[] = [];

			for (let i = 0; i <= steps; i++) {
				const segment = turf.along(routeLineString, increment * i);
				newInterpolatedRoute.push(
					segment.geometry.coordinates as number[]
				);

				if (i > 0) {
					const bearing = turf.bearing(
						turf.point(newInterpolatedRoute[i - 1]),
						turf.point(newInterpolatedRoute[i])
					);
					newBearings.push(bearing);
				} else {
					newBearings.push(0);
				}
			}

			setInterpolatedRoute(newInterpolatedRoute);
			setBearings(newBearings);
		}
	}, [route, setInterpolatedRoute, setBearings]);

	return (
		interpolatedRoute.length > 0 && (
			<Source
				id="interpolated-route"
				type="geojson"
				data={{
					type: "FeatureCollection",
					features: interpolatedRoute.map((coordinates) => ({
						type: "Feature",
						geometry: {
							type: "Point",
							coordinates,
						},
					})),
				}}
			>
				<Layer
					id="interpolated-route-dots"
					type="circle"
					paint={{
						"circle-radius": 3, // Adjust the size of the dots
						"circle-color": "#ff0000", // Set the color of the dots
						// "circle-stroke-width": 1,
						// "circle-stroke-color": "#ffffff", // Optional: add a border to the dots
					}}
				/>
			</Source>
		)
	);
};

export default InterpolatedRoute;
