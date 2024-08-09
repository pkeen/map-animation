import React, { useState, useEffect, useRef } from "react";
import { Source, Layer } from "react-map-gl";

interface CompletedRouteProps {
	completedRoute: number[][];
}

const CompletedRoute: React.FC<CompletedRouteProps> = ({ completedRoute }) => {
	return (
		<Source
			id="completed-route"
			type="geojson"
			data={{
				type: "Feature",
				geometry: {
					type: "LineString",
					coordinates: completedRoute,
				},
			}}
		>
			<Layer
				id="completed-route-layer"
				type="line"
				layout={{
					"line-join": "round",
					"line-cap": "round",
				}}
				paint={{
					"line-color": "#00FF00", // Color for completed route (e.g., green)
					"line-width": 5,
				}}
			/>
		</Source>
	);
};

export default CompletedRoute;
