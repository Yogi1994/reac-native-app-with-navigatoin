/* @flow */

/**
 * @fileoverview This is the image view screen
 */

"use strict";

import React, { PropTypes, Component } from 'react';
import {
  Platform,
  View,
  ListView,
  Image, Text,
  ActivityIndicator,
  RefreshControl,
  Dimensions
} from 'react-native';
import axios from 'axios';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import * as imagesActions from '../../actions/app-action';
import styles from '../../styles/ImageListStyle';

const URL = 'https://jsonplaceholder.typicode.com';


class ImageView extends Component {

	constructor(props: Object){
		super(props);
		console.log(props);
	}

	render () {
		var dim = Dimensions.get('window').width;
		var height = Dimensions.get('window').height;
		return (
			<View style={{height:height, backgroundColor:'black'}}>
				<Image style={{height:dim,width:dim}} source={{uri: this.props.image.url}} />
				<Text style={{color:'white'}}>{this.props.image.id}</Text>
                                <Text style={{color:'white'}}>{this.props.image.title}</Text>
			</View>
		);
	}

}

export default ImageView;