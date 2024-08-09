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
					"line-color": "#FFFF00", // Color for remaining route (e.g., red)
					"line-width": 5,
				}}
			/>
		</Source>
	);
};

export default RemainingRoute;
