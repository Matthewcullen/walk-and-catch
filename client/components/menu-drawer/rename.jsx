import React from 'react';

export default class Rename extends React.Component {
  render() {
    return (
      <div className="action-modal">
        <div className="action-contents">
          <div className="action-header">Name your Pokémon:</div>
          <form className = "action-body" style={{ marginTop: '10px' }}onSubmit={this.props.handleSubmit}>
            <input
              type="text"
              defaultValue={this.props.pokemonName}
              onChange={this.props.handleNameChange}
              className="pokemon-rename"
            />
            <button className='rename-enter' type='submit'>ENTER</button>
          </form>
        </div>
      </div>
    );
  }
}
