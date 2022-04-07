import React, { useState, useEffect, useRef } from "react";
import alanBtn from "@alan-ai/alan-sdk-web";
import moment from "moment";
import { WiNightCloudy } from "react-icons/wi";
import { BsSearch } from "react-icons/bs";

import "./Home.scss";

const Home = () => {
  const [weatherData, setWeatherData] = useState({});
  const [location, setLocation] = useState("hyderabad");
  const [locations, setLocations] = useState([
    "Hyderabad",
    "Mumbai",
    "Delhi",
    "Banglore",
  ]);
  const locationInputRef = useRef();

  const ALAN_API_KEY =
    "b250ce8f251595cb5ab11bc67ea35ff42e956eca572e1d8b807a3e2338fdd0dc";

  useEffect(() => {
    const alanButton = alanBtn({
      key: "b250ce8f251595cb5ab11bc67ea35ff42e956eca572e1d8b807a3e2338fdd0dc/stage",
      onCommand: ({ command, data }) => {
        if (command === "go:back") {
          // Call the client code that will react to the received command
        } else if (command === "weatherData") {
          console.log(data);
          const time = moment().utcOffset(`${data?.timezone}`).format("lll");
          const weather = {
            city: data?.name,
            temp: Math.round(data?.main?.temp),
            min_temp: data?.main?.temp_min,
            max_temp: data?.main?.temp_max,
            wind: data?.wind?.speed,
            weather_type: data?.weather[0]?.main,
            humidity: data?.main?.humidity,
            feels_like: data?.main?.feels_like,
            pressure: data?.main?.pressure,
            time: time,
            icon: data?.weather[0]?.icon,
          };
          setWeatherData(weather);
          setLocations((oldLocations) => {
            return [weather.city, ...oldLocations.slice(0, 3)];
          });
        }
      },
    });
    alanButton.playText("Welcome Back");
    alanButton.activate();
  }, []);
  const getWeatherData = async () => {
    const res = await fetch(
      `http://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=0efae17121ccdfd4ce7ddb5ef38cfe5a`
    );
    const data = await res.json();
    const time = moment().utcOffset(`${data?.timezone}`).format("lll");
    const weather = {
      city: data?.name,
      temp: Math.round(data?.main?.temp),
      min_temp: data?.main?.temp_min,
      max_temp: data?.main?.temp_max,
      wind: data?.wind?.speed,
      weather_type: data?.weather[0]?.main,
      humidity: data?.main?.humidity,
      feels_like: data?.main?.feels_like,
      pressure: data?.main?.pressure,
      time: time,
      icon: data?.weather[0]?.icon,
    };
    setWeatherData(weather);
  };

  useEffect(() => {
    getWeatherData();
  }, [location]);

  return (
    <div className="app__main app__flex">
      <div className="app__main-box">
        <div className="app__main-left">
          <div className="app__main-left-content app__flex">
            <div className="temperature">
              <h1>{weatherData.temp}°</h1>
            </div>
            <div className="location">
              <h2>{weatherData.city}</h2>
              <span>{weatherData.time}</span>
            </div>

            <div className="weather ">
              <img
                src={` http://openweathermap.org/img/wn/${weatherData.icon}.png`}
                alt="type"
              />
              <h4>{weatherData.weather_type}</h4>
            </div>
          </div>
        </div>
        <div className="app__main-right">
          <div className="app__main-right-content">
            <div className="search">
              <input
                type="text"
                placeholder="Search Location"
                ref={locationInputRef}
              />
              <button
                onClick={() => {
                  if (locationInputRef.current.value.trim() === "") {
                    return;
                  }
                  setLocation(locationInputRef.current.value);
                  setLocations((oldLocations) => {
                    return [
                      locationInputRef.current.value,
                      ...oldLocations.slice(0, 3),
                    ];
                  });
                }}
              >
                <BsSearch />
              </button>
              <div></div>
            </div>
            <div className="locations">
              <h3>Other Locations</h3>
              {locations.map((location, index) => {
                return (
                  <span
                    key={index}
                    onClick={() => {
                      setLocation(location);
                    }}
                  >
                    {location}
                  </span>
                );
              })}
            </div>
            <div className="weather-details">
              <h3>Weather Details</h3>
              <div>
                <span>Feels Like</span>
                <span>{weatherData.feels_like}°</span>
              </div>
              <div>
                <span>Humidity</span>
                <span>{weatherData.humidity}%</span>
              </div>
              <div>
                <span>Wind</span>
                <span>{weatherData.wind}Km/h</span>
              </div>
              <div>
                <span>Min Temp</span>
                <span>{weatherData.min_temp}</span>
              </div>
              <div>
                <span>Max Temp</span>
                <span>{weatherData.max_temp}</span>
              </div>
            </div>
            {/* <div className="next-days">
              <h3>Next Days</h3>
              <div className="days">
                <div className="day app__flex">
                  <span>Monday</span>
                  <span>
                    <WiNightCloudy />
                  </span>
                  <h4>16°</h4>
                </div>
                <div className="day">
                  <span>Tuesday</span>
                  <span>
                    <WiNightCloudy />
                  </span>
                  <h4>16°</h4>
                </div>
                <div className="day">
                  <span>Monday</span>
                  <span>
                    <WiNightCloudy />
                  </span>
                  <h4>16°</h4>
                </div>
                <div className="day">
                  <span>Monday</span>
                  <span>
                    <WiNightCloudy />
                  </span>
                  <h4>16°</h4>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
