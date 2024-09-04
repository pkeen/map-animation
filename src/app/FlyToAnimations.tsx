import React, { useEffect, useRef } from "react";
import Map, { useMap } from "react-map-gl";

const FlyToAnimations = ({
	flyToOptions,
	viewState,
	setViewState,
	triggerFlyTo,
	setTriggerFlyTo,
}) => {
	const mapRef = useMap().current;
	const animationStarted = useRef(false);

	useEffect(() => {
		if (triggerFlyTo && mapRef) {
			// Temporarily pause viewState updates during flyTo animation
			// const flyToOptions = {
			// 	center: [-121.221103, 48.692216], // Center it on your route
			// 	zoom: 8, // Adjust zoom level appropriately for the route
			// 	speed: 0.8, // Fly-to speed, lower is slower
			// 	curve: 1.42, // Animation curve
			// 	essential: true,
			// };

			mapRef.flyTo(flyToOptions);

			// Sync the viewState with the new camera position after the animation
			mapRef.once("moveend", () => {
				const newCenter = mapRef.getCenter();
				const newZoom = mapRef.getZoom();
				setViewState({
					...viewState,
					latitude: newCenter.lat,
					longitude: newCenter.lng,
					zoom: newZoom,
				});
				setTriggerFlyTo(false);
			});
		}
	}, [triggerFlyTo, mapRef]);

	return null;
};

export default FlyToAnimations;
