import React, { useState, useEffect, useRef } from "react";
import { Marker } from "react-map-gl";

interface MovingIconProps {
	start: number[];
	interpolatedRoute: number[][];
	bearings: number[];
	iconIsMoving: boolean;
	setIconIsMoving: (iconIsMoving: boolean) => void;
}

const MovingIcon: React.FC<MovingIconProps> = ({
	start,
	interpolatedRoute,
	bearings,
	iconIsMoving,
	setIconIsMoving,
}) => {
	const [iconCoordinates, setIconCoordinates] = useState(start);
	const counterRef = useRef(0);

	useEffect(() => {
		if (iconIsMoving && interpolatedRoute.length > 0) {
			const move = () => {
				if (counterRef.current < interpolatedRoute.length) {
					setIconCoordinates(interpolatedRoute[counterRef.current]);
					counterRef.current += 1;
					requestAnimationFrame(move);
				} else {
					// Stop the animation and update iconIsMoving to false
					setIconIsMoving(false);
				}
			};

			move(); // Start the animation loop

			return () => {
				counterRef.current = 0; // Reset the counter when the component unmounts or dependencies change
			};
		}
	}, [iconIsMoving, interpolatedRoute]);

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
