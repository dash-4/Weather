import React, { useState, useEffect } from "react";

function CurrentWeather() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("");
  const apiKey = "0dff0dad8628f32f4a228f3113f1461e"; 

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      setLoading(true);
      fetchWeatherByCity(city);
      setCity("");
    }
  };

  const fetchWeather = (lat, lon) => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&lang=ru&units=metric`)
      .then((response) => {
        if (!response.ok) throw new Error("Не удалось получить данные о погоде");
        return response.json();
      })
      .then((data) => {
        setWeather(data);
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  };

  const fetchWeatherByCity = (city) => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&lang=ru&units=metric`)
      .then((response) => {
        if (!response.ok) throw new Error("Город не найден");
        return response.json();
      })
      .then((data) => {
        setWeather(data);
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          fetchWeather(lat, lon);
        },
        (err) => {
          setError(new Error("Не удалось получить местоположение"));
          setLoading(false);
        }
      );
    } else {
      setError(new Error("Геолокация не поддерживается"));
      setLoading(false);
    }
  }, []);

  if (loading) return <div>Загрузка...</div>;
  if (error) return (
    <div>
      <p>Ошибка: {error.message}</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Введите город"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit">Узнать погоду</button>
      </form>
    </div>
  );
  if (!weather) return <div>Нет данных о погоде</div>;

  return (
    <div>
      <h1>Погода</h1>
      <p>Город: {weather.name}</p>
      <p>Температура: {Math.round(weather.main.temp)}°C</p>
      <p>Погода: {weather.weather[0].description}</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Введите город"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit">Узнать погоду</button>
      </form>
    </div>
  );
}

export default CurrentWeather;