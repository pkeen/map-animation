"use client";
import React, { useEffect, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import Route from "./Route";
import MapComponent from "./MapComponent";
import InterpolatedRoute from "./InterpolatedRoute";
import MovingIcon from "./MovingIcon";
// import Van from "./Van";

const App: React.FC = () => {
	const [viewState, setViewState] = useState({
		latitude: 49.068343,
		longitude: -122.32579,
		zoom: 8,
	});
	const [route, setRoute] = useState<any[]>([]);
	const start = [-122.32579, 49.068343];
	const end = [-121.221103, 48.692216];
	const [interpolatedRoute, setInterpolatedRoute] = useState<any[]>([]);
	const [bearings, setBearings] = useState<number[]>([]);
	const [steps, setSteps] = useState(500); // Lifted state for steps
	const [iconIsMoving, setIconIsMoving] = useState(false);

	const replayHandler = () => {
		setIconIsMoving(true);
	};

	return (
		<>
			<MapComponent viewState={viewState} setViewState={setViewState}>
				<Route
					route={route}
					setRoute={setRoute}
					start={start}
					end={end}
				/>
				<InterpolatedRoute
					route={route}
					interpolatedRoute={interpolatedRoute}
					setInterpolatedRoute={setInterpolatedRoute}
					setBearings={setBearings}
					steps={steps}
				/>
				<MovingIcon
					start={start}
					interpolatedRoute={interpolatedRoute}
					bearings={bearings}
					iconIsMoving={iconIsMoving}
					setIconIsMoving={setIconIsMoving}
				/>
				{/* <Van
					interpolatedRoute={interpolatedRoute}
					bearings={bearings}
				/> */}
			</MapComponent>
			<div>
				<p className="text-gray-200">Zoom={viewState.zoom}</p>
				<button
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
					onClick={() => setIconIsMoving(!iconIsMoving)}
				>
					Replay
				</button>
			</div>
		</>
	);
};

export default App;

// const InterpolatedRoute = ({ route }: { route: any[] }) => {
// 	const [interpolatedRoute, setInterpolatedRoute] = useState<any[]>([]);
// 	const [bearings, setBearings] = useState<number[]>([]);

// 	useEffect(() => {
// 		if (route.length > 0) {
// 			const steps = 500;
// 			const routeLineString = {
// 				type: "Feature",
// 				geometry: {
// 					type: "LineString",
// 					coordinates: route,
// 				},
// 			};

// 			const lineDistance = turf.length(routeLineString);
// 			const increment = lineDistance / steps;
// 			const interpolatedRoute: any[] = [];
// 			const bearings: number[] = [];

// 			for (let i = 0; i <= steps; i++) {
// 				const segment = turf.along(routeLineString, increment * i);
// 				interpolatedRoute.push(segment.geometry.coordinates);

// 				if (i > 0) {
// 					const bearing = turf.bearing(
// 						turf.point(interpolatedRoute[i - 1]),
// 						turf.point(interpolatedRoute[i])
// 					);
// 					bearings.push(bearing);
// 				} else {
// 					bearings.push(0);
// 				}
// 			}

// 			setInterpolatedRoute(interpolatedRoute);
// 			setBearings(bearings);
// 		}
// 	}, [route]);

// 	return (
// 		interpolatedRoute.length > 0 && (
// 			<Source
// 				id="interpolated-route"
// 				type="geojson"
// 				data={{
// 					type: "Feature",
// 					properties: {},
// 					geometry: {
// 						type: "LineString",
// 						coordinates: interpolatedRoute,
// 					},
// 				}}
// 			>
// 				<Layer
// 					id="interpolated-route-layer"
// 					type="line"
// 					layout={{
// 						"line-join": "round",
// 						"line-cap": "round",
// 					}}
// 					paint={{
// 						"line-color": "#ff0000",
// 						"line-width": 4,
// 					}}
// 				/>
// 			</Source>
// 		)
// 	);
// };

// const MapComponent: React.FC = () => {
// 	const [viewState, setViewState] = useState({
// 		latitude: 37.8,
// 		longitude: -122.4,
// 		zoom: 4,
// 	});

// 	return (
// 		<>
// 			<Map
// 				{...viewState}
// 				onMove={(evt) => setViewState(evt.viewState)}
// 				mapboxAccessToken={accessToken}
// 				style={{ width: "100%", height: "90vh" }}
// 				mapStyle="mapbox://styles/mapbox/streets-v9"
// 			>
// 				<Marker longitude={-122.4} latitude={37.8} color="red" />
// 				{/* <Route setRoute={setRoute} /> */}
// 				{/* <InterpolatedRoute route={route} /> */}
// 			</Map>
// 			<div>
// 				<p className="text-gray-200">Zoom={viewState.zoom}</p>
// 			</div>
// 		</>
// 	);
// };
