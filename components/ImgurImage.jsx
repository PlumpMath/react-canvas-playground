import React from 'react';
import { Group, Image, Text, FontFace, measureText } from 'react-canvas';
const TEXT_LAYER_INDEX = 1;
const IMAGE_LAYER_INDEX = 2;
const CONTENT_INSET = 14;
const TEXT_ALPHA_SPEED_OUT_MULTIPLIER = 1.25;
const TEXT_ALPHA_SPEED_IN_MULTIPLIER = 2.6;
const TEXT_SCROLL_SPEED_MULTIPLIER = 0.6;

export default class ImgurImage extends React.Component {
  constructor(props) {
    super(props);

    var image = this.props.image;
    var maxWidth = this.props.width - 2 * CONTENT_INSET;
    var titleStyle = this.getTitleStyle();
    this.titleMetrics = measureText(
      image.title,
      maxWidth,
      titleStyle.fontFace,
      titleStyle.fontSize,
      titleStyle.lineHeight
    );
  }

  render() {
    var groupStyle = this.getGroupStyle();
    var imageStyle = this.getImageStyle();
    var titleStyle = this.getTitleStyle();

    titleStyle.height = this.titleMetrics.height;

    return (
      <Group style={groupStyle}>
        <Image style={imageStyle} src={this.props.image.link} fadeIn={true} />
        <Group style={this.getTextGroupStyle()}>
          <Text style={titleStyle}>{this.props.image.title}</Text>
        </Group>
      </Group>
    );
  }

  // styles
  getGroupStyle() {
    return {
      top: 0,
      left: 0,
      width: this.props.width,
      height: this.props.height
    };
  }

  getImageHeight() {
    return Math.round(this.props.height * 0.5);
  }

  getImageStyle() {
    return {
      top: 0,
      left: 0,
      width: this.props.width,
      height: this.getImageHeight(),
      backgroundColor: '#eee',
      zIndex: IMAGE_LAYER_INDEX
    };
  }

  getTitleStyle() {
    return {
      top: this.getImageHeight() + CONTENT_INSET,
      left: CONTENT_INSET,
      width: this.props.width - 2 * CONTENT_INSET,
      fontSize: 30,
      lineHeight: 30,
      fontFace: FontFace('Avenir Next Condensed, Helvetica, sans-serif', null, { weight: 500 })
    };
  }

  getTextGroupStyle() {
    var imageHeight = this.getImageHeight();
    var translateY = 0;
    var alphaMultiplier = (this.props.scrollTop <= 0) ?
      -TEXT_ALPHA_SPEED_OUT_MULTIPLIER :
      TEXT_ALPHA_SPEED_IN_MULTIPLIER;
    var alpha = 1 - (this.props.scrollTop / this.props.height) * alphaMultiplier;
    alpha = Math.min(Math.max(alpha, 0), 1);
    translateY = -this.props.scrollTop * TEXT_SCROLL_SPEED_MULTIPLIER;

    return {
      width: this.props.width,
      height: this.props.height - imageHeight,
      top: imageHeight,
      left: 0,
      alpha: alpha,
      translateY: translateY,
      zIndex: TEXT_LAYER_INDEX
    };
  }
}
