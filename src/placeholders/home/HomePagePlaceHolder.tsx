import { Component } from 'react';
import './homePagePlaceHolder.css';

export class HomePagePlaceHolder extends Component {
  render() {
    const items = [1, 2, 3, 4, 5];
    return (
      <div className='placeholder-wrapper'>
        <div className="placeholder-title-wrapper">
          <div className="title-placeholder"></div>
        </div>

        <div className="placeholder-card-wrapper">
          {items.map((item, idx) => (
            <div key={idx + item} className="placeholder-card">
              <div className="placeholder-card-image"></div>
              <div className="placeholder-card-content"></div>
              <div className="placeholder-card-footer"></div>
            </div>
          ))}
        </div>

      </div>
    )
  }
}

export default HomePagePlaceHolder
