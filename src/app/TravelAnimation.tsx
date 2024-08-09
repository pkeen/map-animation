import React, { useState, useEffect, useRef } from "react";
import MovingIcon from "./MovingIcon";
import CompletedRoute from "./CompletedRoute";
import RemainingRoute from "./RemainingRoute";

interface TravelAnimationProps {
	start: number[];
	interpolatedRoute: number[][];
	bearings: number[];
	iconIsMoving: boolean;
	setIconIsMoving: (isMoving: boolean) => void;
	intervalTime: number; // Interval time passed from InterpolatedRoute
}

const TravelAnimation: React.FC<TravelAnimationProps> = ({
	start,
	interpolatedRoute,
	bearings,
	iconIsMoving,
	setIconIsMoving,
	intervalTime,
}) => {
	const [iconCoordinates, setIconCoordinates] = useState(start);
	const counterRef = useRef(0);
	const [completedRoute, setCompletedRoute] = useState<number[][]>([]);
	const [remainingRoute, setRemainingRoute] = useState(interpolatedRoute);

	useEffect(() => {
		if (iconIsMoving && interpolatedRoute.length > 0) {
			const move = () => {
				if (counterRef.current < interpolatedRoute.length - 1) {
					// slice the array to get the new completed and remaining routes
					const newCompletedRoute = interpolatedRoute.slice(
						0,
						counterRef.current + 1
					);
					const newRemainingRoute = interpolatedRoute.slice(
						counterRef.current + 1
					);
					setIconCoordinates(interpolatedRoute[counterRef.current]);
					setCompletedRoute(newCompletedRoute);
					setRemainingRoute(newRemainingRoute);

					counterRef.current += 1;
					setTimeout(move, intervalTime);
				} else {
					setIconIsMoving(false); // Stop the movement
				}
			};

			move(); // Start the animation loop

			return () => {
				counterRef.current = 0; // Reset the counter when the component unmounts or dependencies change
			};
		}
	}, [iconIsMoving, interpolatedRoute, intervalTime, setIconIsMoving]);

	return (
		<>
			<CompletedRoute completedRoute={completedRoute} />
			<RemainingRoute remainingRoute={remainingRoute} />
			<MovingIcon
				iconCoordinates={iconCoordinates}
				bearings={bearings}
				counterRef={counterRef} // Pass the counterRef to the MovingIcon component
			/>
		</>
	);
};

export default TravelAnimation;
