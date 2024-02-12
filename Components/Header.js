import React from 'react'
import { View, StyleSheet, Text, Image, Pressable } from 'react-native'
//Navigation
import { useNavigation } from '@react-navigation/native';

export default function Header() 
{
  const navigate = useNavigation();
  const logOut = () => 
  {
     navigate.navigate('Login');
  }

  return (
    <View style={{paddingTop:20,  backgroundColor:'#03256C',paddingHorizontal:18, flexDirection:'row', justifyContent:'space-between',}}>
      <Pressable onPress={()=>{logOut()}}>
        <Image style={{width:18, height:20}} source={require('../assets/img/cerrar-sesion.png')} />
      </Pressable>
      <View>
        <Image style={{width:110, height:30}} source={require('../assets/img/coorsa-gris.png')} />
      </View>
    </View>
  )
}
