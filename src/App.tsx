import Header from "./components/Header";
import ThroneScene from "./components/ThroneScene";

function App() {
	return (
		<div className="app">
			<Header chapter="I" day={1} />
			<ThroneScene timeOfDay="night" />
		</div>
	);
}

export default App;
