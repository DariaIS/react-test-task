export type TWeather = {
    daily: {
        rain_sum: number[];
        snowfall_sum: number[];
        time: string[];
    };
    daily_units: {
        rain_sum: string;
        snowfall_sum: string;
        time: string;
    };
    elevation: number;
    generationtime_ms: number;
    latitude: number;
    longitude: number;
    timezone: string;
    timezone_abbreviation: string;
    utc_offset_seconds: number;
}

export type TVariable = 
    | "weathercode"
    | "temperature_2m_max"
    | "temperature_2m_min"
    | "apparent_temperature_max"
    | "apparent_temperature_min"
    | "sunrise"
    | "sunset"
    | "precipitation_sum"
    | "rain_sum"
    | "showers_sum"
    | "snowfall_sum"
    | "precipitation_hours"
    | "windspeed_10m_max"
    | "windgusts_10m_max"
    | "winddirection_10m_dominant"
    | "shortwave_radiation_sum"
    | "et0_fao_evapotranspiration";
