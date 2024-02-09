import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { View,Text, StyleSheet } from 'react-native';
import Header from '../Components/Header';

const ManiobrasList = () => 
{
  const [maniobras, setManiobras] = useState([]);
  return (
    <SafeAreaView style={{flex:1}}>
        <View style={styles.container}>
        <Header />
        <View style={styles.container1}>
          <Text style={{color:'white'}} >¡Bienvenido de nuevo!</Text>
        </View>
        <View style={{backgroundColor: 'white', borderTopRightRadius:20, borderTopLeftRadius:20, flex:4}}>
          <Text>Maniobras</Text>
        </View>
        </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create(
    {
        container:
        {
          flex:1,
          justifyContent:'space-between',
        },
        container1:{
            backgroundColor:'#03256C',
            flex:1
        }
    }
)

export default ManiobrasList
