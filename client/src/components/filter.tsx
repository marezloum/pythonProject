import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './filter.scss'; // Import the SASS styles


interface Category {
    id: string;
    name: string;
}

interface Result {
    id: string;
    title: string;
    likes: number;
}


const Filter: React.FC = () => {
    const [filterInput, setFilterInput] = useState<string>("");
    const [alphabets] = useState<string[]>(["А", "Б", "В", "Г", "Д", "Е", "Ё", "Ж", "З", "И", "Й", "К", "Л", "М", "Н", "О", "П", "Р", "С", "Т", "У", "Ф", "Х", "Ц", "Ч", "Ш", "Щ", "Ъ", "Ы", "Ь", "Э", "Ю", "Я"]);
    const [selectedAlphabets, setSelectedAlphabets] = useState<string[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [withImage, setWithImage] = useState<boolean>(false);
    const [withVideo, setWithVideo] = useState<boolean>(false);
    const [results, setResults] = useState<Result[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const catResponse = await axios.get<Category[]>('http://localhost:3008/categories');
                setCategories(catResponse.data);
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };

        fetchData();
    }, []);

    const handleAlphabetChange = (alphabet: string) => {
        setSelectedAlphabets(prev =>
            prev.includes(alphabet) ? prev.filter(a => a !== alphabet) : [...prev, alphabet]
        );
    };


    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const options = event.target.options;
        const values: string[] = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                values.push(options[i].value);
            }
        }
        setSelectedCategories(values);
    };


    const handleSearch = async () => {
        setLoading(true);
        try {
            const response = await axios.post<Result[]>('http://localhost:3008/filter', {
                input: filterInput,
                categories: selectedCategories,
                alphabets: selectedAlphabets,
                withImage,
                withVideo,
            });
            setResults(response.data);
        } catch (error) {
            console.error("Error fetching results", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="filter">
            <div className="search-bar">
                <input 
                    type="text" 
                    placeholder="Введите слово..." 
                    value={filterInput} 
                    onChange={(e) => setFilterInput(e.target.value)} 
                />
                <button onClick={handleSearch} disabled={loading}>
                    {loading ? 'Поиск...' : 'Поиск'}
                </button>
            </div>
            <div className="alphabet">
                <p>Выберите буквы:</p>
                <div className="checkbox-buttons">
                    {alphabets.map((alphabet) => (
                        <label key={alphabet}>
                            <input 
                                type="checkbox" 
                                checked={selectedAlphabets.includes(alphabet)} 
                                onChange={() => handleAlphabetChange(alphabet)} 
                            />
                            {alphabet}
                        </label>
                    ))}
                </div>
            </div>

            <div className="options">
                <label htmlFor="category">Выбрать тематику:</label>
                <select id="category" multiple value={selectedCategories} onChange={handleCategoryChange}>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>

            <div className="filters">
                <label>
                    <input type="checkbox" checked={withImage} onChange={() => setWithImage(!withImage)} />
                    С изображением
                </label>
                <label>
                    <input type="checkbox" checked={withVideo} onChange={() => setWithVideo(!withVideo)} />
                    С видео
                </label>
            </div>

            <div className="results">
                <h3>Результаты:</h3>
                <div className="wordList" id="filterWordList">
                    <ul id="filterResult" className="nameList">
                        {results.map(result => (
                            <li key={result.id}>
                                <span>{result.title}</span> - <span>{result.likes ?? 0} лайков</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Filter;