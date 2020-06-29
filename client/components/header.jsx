import React from 'react';

export default class Header extends React.Component {
  render() {
    return (
      <div className='pokebox-header'>
        <div className="triangle-button" />
        <div className="right-side-buttons">
          <div className="button yellow-circle-button" />
          <div className="button green-circle-button" />
          <div className="button outer-white-circle">
            <div className="inner-blue-circle" />
          </div>
        </div>
      </div>
    );
  }
}