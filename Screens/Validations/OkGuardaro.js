import React, { useState,useEffect } from 'react'
import { Pressable, StyleSheet, View, SafeAreaView,Text, Image, TouchableOpacity } from 'react-native'
//Navigation
import { useNavigation } from '@react-navigation/native';
import Header from '../../Components/Header';
import { AnimatedCheckMark } from 'react-native-animation-catalog';
import LottieView from "lottie-react-native";

export default function OkGuardaro(props) 
{
  const navigate = useNavigation();
  const [datosSesion, setDatosSesion] = useState({});

  useEffect(()=>
  {
     if(props.route.params)
     {
      setDatosSesion(props.route.params.data);
     }
  },[]);

  const returnToTurnos = () => 
  {
    navigate.navigate('TurnosList',{data:datosSesion, maniobra:props.route.params.maniobra});
  }
  return (
    <SafeAreaView style={{flex:1}}>
       <View style={styles.container}>
          <Header />
          <View style={styles.container1}>
             <Text style={{color:'white', fontSize:18, fontFamily:'Montserrat-Light'}} >¡Bienvenido de nuevo</Text>
             {
              datosSesion !== {} ?
              <View>
                 <Text style={{color:'white', fontFamily:'Montserrat-SemiBold', fontSize:20}}>{datosSesion.name} !</Text>
              </View>
              : null
             }
           </View>
           <View style={{backgroundColor: '#F4F5F9',  flex:5, borderTopStartRadius:36,borderTopEndRadius:36, marginTop:-30}}>
              <View style={{flexDirection:'row', justifyContent:'space-between', marginHorizontal:0, padding:10}}>
                 <Pressable onPress={()=>{returnToTurnos()}}  style={{padding:15}}>
                    <Image style={{transform: [{rotate: '180deg'}]}}  source={require('../../assets/img/flecha.png')} />
                 </Pressable> 
              </View>
           </View>
           <View style={{height:50}}>
              <LottieView
                source={require("../../assets/animation/Animation _17084634251562.json")}
                style={{width: "100%", height: "600%", backgroundColor:'#F4F5F9', padding:0, position:'relative',marginTop:-400}}
                autoPlay
                loop={true}
              />
              <Text style={{color:'#03256C', fontFamily:'Montserrat-SemiBold', fontSize:18, textAlign:'center', marginTop:-20}}>¡Guardado con éxito!</Text>
              <View style={{flexDirection:'row', justifyContent:'center', marginVertical:15}}>
                <TouchableOpacity onPress={()=>{returnToTurnos()}} style={{backgroundColor:'#1768AC',paddingHorizontal:40, paddingVertical:15, position:'absolute', borderRadius:100 }}>
                   <Text style={{ fontFamily:'Montserrat-SemiBold', fontSize:16, color:'white'}}>Aceptar</Text>
                </TouchableOpacity>
              </View>
           </View>
       </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container:
    {
      flex:1,
      justifyContent:'space-between',
    },
    container1:{
        backgroundColor:'#03256C',
        flex:1,
        paddingHorizontal:15,
        paddingTop:15,
        borderBottomRightRadius:0,
        zIndex:-1
    },
  });
