import React, { useState } from 'react';
import axios from 'axios';
import './SearchComponent.scss'; // Import the SASS styles

// Define the type for the items returned from the API
interface ResultItem {
  id: number; // Adjust the type according to your database structure
  title: string;
}
//react functional component (type for searchComponent)
const SearchComponent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>(''); //use state for search input(keyup)
  const [results, setResults] = useState<ResultItem[]>([]);//results of Api call

  //هندل کی آپ یک فانکشنه که یه ورودی داره به اسم ایونت و تایپ ایونت بعدشه 
  const handleKeyUp = async (event: React.KeyboardEvent<HTMLInputElement>) => {
   //React.KeyboardEvent یک جنریک تایپ هستش،  
   //<HTMLInputElement> با نوشتن این، داریم میگیم دقیق کدوم المنت، اینجا مثلا اینپوت داریم، میتونیم دیو داشته باشیم و ...
    const term = (event.target as HTMLInputElement).value;
    //هروقت یک ایونت برای یک المنت رخ میده، مقدار ایونت توسط همان المنت پر می شود
    //event.target=input as==> type. value---> مقدار میده

    if (term) {//if string is not empty
      try {
        const response = await axios.get<ResultItem[]>(`http://localhost:3008/search?term=${term}`);//ریزالتی که فانکشنِ  اکسیوز .گت  میده، یک آرایه از ریزالت آیتمه.
        setResults(response.data);//جوابِ ای پی آی
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    } else {
      setResults([]); // Clear results if input is empty
    }
  };

  return (
    <div className="search-component">
      <input
        type="text"
        value={searchTerm}
        onChange={(event)=>setSearchTerm(event.target.value)}
        onKeyUp={handleKeyUp}
        placeholder="Search..."
      />
      <ul>
        {results.map((item) => (
          <li key={item.id}>{item.title}</li> // Adjust 'id' and 'title' according to your database structure
        ))}
      </ul>
    </div>
  );
};

export default SearchComponent;