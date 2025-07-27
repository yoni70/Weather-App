const historyKey = "weatherSearchHistory";

    // Load saved history on page load
    window.onload = () => {
      const savedHistory = JSON.parse(localStorage.getItem(historyKey)) || [];
      savedHistory.reverse().forEach(city => addToHistory(city, false));
      toggleClearButton();
    };

    async function getWeather(cityFromClick = null) {
      const city = cityFromClick || document.getElementById("cityInput").value.trim();
      const apiKey = "d1b340469aa8d0ec348c3c55603744be"; // Replace with your API key

      if (!city) {
        alert("Please enter a city name.");
        return;
      }

      document.getElementById("loader").classList.remove("hidden");

      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("City not found");

        const data = await response.json();

        // Display data
        document.getElementById("weatherResult").classList.remove("hidden");
        document.getElementById("cityName").textContent = data.name;
        document.getElementById("temperature").textContent = `${data.main.temp}°C`;
        document.getElementById("description").textContent = data.weather[0].description;
        document.getElementById("humidity").textContent = `Humidity: ${data.main.humidity}%`;
        document.getElementById("wind").textContent = `Wind: ${data.wind.speed} km/h`;
        document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

        addToHistory(data.name); // save only valid city names
      } catch (error) {
        alert("Error: " + error.message);
        document.getElementById("weatherResult").classList.add("hidden");
      }

      document.getElementById("loader").classList.add("hidden");
    }

    function addToHistory(city, saveToStorage = true) {
      const list = document.getElementById("historyList");
      const items = Array.from(list.children);

      const lowerCity = city.toLowerCase();

      // Remove existing duplicate
      items.forEach(item => {
        if (item.textContent.toLowerCase() === lowerCity) {
          list.removeChild(item);
        }
      });

      // Add to top
      const newItem = document.createElement("li");
      newItem.textContent = city;
      newItem.onclick = () => getWeather(city);
      list.insertBefore(newItem, list.firstChild);

      toggleClearButton();

      if (saveToStorage) {
        saveHistory(city);
      }
    }

    function saveHistory(city) {
      let history = JSON.parse(localStorage.getItem(historyKey)) || [];

      // Remove if exists
      history = history.filter(item => item.toLowerCase() !== city.toLowerCase());

      history.push(city); // Add new one at the end (so we can reverse on load)
      localStorage.setItem(historyKey, JSON.stringify(history));
    }

    function clearHistory() {
      localStorage.removeItem(historyKey);
      document.getElementById("historyList").innerHTML = "";
      toggleClearButton();
    }

    function toggleClearButton() {
      const hasItems = document.getElementById("historyList").children.length > 0;
      document.getElementById("clearHistoryBtn").classList.toggle("hidden", !hasItems);
    }