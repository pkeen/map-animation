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
	// const [iconCoordinates, setIconCoordinates] = useState(start);
	// const counterRef = useRef(0);

	// useEffect(() => {
	// 	if (iconIsMoving && interpolatedRoute.length > 0) {
	// 		const move = () => {
	// 			if (counterRef.current < interpolatedRoute.length - 1) {
	// 				setIconCoordinates(interpolatedRoute[counterRef.current]);
	// 				counterRef.current += 1;
	// 				setTimeout(move, intervalTime);
	// 			} else {
	// 				setIconIsMoving(false); // Stop the movement
	// 			}
	// 		};

	// 		move(); // Start the animation loop

	// 		return () => {
	// 			counterRef.current = 0; // Reset the counter when the component unmounts or dependencies change
	// 		};
	// 	}
	// }, [iconIsMoving, interpolatedRoute, intervalTime, setIconIsMoving]);

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
