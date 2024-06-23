import { useEffect, useState } from 'react';

import { Weather } from './components/Weather';

import { AVAILABLE_VARIABLES } from './constants';

import { TVariable } from './types';

import { useDebounce } from './hooks/use-debounce';

import './App.css';

const DEFAULT_VALUE: TVariable[] = ['rain_sum', 'snowfall_sum'];

function App() {
    // введенное значение
    const [variables, setVariables] = useState<string[]>(DEFAULT_VALUE);

    // введенные невалидные переменные
    const [invalidVars, setInvalidVars] = useState<string[]>([]);

    // провалидированные переменные, которые отправятся в запросе
    const [validVariables, setValidVariables] = useState<TVariable[]>(DEFAULT_VALUE);

    const inputValue = variables.join(", ");
    
    const debouncedVariables = useDebounce(validVariables, 500);

    const handleTextareaInput = (value: string) => {
        const currVars = value.split(", ");
        setVariables(currVars);
    }

    const handleCheckboxChange = (isChecked: boolean, key: TVariable): void => {
        setVariables((prev) => {
            if (isChecked) return [...prev, key];
            return prev.filter((item) => item !== key)
        })
    };

    useEffect(() => {
        const currInvalidVars: string[] = [];
        variables.forEach((item) => {
            if (!AVAILABLE_VARIABLES.includes(item as TVariable)) {
                currInvalidVars.push(item);
            }
        });

        if (currInvalidVars.length) {
            setInvalidVars(currInvalidVars);
            return
        }
        setValidVariables(variables as TVariable[]);
        setInvalidVars([]);
    }, [variables])

    return (
        <div className="main">
            <h1>Daily Weather App</h1>
            <h3>
                Available values:
            </h3>
            <p>
                {AVAILABLE_VARIABLES.map((item, index) => 
                    item + `${index !== AVAILABLE_VARIABLES.length - 1 ? ", " : ""}`
                )}
            </p>
            <div>
                <h4>
                    Please input any of the available variables:
                </h4>
                <label>
                    {/* букв может быть много, поэтому думаю с textarea будет по-удобнее  */}
                    <textarea 
                        rows={5}
                        cols={50}
                        value={inputValue}
                        onInput={e => handleTextareaInput((e.target as HTMLInputElement).value)}
                    />
                </label>
            </div>

            <h4>
                Or you can use checkboxes:
            </h4>
            <fieldset>
                {AVAILABLE_VARIABLES.map((item) => (
                    <div key={item}>
                        <label>
                            <input 
                                key={item} 
                                type="checkbox"
                                name={item}
                                checked={variables.includes(item)}
                                onChange={(e) => handleCheckboxChange(e.target.checked, item)}
                            />
                            {item}
                        </label>
                    </div>
                ))}
            </fieldset>

            {invalidVars.length ? (
                <p className='error'>
                    {`${invalidVars.join(", ")} - is invalid vars`}
                </p>
            ) : (
                <Weather lat={55.751244} long={37.618423} variables={debouncedVariables} />
            )}
        </div>
    );
}

export default App;
