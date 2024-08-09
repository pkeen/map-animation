import React, { useState, useEffect, useRef } from "react";
import { Marker } from "react-map-gl";

interface MovingIconProps {
	iconCoordinates: number[];
	bearings: number[];
	counterRef: any;
}

const MovingIcon: React.FC<MovingIconProps> = ({
	iconCoordinates,
	bearings,
	counterRef,
}) => {
	return (
		<Marker longitude={iconCoordinates[0]} latitude={iconCoordinates[1]}>
			<img
				src="https://pkeen.github.io/vanicon/sprinter-top.png"
				alt="Van"
				style={{
					width: "50px",
					height: "50px",
					transform: `rotate(${bearings[counterRef.current]}deg)`,
				}}
			/>
		</Marker>
	);
};

export default MovingIcon;
