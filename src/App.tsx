import {useEffect, useState} from 'react'
import './App.css'
import {Button} from "./components/ui/button.tsx";
import {CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis} from 'recharts';

interface PopulationItem {
    Year: number;
    "Total Population": number;
    Nation: string;
    "Nation ID": string;
}

const trendYearLengthOptions = [3, 5, 10];

function App() {
    const [data, setData] = useState<PopulationItem[] | undefined>(undefined);
    const [trendYearLength, setTrendYearLength] = useState<number>(trendYearLengthOptions[0]);
    const [error, setError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetch("https://honolulu-api.datausa.io/tesseract/data.jsonrecords?cube=pums_5&drilldowns=Nation,Year&measures=Total+Population")
            .then(response => response.json())
            .then(json => {
                const unitedStatesData = json.data.filter((item: PopulationItem) => item.Nation === 'United States') || [];

                setData(unitedStatesData);
                setLoading(false);
            })
            .catch(() => setError(true));
    }, []);

    if (error) {
        return <div className="flex items-center justify-center h-screen text-5xl">Oops. Something went wrong</div>;
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen text-5xl">
                Loading...
            </div>
        );
    }

    const trendData = data?.slice(data.length - trendYearLength);

    const YTickFormatter = (value: number) => `${(value / 1000000).toFixed(0)}M`;

    return (
        <div className="flex flex-col items-center h-screen w-screen p-10 sm:p-32">
            <div className="font-bold text-4xl text-center">Development of the US population</div>

            <div className="mt-4 text-sm">Select the length of the trend line:</div>
            <div className="mt-2 gap-4 flex flex-row">
                {trendYearLengthOptions.map((option: number) => (
                    <Button key={option} onClick={() => setTrendYearLength(option)} variant={trendYearLength === option ? 'secondary' : 'ghost'}>
                        {option} Years
                    </Button>
                ))}
            </div>

            <ResponsiveContainer className="mt-12">
                <LineChart width={300} height={100} data={trendData}>
                    <Line type="monotone" dataKey="Total Population" stroke="#0f0f0f" strokeWidth={4} />
                    <CartesianGrid strokeDasharray="3 3"  />
                    <XAxis dataKey="Year" />
                    <YAxis dataKey="Total Population" tickFormatter={YTickFormatter} domain={['dataMin-500000', 'dataMax+1000000']} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default App
