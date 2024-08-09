"use client";
import React, { useState, useEffect, useRef } from "react";
import Map, { Source, Layer, useMap } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import * as turf from "@turf/turf";

const accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;
if (!accessToken) {
	throw new Error("MAPBOX_API_KEY is not defined");
}

const App: React.FC = () => {
	const [viewState, setViewState] = useState({
		latitude: 49.068343,
		longitude: -122.32579,
		zoom: 8,
	});
	const [route, setRoute] = useState<any[]>([]);
	const [interpolatedRoute, setInterpolatedRoute] = useState<any[]>([]);
	const [bearings, setBearings] = useState<number[]>([]);
	const mapRef = useRef(null);
	const { current: map } = useMap();

	const start = [-122.32579, 49.068343];
	const end = [-121.221103, 48.692216];
	const steps = 500;

	useEffect(() => {
		const initializeMap = async () => {
			const routeData = await getRoute();
			const [interpolated, calculatedBearings] =
				getInterpolatedRoute(routeData);

			setRoute(routeData);
			setInterpolatedRoute(interpolated);
			setBearings(calculatedBearings);

			map?.on("load", () => {
				map.loadImage(
					"https://pkeen.github.io/vanicon/sprinter-top.png",
					(error, image) => {
						if (error) throw error;
						map.addImage("van", image);

						map.addSource("route", {
							type: "geojson",
							data: {
								type: "FeatureCollection",
								features: [
									{
										type: "Feature",
										geometry: {
											type: "LineString",
											coordinates: routeData,
										},
									},
								],
							},
						});

						map.addLayer({
							id: "route",
							type: "line",
							source: "route",
							layout: {
								"line-join": "round",
								"line-cap": "round",
							},
							paint: {
								"line-color": "#3887be",
								"line-width": 5,
								"line-opacity": 0.75,
							},
						});

						map.addSource("point", {
							type: "geojson",
							data: {
								type: "FeatureCollection",
								features: [
									{
										type: "Feature",
										geometry: {
											type: "Point",
											coordinates: start,
											properties: {
												bearing: 0,
											},
										},
									},
								],
							},
						});

						map.addLayer({
							id: "points",
							type: "symbol",
							source: "point",
							layout: {
								"icon-image": "van",
								"icon-size": 1,
								"icon-rotate": ["get", "bearing"],
							},
						});

						animate(interpolated, calculatedBearings);
					}
				);
			});
		};

		initializeMap();
	}, [map]);

	const getRoute = async () => {
		const query = await fetch(
			`https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${accessToken}`,
			{ method: "GET" }
		);
		const json = await query.json();
		return json.routes[0].geometry.coordinates;
	};

	const getInterpolatedRoute = (route: any[]) => {
		const routeLineString = {
			type: "Feature",
			geometry: {
				type: "LineString",
				coordinates: route,
			},
		};

		const lineDistance = turf.length(routeLineString);
		const increment = lineDistance / steps;
		const interpolatedRoute: any[] = [];
		const bearings: number[] = [];

		for (let i = 0; i <= steps; i++) {
			const segment = turf.along(routeLineString, increment * i);
			interpolatedRoute.push(segment.geometry.coordinates);

			if (i > 0) {
				const bearing = turf.bearing(
					turf.point(interpolatedRoute[i - 1]),
					turf.point(interpolatedRoute[i])
				);
				bearings.push(bearing);
			} else {
				bearings.push(0);
			}
		}

		return [interpolatedRoute, bearings];
	};

	const animate = (route: any[], bearings: number[]) => {
		let counter = 0;

		function move() {
			if (counter < route.length) {
				map?.getSource("point").setData({
					type: "FeatureCollection",
					features: [
						{
							type: "Feature",
							geometry: {
								type: "Point",
								coordinates: route[counter],
								properties: {
									bearing: bearings[counter],
								},
							},
						},
					],
				});
				counter++;
				setTimeout(() => {
					requestAnimationFrame(move);
				}, 10);
			}
		}

		move();
	};

	return (
		<>
			<Map
				ref={mapRef}
				{...viewState}
				onMove={(evt) => setViewState(evt.viewState)}
				mapboxAccessToken={accessToken}
				style={{ width: "100%", height: "100vh" }}
				mapStyle="mapbox://styles/mapbox/streets-v12"
			/>
			<div className="overlay">
				<button
					className="p-2 bg-white border border-gray-400"
					onClick={() => animate(interpolatedRoute, bearings)}
				>
					Replay
				</button>
			</div>
		</>
	);
};

export default App;
