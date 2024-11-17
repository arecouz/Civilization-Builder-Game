// Run when dom fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const otherPlanets = document.querySelectorAll('.planet.other-planet');
  const popover = document.querySelector('.popover');

  // Stats
  let productionRate = 0;
  let year = 0;
  let population = 2;
  let maxPopulation = 1_000_000; // 1 million
  let purchasedResources = 0;
  let resources_ = 2;

  // Resource capacities and initial counts
  let fire = 0,
    fireCapacity = 50,
    fireCost = 1;
  let coal = 0,
    coalCapacity = 25,
    coalCost = 2000;
  let solar = 0,
    solarCapacity = 50,
    solarCost = 45000;
  let nuclear = 0,
    nuclearCapacity = 5,
    nuclearCost = 95000;

  // Update stats function
  const updateStats = () => {
    document.getElementById('year').textContent = `Year: ${year}`;
    document.getElementById(
      'population'
    ).textContent = `Population: ${Math.floor(population)}`;
    document.getElementById('resources').textContent = `Resources: ${Math.floor(
      resources_
    )}`;

    // Production Rate
    const loadingBarWidth = Math.min(productionRate * 1000, 100); // Cap at 100%
    const loadingBar = document.getElementById('loading-bar');
    const loadingContainer = document.getElementById('loading-container');
    const initialText = document.getElementById('inital-text');
    if (loadingBarWidth >= 100) {
      loadingContainer.style.display = 'none'; // Hide the loading bar
      initialText.style.display = 'none';
      displayEmojiBasedOnProduction(); // Show emoji based on production rate
    } else {
      loadingBar.style.width = `${loadingBarWidth}%`; // Update loading bar
    }

    // Update resource statuses
    // Fire Resource
    const fireButton = document.querySelector('[data-resource="fire"]');
    if (fire >= fireCapacity) {
      document.getElementById(
        'fire-status'
      ).textContent = `You've cut all the trees down! ${fire}`;
      fireButton.disabled = true; // Disable the fire button if fire reaches max capacity
    } else if (resources_ < fireCost) {
      document.getElementById('fire-status').textContent = `${fire}`; // Clear text if not enough resources
      fireButton.disabled = true; // Disable the fire button if resources are less than fireCost
    } else {
      document.getElementById('fire-status').textContent = `${fire}`;
      fireButton.disabled = false; // Enable the fire button
    }

    // Coal Resource
    const coalButton = document.querySelector('[data-resource="coal"]');
    if (coal >= coalCapacity) {
      document.getElementById(
        'coal-status'
      ).textContent = `The planet's getting too hot! ${coal}`;
      coalButton.disabled = true; // Disable the coal button if coal reaches max capacity
    } else if (resources_ < coalCost) {
      document.getElementById('coal-status').textContent = `${coal}`; // Clear text if not enough resources
      coalButton.disabled = true; // Disable the coal button if resources are less than coalCost
    } else {
      document.getElementById('coal-status').textContent = `${coal}`;
      coalButton.disabled = false; // Enable the coal button
    }

    // Solar Resource
    const solarButton = document.querySelector('[data-resource="solar"]');
    if (solar >= solarCapacity) {
      document.getElementById(
        'solar-status'
      ).textContent = `There's no more space for solar panels! ${solar}`;
      solarButton.disabled = true; // Disable the solar button if solar reaches max capacity
    } else if (resources_ < solarCost) {
      document.getElementById('solar-status').textContent = `${solar}`; // Clear text if not enough resources
      solarButton.disabled = true; // Disable the solar button if resources are less than solarCost
    } else {
      document.getElementById('solar-status').textContent = `${solar}`;
      solarButton.disabled = false; // Enable the solar button
    }

    // Nuclear Resource
    const nuclearButton = document.querySelector('[data-resource="nuclear"]');
    if (nuclear >= nuclearCapacity) {
      document.getElementById(
        'nuclear-status'
      ).textContent = `You've reached the max capacity! ${nuclear}`;
      nuclearButton.disabled = true; // Disable the nuclear button if nuclear reaches max capacity
    } else if (resources_ < nuclearCost) {
      document.getElementById('nuclear-status').textContent = `${nuclear}`; // Clear text if not enough resources
      nuclearButton.disabled = true; // Disable the nuclear button if resources are less than nuclearCost
    } else {
      document.getElementById('nuclear-status').textContent = `${nuclear}`;
      nuclearButton.disabled = false; // Enable the nuclear button
    }
  };

  // Display emojis based on productionRate
  let emoji = '🔥';
  const displayEmojiBasedOnProduction = () => {
    const emojiContainer = document.getElementById('emoji-container'); // Assuming you have an element for this
    if (productionRate >= 10) emoji = '🔥🛖';
    if (productionRate >= 200) emoji = '🔥🛖🌾';
    if (productionRate >= 500) emoji = '🔥🛖🌾🗿';
    if (productionRate >= 1000) emoji = '🔥🛖🌾🗿📜';
    if (productionRate >= 3000) emoji = '🔥🛖🌾🗿📜🏛️';
    if (productionRate >= 4000) emoji = '🔥🛖🌾🗿📜🏛️⚖️';
    if (productionRate >= 7000) emoji = '🔥🛖🌾🗿📜🏛️⚖️🚂';
    if (productionRate >= 90000) emoji = '🔥🛖🌾🗿📜🏛️⚖️🚂🔭';
    if (productionRate >= 1000000) emoji = '🔥🛖🌾🗿📜🏛️⚖️🚂🔭💻';
    if (productionRate >= 10000000) emoji = '🔥🛖🌾🗿📜🏛️⚖️🚂🔭💻👨‍🚀';
    if (productionRate >= 100000000) emoji = '🔥🛖🌾🗿📜🏛️⚖️🚂🔭💻👨‍🚀🤖';
    if (productionRate >= 700000000) checkEndGame();

    emojiContainer.textContent = `${emoji}`;
  };
  // Population growth logic (exponential growth with cap)
  const calculatePopulationGrowth = () => {
    if ((population < maxPopulation) & (population < resources_ * 10)) {
      const growthRate = 1.3; // Adjust this to control how fast the population grows
      population *= growthRate;
    }
  };

  // Resource generation logic
  const calculateResources = () => {
    productionRate = purchasedResources * 0.5 * (population * 0.1);
    resources_ += productionRate; // Resource generation based on population and purchasedResources
  };

  // Buy resource function
  const buyResource = (type, cost) => {
    if (resources_ >= cost) {
      resources_ -= cost;

      // Update the respective resource count
      // and the purchasedResources
      if (type === 'fire' && fire < fireCapacity) {
        fire++;
        purchasedResources += 0.2;
      }
      if (type === 'coal' && coal < coalCapacity) {
        coal++;
        purchasedResources += 1; // multiplier value
      }
      if (type === 'solar' && solar < solarCapacity) {
        solar++;
        purchasedResources += 5; // multiplier value
      }
      if (type === 'nuclear' && nuclear < nuclearCapacity) {
        nuclear++;
        purchasedResources += 10; // multiplier value
      }
      if (type === 'launch') {
        maxPopulation += 1_000_000;
        document.getElementById('fire-status').textContent = `${fire}`;
        fireCapacity += 15;
        document.getElementById('coal-status').textContent = `${coal}`;
        coalCapacity += 15;
        document.getElementById('solar-status').textContent = `${solar}`;
        solarCapacity += 15;
        document.getElementById('nuclear-status').textContent = `${nuclear}`;
        nuclearCapacity += 15;
      }

      updateStats();
    }
  };

  // Attach buy logic to buttons
  document.querySelectorAll('.buy-button').forEach((button) => {
    button.addEventListener('click', () => {
      const resourceType = button.getAttribute('data-resource');
      if (resourceType === 'fire')
        buyResource('fire', fireCost, 'fireCapacity');
      if (resourceType === 'coal')
        buyResource('coal', coalCost, 'coalCapacity');
      if (resourceType === 'solar')
        buyResource('solar', solarCost, 'solarCapacity');
      if (resourceType === 'nuclear')
        buyResource('nuclear', nuclearCost, 'nuclearCapacity');
    });
  });

  // Function to generate random position within the game container
  const getRandomPosition = (maxX, maxY) => {
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);
    return { x: randomX, y: randomY };
  };

  const checkEndGame = () => {
    const launchedPlanets = document.querySelectorAll(
      '.planet[data-launched="true"]'
    ).length;
    if (launchedPlanets === 6) {
      const endGameMessage = document.getElementById('endgame');
      endGameMessage.style.display = 'block';
      const endGameButton = document.getElementById('endgame-button-launch');
      endGameButton.addEventListener('click', () => {
        location.reload();
      });
    }
  };

  // The menu/logic for other planets
  const togglePopover = (planet) => {
    // Check planet status
    const dataLaunched = planet.getAttribute('data-launched');
    const launched = dataLaunched === 'true';

    // Launch Button OR launched text
    const launchButton = document.getElementById('launch-button');
    const launchedText = document.getElementById('launched-text');

    if (launched) {
      launchButton.style.display = 'none';
      launchedText.style.display = 'block';
    } else {
      launchButton.style.display = 'block';
      launchedText.style.display = 'none';
    }

    if (popover.style.display === 'block') {
      popover.style.display = 'none'; // Hide if already visible
    } else {
      // Calculate distance to planet
      const homePlanetRect = document
        .querySelector('.home-planet')
        .getBoundingClientRect();
      const planetRect = planet.getBoundingClientRect();
      const dist = Math.sqrt(
        (homePlanetRect.x - planetRect.x) ** 2 +
          (homePlanetRect.y - planetRect.y) ** 2
      );
      const cost = Math.round(dist * 1000000).toLocaleString();
      const costAsInt = parseInt(cost.replace(/,/g, ''), 10);

      document.getElementById('expedition-cost').textContent = `${cost}`;

      // Update button disabled state
      if (resources_ < costAsInt) {
        launchButton.disabled = true;
      } else {
        launchButton.disabled = false;
      }

      // Remove existing event listeners to prevent duplication or conflicts
      const newLaunchHandler = () => {
        launchButton.style.display = 'none';
        launchedText.style.display = 'block';
        newLaunchButton.disabled = true;
        planet.setAttribute('data-launched', 'true'); // Set specific planet
        buyResource('launch', costAsInt);
        animateLaunch(homePlanetRect, planetRect);
      };

      launchButton.replaceWith(launchButton.cloneNode(true)); // Replace button to clear old listeners
      const newLaunchButton = document.getElementById('launch-button');
      newLaunchButton.addEventListener('click', newLaunchHandler);

      // Position popover next to planet
      popover.style.top = `${planetRect.bottom}px`;
      popover.style.left = `${planetRect.left - planetRect.width * 2}px`;
      popover.style.display = 'block';
    }
  };

  const animateLaunch = (from, to) => {
    // Create the rocket element
    const rocket = document.createElement('div');
    rocket.classList.add('rocket');
    document.body.appendChild(rocket);

    // Set the rocket's initial position
    rocket.style.left = `${from.x}px`;
    rocket.style.top = `${from.y}px`;

    // Calculate the difference in positions
    const deltaX = to.x - from.x;
    const deltaY = to.y - from.y;

    // Use CSS variables for the target positions
    rocket.style.setProperty('--delta-x', `${deltaX}px`);
    rocket.style.setProperty('--delta-y', `${deltaY}px`);

    // Add the animation class
    rocket.classList.add('launch-animation');

    // Remove the rocket after the animation completes
    rocket.addEventListener('animationend', () => {
      rocket.remove();
    });
  };

  // Loop through each planet and set a random position
  otherPlanets.forEach((planet, index) => {
    // Set the max X and Y positions based on the container size
    const maxX = window.innerWidth * 0.8; // 80% of the viewport width
    const maxY = window.innerHeight * 0.6; // 80% of the viewport height
    const { x, y } = getRandomPosition(maxX, maxY);
    // Position and colour each planet
    planet.style.left = `${x}px`;
    planet.style.top = `${y}px`;
    planet.style.backgroundColor = `hsl(${(index * 60) % 360}, 100%, 50%)`; // Different color for each planet
    // Add Clickable listener
    planet.addEventListener('click', (event) => {
      togglePopover(planet);
    });
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.planet') && !event.target.closest('.popover')) {
      popover.style.display = 'none';
    }
  });

  // Increment year and update stats every 2 seconds
  const incrementYear = () => {
    year++;
    calculatePopulationGrowth(); // Update population
    calculateResources(); // Generate resources
    updateStats(); // Update the displayed stats
  };

  // Initialize stats
  updateStats();
  // Start interval and the game
  setInterval(incrementYear, 2000);
});

// Bugs
// - changing the window-size midgame causes the 