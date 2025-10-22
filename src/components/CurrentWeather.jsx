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
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&lang=ru&units=metric`
    )
      .then((response) => {
        if (!response.ok)
          throw new Error("Не удалось получить данные о погоде");
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
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&lang=ru&units=metric`
    )
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

  const renderForm = (
    <form
      className="flex border-4 border-double gap-3 mt-6 bg-gray-800/50 p-4 rounded-lg shadow-md animate-slide-up"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        placeholder="Введите город"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="p-2 rounded-lg border border-gray-300 flex-1 text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 transition duration-300"
      />
      <button
        type="submit"
        className="p-2 px-4  rounded-lg text-white font-semibold text-[30px]"
      >
        ⮕
      </button>
    </form>
  );

  if (loading)
    return <div className="text-center text-white text-xl">Загрузка...</div>;
  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <div className="bg-[#642387] text-[#F3C7D1] p-8 border-4 border-double max-w-md w-full">
          <p className="text-red-400 text-lg mb-4">Ошибка: {error.message}</p>
          {renderForm}
        </div>
      </div>
    );
  if (!weather)
    return (
      <div className="text-center text-white text-xl">Нет данных о погоде</div>
    );

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <div className="bg-[#642387] text-[#F3C7D1] p-8 border-4 border-double max-w-md w-full">
        <h1 className="text-4xl uppercase mb-4">Погода</h1>
        <p className="text-lg mb-2">Город: {weather.name}</p>
        <p className="text-lg mb-2">
          Температура: {Math.round(weather.main.temp)}°C
        </p>
        <p className="text-lg mb-2">Погода: {weather.weather[0].description}</p>
        {renderForm}
      </div>
    </div>
  );
}

export default CurrentWeather;
