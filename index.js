import React from 'react';
import _ from 'underscore';
import { Surface, Image, Text, ListView } from 'react-canvas';
import ImgurImage from './components/ImgurImage.jsx';
const CLIENT_ID = 'b45d8d58680bb94';
const NUM_IMAGES = 50;

class MainComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = { images: [] };

    this.fetchImages();
  }

  fetchImages() {
    var req = new XMLHttpRequest();

    function success() {
      this.setState({ 
        images: _.shuffle(JSON.parse(req.response)
                            .data
                            .slice(0, NUM_IMAGES))
      });
    }

    req.addEventListener('load', success.bind(this), false);
    req.open('get', 'https://api.imgur.com/3/gallery/random/random/0', true);
    req.setRequestHeader('Authorization', `Client-ID ${CLIENT_ID}`);
    req.send();
  }

  render() {
    var size = this.getSize();

    if (!this.state.images.length) {
      return (
        <Surface top={0} left={0} width={size.width} height={size.height}></Surface>
      );
    }

    return (
      <Surface top={0} left={0} width={size.width} height={size.height}>
        <ListView
          style={this.getListViewStyle()}
          snapping={true}
          scrollingDeceleration={0.92}
          scrollingPenetrationAcceleration={0.13}
          numberOfItemsGetter={this.getNumberOfImages}
          itemHeightGetter={this.getImageHeight.bind(this)}
          itemGetter={this.renderImage.bind(this)} />
      </Surface>
    );
  }

  getSize() {
    return document.querySelector('#app').getBoundingClientRect();
  }

  // ListView-specific methods
  getListViewStyle() {
    var size = this.getSize();

    return {
      top: 0,
      left: 0,
      width: size.width,
      height: size.height
    };
  }

  getNumberOfImages() {
    return NUM_IMAGES;
  }

  getImageHeight() {
    return this.getSize().height;
  }

  renderImage(imageIndex, scrollTop) {
    var size = this.getSize();
    var image = this.state.images[imageIndex];
    var imageScrollTop = imageIndex * this.getImageHeight() - scrollTop;

    return (
      <ImgurImage
        width={size.width}
        height={size.height}
        image={image}
        imageIndex={imageIndex}
        scrollTop={imageScrollTop} />
    );
  }
}

React.render(React.createElement(MainComponent), document.querySelector('#app'));

