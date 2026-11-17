import Header from "./components/Header";

function App() {
	return (
		<>
			<Header chapter="I" day={1} />
			
			<main>
				<h1>Rule the Realm</h1>
				<p>Las crónicas de Astaria</p>
				<img src="/public/assets/characters/royalty/king.png" alt="" />
			</main>
		</>
	);
}

export default App;
