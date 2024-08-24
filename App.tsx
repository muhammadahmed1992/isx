import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import StackNavigation from './src/navigation/StackNavigation';
import {Provider} from 'react-redux';
import {store, persistor} from './src/redux/store';
import {PersistGate} from 'redux-persist/integration/react';
import {ActivityIndicator, View} from 'react-native';
import {Colors} from './src/utils';
import {MenuProvider} from 'react-native-popup-menu';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <MenuProvider>
        <NavigationContainer
          fallback={
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <ActivityIndicator color={Colors.primary} size="large" />
            </View>
          }>
          <StackNavigation />
        </NavigationContainer>
        </MenuProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
