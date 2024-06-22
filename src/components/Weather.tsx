/* tslint:disable */
// @ts-nocheck
import React, { useEffect, useState } from 'react';

import { TWeather } from '../types';

const URL = "https://api.open-meteo.com/v1/forecast";

const getUrl = ({ lat, long, variables }: Props) => (
    URL + "?" + new URLSearchParams({
        latitude: lat,
        longitude: long,
        daily: variables.join(','),
        timezone: "Europe/Moscow",
        past_days: 0,
        shortwave_radiation_sum: 0
    }).toString()
);

interface Props {
    lat: number;
    long: number;

    variables: TVariable[];
}

const Weather: React.FC<Props> = ({
    lat,
    long,
    variables
}) => {
    const [weather, setWeather] = useState<TWeather>();

    useEffect(() => {
        // ошибка была в том, что мы пытались засетать значение ассинхронной операции
        // поэтому в `weather` получали `Promise {<pending>}`, который вернул нам fetch
        
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
            console.log(variables);
            const url = getUrl({ lat, long, variables });
            let response = await fetch(url, { method: 'GET' } );                        
            const data = await response.json();
            setWeather(data);
        }

        fetchWeather();
    }, [lat, long, variables]);

    return (
        <table style={{width: '100%'}}>
            <thead>
                <tr>
                    <th>date</th>
                    {variables.map(variable => <th key={variable}>{variable}</th>)}
                </tr>
            </thead>
            <tbody>
                {weather && 
                    (weather.daily.time.map((time, index) => (
                        <tr key={time + index}>
                            <th> {time} </th>

                            {variables.map(variable =>
                                // так как не все указанные  в ридми переменные присутствуют в
                                // weather.daily, используем тернальник
                                (variable in weather.daily ? (
                                    <td key={variable}>
                                        {weather.daily[variable][index]}
                                    </td>
                                ) : <></>)
                            )}
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    )
}


export default Weather;
