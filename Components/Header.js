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

  const takePhoto = () =>
  {
    navigate.navigate('SavePhoto');
  }

  return (
    <View style={{paddingTop:20,  backgroundColor:'#03256C',paddingHorizontal:18, flexDirection:'row', justifyContent:'space-between',}}>
      <View style={{flexDirection:'row'}}>
         <Pressable style={{padding:5}} onPress={()=>{logOut()}}>
           <Image style={{width:18, height:20}} source={require('../assets/img/cerrar-sesion.png')} />
         </Pressable>
         <Pressable onPress={()=>{takePhoto()}} style={{padding:5, marginHorizontal:10}}>
            <Image style={{width:18, height:20}} source={require('../assets/img/perfil_blanco.png')} />
         </Pressable>
      </View>
      <View>
        <Image style={{width:110, height:30}} source={require('../assets/img/coorsa-blanco.png')} />
      </View>
    </View>
  )
}
