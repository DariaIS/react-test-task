import React, { useEffect, useState } from 'react';

import { TVariable, TWeather } from '../types';

const URL = "https://api.open-meteo.com/v1/forecast";

const getUrl = ({ lat, long, variables }: Props) => (
    URL + "?" + new URLSearchParams({
        latitude: String(lat),
        longitude: String(long),
        daily: variables.join(','),
        timezone: "Europe/Moscow",
        past_days: "0",
        shortwave_radiation_sum: "0"
    }).toString()
);

interface Props {
    lat: number;
    long: number;

    variables: TVariable[];
}

const _Weather: React.FC<Props> = ({
    lat,
    long,
    variables
}) => {
    const [weather, setWeather] = useState<TWeather>();
    const [error, setError] = useState<string>("");

    useEffect(() => {
        // ошибка была в том, что мы пытались засетать значение ассинхронной операции
        // поэтому в weather мы получали `Promise {<pending>}`, который вернул нам fetch
        
        /*
        const url = getUrl({ lat, long, variables });
        fetch(url, { method: 'GET' })
            .then(resp => resp.json())
            .then(resp => {
                setWeather(resp);
            });
        */
        
        // но мне больше нравится async / await поэтому я переписала на него 🌚 
        const fetchWeather = async () => {
            try {
                const url = getUrl({ lat, long, variables });
                let response = await fetch(url, { method: 'GET' } );                        
                const data = await response.json();
                setWeather(data);
                if (error) setError("");
            } catch(err) {
                setError('Oops, something went wrong. You might want to check the console')
                console.error(err);
            }
        }

        fetchWeather();
    }, [lat, long, variables]);

    return error ? (
        <p className='error'>
            {error}
        </p>
    ) : (
        <>
            <h2>
                Your Daily Weather
            </h2>
            <table>
                <thead>
                    <tr>
                        <th>date</th>
                        {variables.map(variable => <th key={variable}>{variable}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {weather && 
                        (weather.daily.time.map((time, index) => (
                            <tr key={time}>
                                <th> {time} </th>

                                {variables.map(variable =>
                                    // так как не все указанные в ридми переменные присутствуют в
                                    // weather.daily, используем тернальник
                                    (variable in weather.daily ? (
                                        <td key={variable}>
                                            {weather.daily[variable as keyof typeof weather.daily][index]}
                                        </td>
                                    ) : (
                                        <React.Fragment key={variable}></React.Fragment>
                                    ))
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </>
    )
}

// обернула в React.memo чтобы избежать апдейта при изменении чекбоксов и ввода в textarea
export const Weather = React.memo(_Weather);