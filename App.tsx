import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
/*Screens*/ 
import Login from './Screens/Login';
import ManiobrasList from './Screens/ManiobrasList';
import TurnosList from './Screens/TurnosList';
import ListaAsistencia from './Screens/ListaAsistencia';
import Envio from './Screens/Envio';
import OkGuardaro from './Screens/Validations/OkGuardaro';
import SavePhoto from './Screens/SavePhoto';

const Stack = createStackNavigator();


function App(): React.JSX.Element 
{
  return (
    <NavigationContainer >
       <Stack.Navigator initialRouteName='Login' 
       screenOptions={{ headerShown:false,}}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name='ManiobrasList' component={ManiobrasList} />
          <Stack.Screen name='TurnosList' component={TurnosList} />
          <Stack.Screen name='ListaAsistencia' component={ListaAsistencia} />
          <Stack.Screen name='Envio' component={Envio} />
          <Stack.Screen name='SavePhoto' component={SavePhoto} />
          <Stack.Screen name='OkGuardaro' component={OkGuardaro} />
       </Stack.Navigator>
    </NavigationContainer>
  );
}


export default App;
