import React from 'react';
import HomePage from './home-page';
import Start from './start';
import Backpack from './backpack';
import Walk from './walk';
import Pokebox from './pokebox';
import { response } from 'express';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 'start',
      stats: null,
      pokemons: [],
      pokemonDetails: null,
      startLat: null,
      startLon: null,
      currLat: null,
      currLon: null,
      currMilesWalked: null,
      sessionTimeWalked: 0,
      startTime: 0
    };
    this.setView = this.setView.bind(this);
    this.getStats = this.getStats.bind(this);
    this.getPokemon = this.getPokemon.bind(this);
    this.setPokemonDetails = this.setPokemonDetails.bind(this);
    this.getStartPosition = this.getStartPosition.bind(this);
    this.getCurrentPosition = this.getCurrentPosition.bind(this);
    this.calculateDistance = this.calculateDistance.bind(this);
    this.getTimeWalked = this.getTimeWalked.bind(this);
    // this.getItems = this.getItems.bind(this);
  }

  componentDidMount() {
    this.getStats();
    this.getPokemon();
    const d = new Date();
    const startTime = d.getTime();
    this.setState({ startTime });
    this.getItems();
  }

  getTimeWalked() {
    if (!this.state.timeWalked) {
      const startTime = this.state.startTime;
      let currentTime = 0;
      let timeDiff = 0;
      setInterval(() => {
        const d = new Date();
        currentTime = d.getTime();
        timeDiff = currentTime - startTime;
        const tw = Math.round(timeDiff / 60000);
        this.setState({ sessionTimeWalked: tw });
      }, 60001);
    }
  }

  // getItems() {
  //   for (let i = 1; i <= 16; i++) {
  //     fetch(`https://pokeapi.co/api/v2/item/${i}`)
  //       .then(response => response.json())
  //       .then(item => {
  //         // const items = {
  //         //   itemId: i,
  //         //   sprite: item.sprites.default,
  //         //   shortDesc: item.effect_entries[0].short_effect,
  //         //   longDesc: item.flavor_text_entries[0].text,
  //         //   effectDesc: item.effect_entries[0].effect,
  //         //   itemType: 'ball',
  //         //   name: item.name
  //         // };
  //         console.log(item);
  //       });
  //   }

  // }

  getPokemon() {
    fetch('/api/pokeboxes')
      .then(response => response.json())
      .then(pokemons => {
        this.setState({ pokemons });
        this.setPokemonDetails(0);
      });
  }

  getStartPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => this.setState({ startLat: position.coords.latitude, startLon: position.coords.longitude })
        , error => {
          switch (error.code) {
            case (0):
              console.error('Error unknown');
              break;
            case (1):
              alert('Permission denied. Permission must be enabled to track walk distance');
              break;
            case (2):
              console.error('Position unavailable');
              break;
            case (3):
              console.error('Request timed out');
              break;
          }
        }, { enableHighAccuracy: true });
    }
  }

  getCurrentPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        position => this.setState({ currLat: position.coords.latitude, currLon: position.coords.longitude })
        , error => {
          switch (error.code) {
            case (0):
              console.error('Error unknown');
              break;
            case (1):
              alert('Permission denied. Permission must be enabled to track walk distance');
              break;
            case (2):
              console.error('Position unavailable');
              break;
            case (3):
              console.error('Request timed out');
              break;
          }
        },
        { enableHighAccuracy: true });
    }
  }

  calculateDistance(startLat, startLon, currLat, currLon) {
    if ((startLat === currLat) && (startLon === currLon)) {
      return 0;
    }
    const radStartLat = Math.PI * startLat / 180;
    const radCurrLat = Math.PI * currLat / 180;
    const theta = startLon - currLon;
    const radTheta = Math.PI * theta / 180;
    let distance = Math.sin(radStartLat) * Math.sin(radCurrLat) + Math.cos(radStartLat) * Math.cos(radCurrLat) * Math.cos(radTheta);
    if (distance > 1) {
      distance = 1;
    }
    distance = Math.acos(distance);
    distance = distance * 180 / Math.PI;
    distance = distance * 60 * 1.1515;
    this.setState({ currMilesWalked: distance });
    if (this.state.currMilesWalked > 0.3) {
      this.setState({
        stats: {
          milesWalked: this.state.stats.milesWalked + this.state.currMilesWalked
        },
        currMilesWalked: 0
      });
      fetch('/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.state.stats)
      })
        .then(res => res.json())
        .then(data => process.stdout.write(data));
    }
  }

  setPokemonDetails(index) {
    if (this.state.pokemons) {
      this.setState({ pokemonDetails: this.state.pokemons[index] });
    }
  }

  getStats() {
    fetch('/api/users')
      .then(res => res.json())
      .then(stats => this.setState({ stats }))
      .catch(err => console.error(err.message));
  }

  setView(view) {
    this.setState({ view });
    this.getTimeWalked();
  }

  render() {
    let display = null;
    switch (this.state.view) {
      case 'start':
        display = <Start
          setView={this.setView}
          getStartPosition={this.getStartPosition}
          getCurrentPosition={this.getCurrentPosition}
        />;
        break;
      case 'home':
        display = <HomePage
          stats={this.state.stats}
          setView={this.setView}
          timeWalked={this.state.sessionTimeWalked}
          pokemons={this.state.pokemons}/>;
        break;
      case 'backpack':
        display = <Backpack setView={this.setView} />;
        break;
      case 'walk':
        display = <Walk timeWalked={this.state.sessionTimeWalked} stats={this.state.stats} setView={this.setView} />;
        break;
      case 'pokebox':
        display = <Pokebox
          setView={this.setView}
          pokemons={this.state.pokemons}
          setPokemonDetails={this.setPokemonDetails}
          pokemonDetails={this.state.pokemonDetails}
        />;
        break;
    }
    return (
      display
    );
  }
}
