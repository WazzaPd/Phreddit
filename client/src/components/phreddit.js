import React, { useState, useEffect } from 'react';
import Banner from './banner.js';
import Navbar from './navbar.js';
import MainContent from './mainContent.js'
import WelcomePage from './welcomePage.js';

export default function Phreddit() {
  const [toggle, setToggle] = useState(true);
  const [page, setPage] = useState('home');
  const [selectedCommunity, setSelectedCommunity] = useState(null); //for community pages
  const [searchTerms, setSearchTerms] = useState([]); // To store search terms
  const [exactSearchTerms, setExactSearchTerms] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  //welcome page
  const [welcomePageOptionSelected, setWelcomePageOptionSelected] = useState(false)

  async function refreshCommunitiesNav() {
    console.log("Called: refreshCommunitiesNav");
    setRefreshTrigger(prev => !prev); 
  }

  const toggleNavbar = () => {
    setToggle(!toggle);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1200) {
        setToggle(true);
      } else {
        setToggle(false);
      }
    };
    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize); // cleanup event listener when unmounts
  }, []);

  function extractSearchTerms(input) {
    if (!input) return [];
    setExactSearchTerms(input);
    const terms = input.toLowerCase().split(' ').filter(term => term.trim() !== ''); 
    // console.log(terms)
    return terms;
  }

  function handlePageChange(newPage, communityID = null) {
    setPage(newPage);
    // console.log("from handlePageChange this is communityID: " + communityID);
    if (communityID) {
      setSelectedCommunity(communityID);
    }
  }

  function switchWelcomePageOption() {
    setWelcomePageOptionSelected(!welcomePageOptionSelected);
  }

  if(!welcomePageOptionSelected) {
    return (
      <WelcomePage handlePageChange={handlePageChange} switchWelcomePageOption={switchWelcomePageOption} style={{ width: '100%', height: '100%' }}/>
    )
  } else{
    return (
      <div className="phreddit" style={{ width: '100%', height: '100%' }}>
        <Banner 
          onPageChange={handlePageChange} 
          toggleNavbar={toggleNavbar} 
          extractSearchTerms={extractSearchTerms}
          setSearchTerms={setSearchTerms}
          page={page}
          switchWelcomePageOption={switchWelcomePageOption}
        />
        <Navbar 
          page={page} 
          onPageChange={handlePageChange}
          toggle={toggle} 
          selectedCommunity = {selectedCommunity}
          refreshTrigger={refreshTrigger}
        />
        <MainContent
          page={page}
          selectedCommunity = {selectedCommunity}
          onPageChange = {handlePageChange}
          toggle = {toggle}
          searchTerms = {searchTerms}
          exactSearchTerms = {exactSearchTerms}
          refreshCommunitiesNav={refreshCommunitiesNav}
        />
      </div>
    );
  }
}
