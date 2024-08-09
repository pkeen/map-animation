import React, { useEffect } from "react";
import { Source, Layer } from "react-map-gl";
import * as turf from "@turf/turf";

interface InterpolatedRouteProps {
	route: number[][];
	interpolatedRoute: number[][];
	setInterpolatedRoute: (interpolatedRoute: number[][]) => void;
	setBearings: (bearings: number[]) => void;
	resolutionMiles: number;
	setIntervalTime: (intervalTime: number) => void;
	speed: number;
}

const InterpolatedRoute: React.FC<InterpolatedRouteProps> = ({
	route,
	interpolatedRoute,
	setInterpolatedRoute,
	setBearings,
	resolutionMiles,
	setIntervalTime,
	speed,
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

			const lineDistance = turf.length(routeLineString, {
				units: "miles",
			});
			const steps = Math.ceil(lineDistance / resolutionMiles); // Calculate the number of steps

			const newInterpolatedRoute: number[][] = [];
			const newBearings: number[] = [];

			for (let i = 0; i <= steps; i++) {
				const segment = turf.along(
					routeLineString,
					resolutionMiles * i,
					{
						units: "miles",
					}
				);
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

			// Calculate interval time based on speed and resolution
			const intervalTime = (resolutionMiles / speed) * 1000; // Convert seconds to milliseconds
			setIntervalTime(intervalTime);
		}
	}, [
		route,
		resolutionMiles,
		setInterpolatedRoute,
		setBearings,
		setIntervalTime,
		speed,
	]);

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
