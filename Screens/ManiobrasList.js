import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { View,Text, StyleSheet,TextInput, Pressable, Image } from 'react-native';
import Header from '../Components/Header';
import axios from 'axios';
import { FlatList } from 'react-native-gesture-handler';
//Navigation
import { useNavigation } from '@react-navigation/native';

const ManiobrasList = (props) => 
{
  const navigate = useNavigation();
  //console.log(props.route.params.data[1])
  const [datosSesion, setDatosSesion] = useState({});
  useEffect(()=> 
  {
    setDatosSesion(props.route.params.data[1]);
    //consultarManiobras();
  },[])


  const [busqueda, setBusqueda] = useState('');
  const [maniobras, setManiobras] = useState([]);
  const consultarManiobras = (busqueda) => 
  {
     axios.get('https://asistencia-maniobras-4mklxuo4da-uc.a.run.app/api/getManiobrasApp',{
      params:{
        busqueda:busqueda
      }
     })
    .then(response => 
      {
         //console.log(response.data)
         setManiobras(response.data)
      })
    .catch(err => 
      {
        console.log(err)
      })
  }

  useEffect(()=>
  {
     consultarManiobras(busqueda)
  },[busqueda])

  const viewTurns = (maniobra) => 
  {
     //console.log(maniobras)
     navigate.navigate('TurnosList',{usuario:datosSesion, maniobra:maniobra });
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
             <View style={{flexDirection:'row', justifyContent:'flex-end', marginHorizontal:25}}>
                <View style={{padding:15}}>
                   <TextInput onChangeText={(newText => {setBusqueda(newText)})}  placeholder='Buscar' placeholderTextColor='#989FB5' style={{backgroundColor:'#E3E5EE', paddingVertical:0, width:120, borderRadius:15, paddingHorizontal:10}} />
                </View>
             </View>
             <View style={{paddingHorizontal:20, paddingVertical:0}}>
               <Text style={{color:'#03256C', fontFamily:'Montserrat-SemiBold', fontSize:22}}>Maniobras</Text>
             </View>
             <View>
                {
                  maniobras.length > 0 ?
                  <View>
                     <FlatList 
                     scrollEnabled
                     data={maniobras}
                     keyExtractor={(item) => item.id }
                     renderItem={({item}) => 
                      {
                       return (
                        <View style={styles.cardManiobra}>
                           <Text style={{color:'#05173B', fontFamily:'Montserrat-Medium', fontSize:18}}>{item.name}</Text>
                           <Pressable onPress={()=>{viewTurns(item)}}>
                             <Image source={require('../assets/img/flecha.png')} />
                           </Pressable>
                        </View>
                       )
                      }
                      }
                     />
                  </View>
                  :
                  <View>
                    <Text style={{textAlign:'center', marginVertical:20, textTransform:'uppercase', color:'#03256C', fontFamily:'Montserrat-SemiBold'}}>No hay maniobras actualmente</Text>
                  </View>
                }
             </View>
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
            flex:1,
            paddingHorizontal:15,
            paddingTop:15,
            borderBottomRightRadius:0,
            zIndex:-1
        },
        textFont:{
          fontFamily:'Montserrat-Medium'
        },
        cardManiobra:
        {
          margin:20,
          backgroundColor:'white',
          borderRadius:10,
          padding:20,
          flexDirection:'row',
          justifyContent:'space-between'
        }
    }
)

export default ManiobrasList
