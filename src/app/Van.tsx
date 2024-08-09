import React, { useEffect, useRef } from "react";
import { useMap } from "react-map-gl";

interface VanProps {
	interpolatedRoute: number[][];
	bearings: number[];
}

const Van: React.FC<VanProps> = ({ interpolatedRoute, bearings }) => {
	const mapRef = useMap().current;
	const counterRef = useRef(0);

	useEffect(() => {
		if (!mapRef || interpolatedRoute.length === 0 || bearings.length === 0)
			return;

		const onLoad = () => {
			mapRef.loadImage(
				"https://pkeen.github.io/vanicon/sprinter-top.png",
				(error, image) => {
					if (error) {
						console.error("Failed to load image:", error);
						return;
					}

					if (!mapRef.hasImage("van")) {
						mapRef.addImage("van", image);
					}

					if (!mapRef.getSource("point")) {
						mapRef.addSource("point", {
							type: "geojson",
							data: {
								type: "FeatureCollection",
								features: [
									{
										type: "Feature",
										geometry: {
											type: "Point",
											coordinates: interpolatedRoute[0],
										},
										properties: {
											bearing: bearings[0],
										},
									},
								],
							},
						});

						mapRef.addLayer({
							id: "van",
							type: "symbol",
							source: "point",
							layout: {
								"icon-image": "van",
								"icon-size": 1,
								"icon-rotate": ["get", "bearing"],
								"icon-rotation-alignment": "map",
							},
						});

						animateVan();
					}
				}
			);
		};

		if (mapRef.isStyleLoaded()) {
			onLoad();
		} else {
			mapRef.on("load", onLoad);
		}

		const animateVan = () => {
			if (counterRef.current < interpolatedRoute.length) {
				mapRef.getSource("point").setData({
					type: "FeatureCollection",
					features: [
						{
							type: "Feature",
							geometry: {
								type: "Point",
								coordinates:
									interpolatedRoute[counterRef.current],
							},
							properties: {
								bearing: bearings[counterRef.current],
							},
						},
					],
				});
				counterRef.current += 1;
				requestAnimationFrame(animateVan);
			}
		};

		return () => {
			if (mapRef) {
				mapRef.off("load", onLoad);
			}
		};
	}, [mapRef, interpolatedRoute, bearings]);

	return null;
};

export default Van;
