import { Source, Layer } from "react-map-gl";

interface RemainingRouteProps {
	remainingRoute: number[][];
}

const RemainingRoute: React.FC<RemainingRouteProps> = ({ remainingRoute }) => {
	return (
		<Source
			id="remaining-route"
			type="geojson"
			data={{
				type: "Feature",
				geometry: {
					type: "LineString",
					coordinates: remainingRoute,
				},
			}}
		>
			<Layer
				id="remaining-route-layer"
				type="line"
				layout={{
					"line-join": "round",
					"line-cap": "round",
				}}
				paint={{
					"line-color": "rgba(0, 187, 255, 0.5)", // Green with 50% transparency
					"line-width": 5,
				}}
			/>
		</Source>
	);
};

export default RemainingRoute;
