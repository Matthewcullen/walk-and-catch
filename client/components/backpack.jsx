import React from 'react';
import ItemDetails from './item-details';
import ListItem from './item-list-item';

export default class Backpack extends React.Component {
  render() {
    const items = this.props.items;
    return (
      <div className="pokedex-body">
        <ItemDetails
          timeOfDay={this.props.timeOfDay}
          backgroundImage={this.props.backgroundImage}
          item={this.props.itemDetails} />
        <div className="pokedex-screen-container">
          <div className="pokedex-rectangle-screen">
            <div className="pokedex-headline">BACKPACK</div>
            <div className="backpack-list to-uppercase">
              {items.length > 0
                ? items.map(item =>
                  <ListItem
                    number={items.indexOf(item)}
                    key={items.indexOf(item)}
                    item={item}
                    setItemDetails={this.props.setItemDetails}
                  />
                )
                : <div style={{ marginTop: '10px' }}>NO ITEMS FOUND:(</div>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
