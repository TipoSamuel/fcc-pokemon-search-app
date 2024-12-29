// DOM elements
const $searchInput = document.getElementById('search-input')
const $searchBtn = document.getElementById('search-button')

// pokemon stats

const $pokemonTypesContainer = document.getElementById('types')

const API_BASE_URL = 'https://pokeapi-proxy.freecodecamp.rocks/api/pokemon'
const MAX_STAT_VALUE = 255

const fetchPokemonData = async (query) => {
	try {
		// realizar consulta a la API
		const response = await fetch(`${API_BASE_URL}/${query}`)

		if (!response.ok) {
			throw new Error('Pokemon not found')
		}

		const pokemonData = await response.json()
		return pokemonData
	} catch (error) {
		console.error(error)
		alert('Pokémon not found')
	}
}

const calculateStatPercentage = (stat) => {
	const percentage = Math.min(Math.max((stat / MAX_STAT_VALUE) * 100, 0), 100)
	return percentage
}

const clearPokemonInfo = () => {
	// limpiar tipos del pokemon
	$pokemonTypesContainer.innerHTML = ''
}

const updatePokemonInfo = (pokemonData) => {
	// pokemon id
	const $pokemonId = document.getElementById('pokemon-id')
	const pokemonId = pokemonData.id
	const formattedId = `#${pokemonId}`
	$pokemonId.textContent = formattedId

	// pokemon name
	const $pokemonName = document.getElementById('pokemon-name')
	$pokemonName.textContent = pokemonData.name

	// pokemon type
	pokemonData.types.forEach((typeInfo) => {
		const newType = document.createElement('span')
		newType.classList.add('pokemon-type', typeInfo.type.name)
		newType.textContent = typeInfo.type.name
		$pokemonTypesContainer.appendChild(newType)
	})

	// pokemon sprite
	const $pokemonSprite = document.getElementById('sprite')
	$pokemonSprite.src = pokemonData.sprites.front_default
	$pokemonSprite.alt = `image of ${pokemonData.name.to}`

	// pokemon dimensions
	// height
	const $pokemonHeight = document.getElementById('height')
	$pokemonHeight.textContent = pokemonData.height

	// weight
	const $pokemonWeight = document.getElementById('weight')
	$pokemonWeight.textContent = pokemonData.weight

	const statElements = document.querySelectorAll('.pokemon-stat')

	pokemonData.stats.forEach((stat, index) => {
		const statBarElement = statElements[index].querySelector('.pokemon-stat-bar')
		const statNumberElement = statElements[index].querySelector('.pokemon-stat-number')

		// Actualizamos la barra de progreso
		statBarElement.innerHTML = `
        <div style="width: ${calculateStatPercentage(stat.base_stat)}%"></div>
        `

		// actualizamos el valor numérico
		statNumberElement.textContent = stat.base_stat
	})
}

const searchPokemon = async (event) => {
	// evitar la recarga de la pagina al enviar el formulario
	event.preventDefault()

	// verificar si el input contiene un valor
	if (!$searchInput.value) {
		alert('Please enter a name or a Pokemon ID')
		return
	}

	// obtener el valor del input, eliminar espacios y pasar a minúsculas
	const query = $searchInput.value.trim().toLowerCase()

	const pokemonData = await fetchPokemonData(query)

	clearPokemonInfo()

	updatePokemonInfo(pokemonData)
}

// Events
$searchBtn.addEventListener('click', searchPokemon)
