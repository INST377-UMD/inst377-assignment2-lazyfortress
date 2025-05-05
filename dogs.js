//  Array for breed ID and breed name
const breedNameToId = {};

// Create carousel with random dog images
async function initCarousel() {
    try {
        const response = await fetch('https://dog.ceo/api/breeds/image/random/10');
        const data = await response.json();
        const carousel = document.getElementById('dogCarousel');
        carousel.innerHTML = '';
        data.message.forEach(imgUrl => {
        const img = document.createElement('img');
        img.src = imgUrl;
        carousel.appendChild(img);
        });
        simpleslider.getSlider();
    } catch (error) {
        console.error('Error fetching dog images:', error);
    }
}

// Fetch and display dog breed buttons
async function loadBreedButtons() {
    try {
        const response = await fetch('https://dogapi.dog/api/v2/breeds');
        const data = await response.json();
        const buttonContainer = document.getElementById('breedButtons');

        data.data.forEach(breed => {
            const name = breed.attributes.name;

            // Populate array without removing spaces
            breedNameToId[name.toLowerCase()] = breed.id;
            // Custom button
            const button = document.createElement('button');
            button.className = 'button-52';
            button.textContent = name;
            button.setAttribute('data-breed-id', breed.id);
            button.addEventListener('click', () => loadBreedInfo(breed.id));
            buttonContainer.appendChild(button);
        });
    } catch (error) {
        console.error('Error fetching breed list:', error);
    }
}

// Load and display breed information
async function loadBreedInfo(id) {
    try {
        // show block upon load, hiding the block initially
        document.getElementById('breedInfo').style.display = 'block';
        const response = await fetch(`https://dogapi.dog/api/v2/breeds/${id}`);
        const data = await response.json();
        const breedData = data.data.attributes;

        const infoBox = document.getElementById('breedInfo');
        infoBox.innerHTML = 
        `<h3>${breedData.name}</h3>
        <p><strong>Description:</strong> ${breedData.description || 'N/A'}</p>
        <p><strong>Life Expectancy:</strong> ${breedData.life?.min || '?'} - ${breedData.life?.max || '?'} years</p>`;
    } catch (error) {
        console.error('Error fetching breed information:', error);
        const infoBox = document.getElementById('breedInfo');
        infoBox.innerHTML = `<h3>Breed Info</h3><p>Information not available.</p>`;
    }
}

// DEPRECATED
// // Capitalize the first letter of a string
// function capitalize(str) {
//     return str.charAt(0).toUpperCase() + str.slice(1);
// }

// Voice command setup
function setupVoiceCommands() {
    if (annyang) {
        const commands = {
            'load dog breed *breed': (breed) => {
                const formattedBreed = breed.toLowerCase();
                const breedId = breedNameToId[formattedBreed];
                if (breedId) {
                    loadBreedInfo(breedId);
                } else {
                    alert(`Could not find breed: "${breed}"`);
                }
            },
            'navigate to *page': (page) => {
                const lower = page.toLowerCase();
                if (['stocks', 'dogs'].includes(lower)) {
                    window.location.href = `${lower}.html`;
                }
                if (["home"].includes(lower)){
                    window.location.href = `a2${lower}.html`;
                }
            },
            'change the color to *color': (color) => {
                document.body.style.backgroundColor = color;
            },
            'hello': () => {
                alert('Hello World');
            }
        };
        annyang.addCommands(commands);
    }
}

function startListening() {
    if (annyang) {
        annyang.start();
    }
}

function stopListening() {
    if (annyang) {
        annyang.abort();
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    initCarousel();
    loadBreedButtons();
    setupVoiceCommands();
});
