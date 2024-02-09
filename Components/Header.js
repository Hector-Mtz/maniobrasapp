import React from 'react'
import { View, StyleSheet, Text, Image } from 'react-native'

export default function Header() 
{
  return (
    <View style={{paddingVertical:5,  backgroundColor:'#03256C',}}>
        <Image style={{width:18, height:20}} source={require('../assets/img/cerrar-sesion.png')} />
    </View>
  )
}
