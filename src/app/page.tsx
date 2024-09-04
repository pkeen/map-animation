"use client";
import React, { useEffect, useState } from "react";
import { useMap } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Route from "./Route";
import MapComponent from "./MapComponent";
import InterpolatedRoute from "./InterpolatedRoute";
import TravelAnimation from "./TravelAnimation";
import MovingIcon from "./MovingIcon";
import MapLoadingHandler from "./MapLoadingHandler";
import FlyToAnimations from "./FlyToAnimations";
// import Van from "./Van";

const App: React.FC = () => {
	const [viewState, setViewState] = useState({
		latitude: 35.11,
		longitude: -97.57,
		zoom: 3.5,
	});
	const [route, setRoute] = useState<any[]>([]);
	const start = [-122.32579, 49.068343];
	const end = [-121.221103, 48.692216];
	const coordinates = [
		// [-122.32835, 49.05157], // Start Abbostford
		// [-122.47917, 48.74976], // Bellingham
		// [-122.467194, 48.62942], // Chucknut
		[-121.341291, 48.82816], // North Cascades
		[-122.330284, 47.603245], // seattle
	];

	const [interpolatedRoute, setInterpolatedRoute] = useState<any[]>([]);
	const [bearings, setBearings] = useState<number[]>([]);
	// const [steps, setSteps] = useState(500); // Lifted state for steps
	const [resolutionMiles, setResolutionMiles] = useState(0.5); // Lifted state for resolution in miles
	const [iconIsMoving, setIconIsMoving] = useState(false);
	const [speed, setSpeed] = useState(20); // Speed in miles per second
	const [intervalTime, setIntervalTime] = useState<number>(0); // Interval time
	const [mapStyle, setMapStyle] = useState<string>(
		// "mapbox://styles/kingstonkeen/clzkjpe0q000301r5c5dhh10g"
		// "mapbox://styles/mapbox/streets-v11"  // Default Mapbox Streets style
		"mapbox://styles/kingstonkeen/clznaomph005r01r58luu8dkm" // sat streets USA
		// "mapbox://styles/kingstonkeen/clzkqqstn001701pz06axg70z" // USA Road Trip
		// "mapbox://styles/kingstonkeen/clzkqltj9001101r84zblg24x" // USA Road Trip w States
	);
	// const mapRef = useMap().current;
	const [mapLoaded, setMapLoaded] = useState(false);
	const [triggerFlyTo, setTriggerFlyTo] = useState(false);
	const [flyToOptions, setFlyToOptions] = useState({
		center: [-121.221103, 48], // Center it on your route
		zoom: 7, // Adjust zoom level appropriately for the route
		speed: 0.7, // Fly-to speed, lower is slower
		curve: 1.42, // Animation curve
		essential: true,
	});

	const replayHandler = () => {
		setIconIsMoving(true);
	};

	// useEffect(() => {
	// 	if (mapRef) {
	// 		console.log("Map reference exists, checking if style is loaded...");
	// 		if (mapRef.isStyleLoaded()) {
	// 			console.log("Map style is already loaded.");
	// 			setMapLoaded(true);
	// 		} else {
	// 			console.log("Waiting for map style to load...");
	// 			mapRef.on("load", () => {
	// 				console.log("Map style loaded.");
	// 				setMapLoaded(true);
	// 			});
	// 		}
	// 	} else {
	// 		console.log("Map reference does not exist.");
	// 	}
	// }, [mapRef]);

	// console.log(mapLoaded);

	return (
		<>
			<MapComponent
				mapStyle={mapStyle}
				viewState={viewState}
				setViewState={setViewState}
			>
				<MapLoadingHandler>
					<Route
						route={route}
						setRoute={setRoute}
						coordinates={coordinates}
					/>

					<InterpolatedRoute
						route={route}
						interpolatedRoute={interpolatedRoute}
						setInterpolatedRoute={setInterpolatedRoute}
						setBearings={setBearings}
						resolutionMiles={resolutionMiles}
						setIntervalTime={setIntervalTime}
						speed={speed}
					/>
					<TravelAnimation
						start={coordinates[0]}
						interpolatedRoute={interpolatedRoute}
						bearings={bearings}
						iconIsMoving={iconIsMoving}
						setIconIsMoving={setIconIsMoving}
						intervalTime={intervalTime}
					/>
					<FlyToAnimations
						flyToOptions={flyToOptions}
						viewState={viewState}
						setViewState={setViewState}
						triggerFlyTo={triggerFlyTo}
						setTriggerFlyTo={setTriggerFlyTo}
					/>
				</MapLoadingHandler>
				{/* <Van
					interpolatedRoute={interpolatedRoute}
					bearings={bearings}
				/> */}
			</MapComponent>
			<div>
				<p className="text-gray-800">Zoom={viewState.zoom}</p>
				<p>Lat: {viewState.latitude}</p>
				<button
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
					onClick={() => setIconIsMoving(!iconIsMoving)}
				>
					Replay
				</button>
				<input
					type="range"
					min="1"
					max="100"
					step="5"
					value={speed}
					onChange={(e) => setSpeed(parseFloat(e.target.value))}
				/>
				<p>{speed}</p>
				<button
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
					onClick={() => setTriggerFlyTo(true)}
				>
					Trigger FlyTo
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
