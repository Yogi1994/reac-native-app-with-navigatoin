/* eslint-disable import/prefer-default-export */
import { Navigation } from 'react-native-navigation';

import ImageList from './components/screens/ImageList';
import ImageView from './components/screens/ImageView';

export function registerScreens(store, Provider) {
	Navigation.registerComponent('ImageView', () => ImageView, store, Provider);
	Navigation.registerComponent('ImageList', () => ImageList, store, Provider);
}
