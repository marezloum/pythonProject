import React from 'react'
import Filter from '../components/filter'
import SearchComponent from '../components/search'
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import './Home.scss'; // Import the SASS styles

function Home() {
  const userId = useSelector((state: RootState) => state.user.userId);

  return (
    <div>
      <div>User ID: {userId}</div>
        <Filter/>
        <SearchComponent/>
      
    </div>
  )
}

export default Home
