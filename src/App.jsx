import { Grid } from '@material-ui/core';
import React, { Component } from 'react';
import tinyParams from 'tiny-params';
import AccommodationDetails from './components/accommodation-details/AccommodationDetails.jsx';
import AccommodationList from './components/accommodation-list/AccommodationList.jsx';
import Favorites from './components/favorites/Favorites.jsx';
import Filters from './components/filters/Filters.jsx';
import Header from './components/header/Header.jsx';
import './App.css';

const FAVORITES_LOCAL_STORAGE_KEY = 'favorites';

const API_HOST = 'https://warsawjs-workshop-32-book-it-m.herokuapp.com';

const SORTING = ['MAX_AVG_RATING', 'MAX_REVIEWS', 'MIN_PRICE', 'MAX_PRICE'];

class App extends Component {
  state = {
    accommodations: {
      data: null,
      fetching: false,
      errors: null,
    },
    sorting: 0,
    filters: {
      search: '',
      centre: '',
      minPrice: '',
      minAvgRating: '',
      minReviewsCount: '',
    },
    openedDetails: null,
    favorites: JSON.parse(localStorage.getItem(FAVORITES_LOCAL_STORAGE_KEY) || "[]"),
  };

  componentDidMount() {
    const params = tinyParams(window.location.href);

    if (window.location.pathname === '/details') {
      this.fetchDetails(params.id);
    } else {
      this.setState({
        filters: {
          centre: params.centre || '',
          minAvgRating: params.minAvgRating || '',
          minPrice: params.minPrice || '',
          minReviewsCount: params.minReviewsCount || '',
          search: params.search || '',
        },
        sorting: SORTING.indexOf(params.sorting) < 0 ? 0 : SORTING.indexOf(params.sorting),
      }, this.fetchList);
    }
  }

  fetchList = () => {
    const { filters, sorting, accommodations } = this.state;
    const { search, centre, minPrice, minAvgRating, minReviewsCount } = filters;
    const url = `/list?search=${search}&centre=${centre}&minPrice=${minPrice}&minAvgRating=${minAvgRating}&minReviewsCount=${minReviewsCount}&sorting=${SORTING[sorting]}`;

    window.history.pushState(null, '', url);

    this.setState({
      accommodations: {
        data: accommodations.data,
        fetching: true,
        errors: null,
      },
    });

    fetch(`${API_HOST}${url}`).then(response => {
      response.json().then(({ list }) => {
        this.setState({
          accommodations: {
            data: list,
            fetching: false,
            errors: null,
          },
        });
      }, errors => {
        this.setState({
          accommodations: {
            data: null,
            fetching: false,
            errors: errors.message,
          },
        });
      });
    });
  };

  fetchDetails = (id) => {
    const url = `/details?id=${id}`;

    this.setState({
      openedDetails: {
        ...(this.state.openedDetails || {}),
        fetching: true,
        errors: null,
      },
    });

    window.history.pushState(null, '', url);

    fetch(`${API_HOST}${url}`).then(response => {
      response.json().then(({ data }) => {
        this.setState({
          openedDetails: {
            data,
            fetching: false,
            errors: null,
          },
        });
      }, errors => {
        this.setState({
          openedDetails: {
            data: null,
            fetching: false,
            errors: errors.message,
          },
        });
      });
    });
  };

  handleBackToList = () => {
    this.setState({
      openedDetails: null,
    }, this.fetchList);
  };

  handleFiltersChange = filters => {
    this.setState({ filters });
  };

  handleFavorite = (favorite) => {
    const { favorites } = this.state;
    const addToFavorite = favorites.findIndex(({ id }) => favorite.id === id) < 0;
    const updatedFavorites = addToFavorite ?
      [...favorites, favorite] : favorites.filter(item => item.id !== favorite.id);

    localStorage.setItem(FAVORITES_LOCAL_STORAGE_KEY, JSON.stringify(updatedFavorites));
    this.setState({ favorites: updatedFavorites });
  };

  render() {
    const { accommodations, filters, sorting, openedDetails, favorites } = this.state;

    return (
      <div className="App">
        <Header />
        {openedDetails ? (
          <AccommodationDetails
            openedDetails={openedDetails}
            onBackToList={this.handleBackToList}
          />
        ) : (
          <Grid container>
            <Filters
              filters={filters}
              onSearch={this.fetchList}
              onFiltersChange={this.handleFiltersChange}
            />
            <AccommodationList
              accommodations={accommodations}
              favorites={favorites}
              sorting={sorting}
              onDetails={this.fetchDetails}
              onFavorite={this.handleFavorite}
            />
          </Grid>
        )}
        <Favorites
          favorites={favorites}
          onDetails={this.fetchDetails}
          onFavorite={this.handleFavorite}
        />
      </div>
    );
  }
}

export default App;