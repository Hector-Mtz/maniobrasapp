import React, { useEffect, useState } from 'react'
import { SafeAreaView, StyleSheet, Text, View, Image, Pressable } from 'react-native'
import Header from '../Components/Header';
import { FlatList } from 'react-native-gesture-handler';
import axios from 'axios';
//Navigation
import { useNavigation } from '@react-navigation/native';

const TurnosList = (props) => 
{
    const navigate = useNavigation();
    //console.log(props.route.params.data[1])
    const [datosSesion, setDatosSesion] = useState({});
    const [turnos, setTurnos] = useState([]);
    useEffect(()=> 
    {
       //console.log(props.route.params.usuario)
       setDatosSesion(props.route.params.usuario);
       setTurnos(props.route.params.maniobra.turnos)
    },[])

    const returnToManiobras = () => 
    {
        navigate.navigate('ManiobrasList',{data:datosSesion});
    }

    const navigateToListaAsistencia = (turno) => 
    {
        navigate.navigate('ListaAsistencia',{data:datosSesion, turno:turno});
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
              <Pressable onPress={()=>{returnToManiobras()}} style={{padding:15}}>
                 <Image style={{transform: [{rotate: '180deg'}]}}  source={require('../assets/img/flecha.png')} />
              </Pressable>
              <View style={{paddingHorizontal:20, paddingVertical:0}}>
                <Text style={{color:'#03256C', fontFamily:'Montserrat-SemiBold', fontSize:22}}>Turnos</Text>
              </View>
              <View>
                 {
                    turnos.length > 0 ?
                    <View>
                       <FlatList 
                       scrollEnabled
                       data={turnos}
                       keyExtractor={(item) => item.id }
                       renderItem={({item}) => 
                        {
                         return (
                          <View style={styles.cardTurno}>
                            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                               <Text style={{color:'#05173B', fontFamily:'Montserrat-Medium', fontSize:18}}>{item.name}</Text>
                               <Pressable onPress={()=>{navigateToListaAsistencia(item)}} >
                                 <Image source={require('../assets/img/flecha.png')} />
                               </Pressable>
                            </View>
                            <View style={{flexDirection:'row', justifyContent:'space-between', marginVertical:20}}>
                                <View>
                                  <Text style={[styles.textFont]}>Entrada</Text>
                                  <View style={{flexDirection:'row', alignItems:'center'}}>
                                    <Image style={{width:15, height:15 ,marginRight:5}} source={require('../assets/img/reloj.png')} />
                                    <Text style={{color:'#05173B'}}>{item.hora_entrada}</Text>
                                  </View>
                                </View>
                                <View>
                                  <Text style={[styles.textFont]}>Salida</Text>
                                  <View style={{flexDirection:'row', alignItems:'center'}}>
                                    <Image style={{width:15, height:15 ,marginRight:5}} source={require('../assets/img/reloj.png')} />
                                    <Text style={{color:'#05173B'}}>{item.hora_salida}</Text>
                                  </View>
                                </View>
                                <View>
                                  <Text style={[styles.textFont]}>Programados</Text>
                                  <View style={{flexDirection:'row', alignItems:'center'}}>
                                    <Image style={{width:13, height:15 ,marginRight:5}} source={require('../assets/img/usuario.png')} />
                                    <Text style={{color:'#05173B'}}>{item.cantidad_personal}</Text>
                                  </View>
                                </View>
                            </View>
                          </View>
                         )
                        }
                        }
                      />
                    </View>
                    :
                    <View>
                      <Text style={{textAlign:'center', marginVertical:20, textTransform:'uppercase', color:'#03256C', fontFamily:'Montserrat-SemiBold'}}>No hay turnos actualmente</Text>
                    </View>
                 }
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
    cardTurno:
    {
      margin:20,
      backgroundColor:'white',
      borderRadius:10,
      padding:20,
    },
    textFont:{
        fontFamily:'Montserrat-Medium'
      },
});

export default TurnosList
