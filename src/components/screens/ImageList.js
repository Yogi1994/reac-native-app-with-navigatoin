/* @flow */

/**
 * @fileoverview This is the image list screen
 */

"use strict";

import React, { PropTypes, Component } from 'react';
import {
  Platform,
  View,
  ListView,
  Image, Text,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import axios from 'axios';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import * as imagesActions from '../../actions/app-action';
import styles from '../../styles/ImageListStyle';
const URL = 'https://jsonplaceholder.typicode.com';


class ImageList extends Component {

  constructor(props : Object) {
    super(props);

    this.state = {
      isLoading: true,
      isRefreshing: false,
      currentPage: 1,
      list: {
        results: []
      }
    };

    this._viewImage = this._viewImage.bind(this);
    this._onRefresh = this._onRefresh.bind(this);
    this.props.navigator.setOnNavigatorEvent(this._onNavigatorEvent.bind(this));
  }


  componentWillMount() {
    this._retrieveImagesList();
  }

  _retrieveImagesList(isRefreshed) {
    this.props.actions.retrieveImagesList(this.props.type, this.state.currentPage)
      .then(() => {
        const ds = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 });
        const dataSource = ds.cloneWithRows(this.props.list);
        this.setState({
          list: this.props.list,
          dataSource,
          isLoading: false
        });
      });
    if (isRefreshed && this.setState({ isRefreshing: false }));
  }

  _retrieveNextPage(type) {
    if (this.state.currentPage !== this.props.list.total_pages) {
      this.setState({
        currentPage: this.state.currentPage + 1
      });

      let page;
      if (this.state.currentPage === 1) {
        page = 2;
        this.setState({ currentPage: 2 });
      } else {
        page = this.state.currentPage + 1;
      }

      axios.get(`${URL}/photos?_limit=20&_page=${page}`)
        .then(res => {
          console.log(res,`${URL}/photos?_limit=20&_page=${page}`);
          const data = this.state.list;
          const newData = res.data;

          newData.map((item, index) => data.push(item));

          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.state.list)
          });
        }).catch(err => {
          console.log('next page', err); // eslint-disable-line
        });
    }
  }

  _viewImage(image) {
    this.props.navigator.showModal({
      screen: 'ImageView',
      passProps: {
        image
      }      
    });
  }

  _onRefresh() {
    this.setState({ isRefreshing: true });
    this._retrieveImagesList('isRefreshed');
  }

  _onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'close') {
        this.props.navigator.dismissModal();
      }
    }
  }

  footer() {
    return (
      <View style={{ height: 50 }}>
        <ActivityIndicator size="large" color={"#EA0000"} />
      </View>
    );
  }

  render() {
    return (
      this.state.isLoading ? <View style={styles.progressBar}><ActivityIndicator size="large" color={"#EA0000"} /></View> :
      <ListView
        style={styles.container}
        enableEmptySections
        onEndReached={type => this._retrieveNextPage(this.props.type)}
        
        dataSource={this.state.dataSource}
        renderRow={rowData => <TouchableOpacity activeOpacity={0.9} onPress={this._viewImage.bind(this, rowData)}>
                                <Image style={{height:100, width: 100}} source={{uri:rowData.thumbnailUrl}} />
                                <Text style={{color:'white'}}>{rowData.id}</Text>
                                <Text style={{color:'white'}}>{rowData.title}</Text>
                              </TouchableOpacity> }
        renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.seperator} />}
        renderFooter={() => this.footer()}
        refreshControl={
          <RefreshControl
            refreshing={this.state.isRefreshing}
            onRefresh={this._onRefresh}
            colors={['#EA0000']}
            tintColor="white"
            title="loading..."
            titleColor="white"
            progressBackgroundColor="white"
          />
        }
      />
    );
  }
}


ImageList.propTypes = {
  actions: PropTypes.object.isRequired,
  list: PropTypes.array,
  navigator: PropTypes.object
};

let navigatorStyle = {};

if (Platform.OS === 'ios') {
  navigatorStyle = {
    navBarTranslucent: true,
    drawUnderNavBar: true
  };
} else {
  navigatorStyle = {
    navBarBackgroundColor: '#0a0a0a'
  };
}

ImageList.navigatorStyle = {
  ...navigatorStyle,
  statusBarColor: 'black',
  statusBarTextColorScheme: 'light',
  navBarTextColor: 'white',
  navBarButtonColor: 'white'
};


function mapStateToProps(state : Object) {
  return {
    list: state.appReducer.list
  };
}

function mapDispatchToProps(dispatch : Function) {
  return {
    actions: bindActionCreators(imagesActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ImageList);
