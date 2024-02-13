import React, { useEffect, useState } from 'react'
import { Text, View, SafeAreaView, StyleSheet, Pressable, Image, TextInput } from 'react-native'
import axios from 'axios';
//Navigation
import { useNavigation } from '@react-navigation/native';
import Header from '../Components/Header';
import { FlatList } from 'react-native-gesture-handler';
import { Checkbox } from 'react-native-paper';

const ListaAsistencia = (props) => 
{
    const [datosSesion, setDatosSesion] = useState({});
    const [turno, setTurno] = useState({});
    const [busqueda, setBusqueda] = useState('');
    const [lista, setLista]=useState('');

    useEffect(()=>
    {
       setDatosSesion(props.route.params.data);
       setTurno(props.route.params.turno);

       consultarLista(props.route.params.turno.id)

    },[]);

    const returnToTurnos = () => 
    {
      
    }


   const [maniobristas, setManiobristas] = useState([]);
   let fecha = new Date();
   let year = fecha.getFullYear();
   let month = fecha.getMonth()+1;
   let day = fecha.getDate();

   ///console.log(day);

   if(day < 10)
   {
     day = '0'+day;
   }

   if(month < 10)
   {
     month = '0'+month;
   }

   let fechaTo = year+'-'+month+'-'+day;
   const consultarLista = (turno) => 
    {


       axios.get('https://asistencia-maniobras-4mklxuo4da-uc.a.run.app/api/getListaAsitencia',{
        params:{
            turno:turno,
            fecha:fechaTo
        }
       }).then(response => 
        {
            //console.log(response.data)
            setManiobristas(response.data);
        })
        .catch(err => 
        {
            console.log(err);
        });
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
            <View style={{flexDirection:'row', justifyContent:'space-between', marginHorizontal:0}}>
                <Pressable onPress={()=>{returnToTurnos()}} style={{padding:15}}>
                    <Image style={{transform: [{rotate: '180deg'}]}}  source={require('../assets/img/flecha.png')} />
                 </Pressable>
                <View style={{padding:20}}>
                   <TextInput onChangeText={(newText => {setBusqueda(newText)})}  placeholder='Buscar' placeholderTextColor='#989FB5' style={{backgroundColor:'#E3E5EE', paddingVertical:0, width:120, borderRadius:15, paddingHorizontal:10}} />
                </View>
             </View>
             <View style={{paddingHorizontal:20, paddingVertical:0}}>
               <Text style={{color:'#03256C', fontFamily:'Montserrat-SemiBold', fontSize:22}}>Asistencia</Text>
               <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                  <Text style={{color:'#1768AC',fontFamily:'Montserrat-Medium', fontSize:21}}>{fechaTo}</Text>
                  <Pressable style={{backgroundColor:'#2CBEE1', flexDirection:'row', paddingHorizontal:20, borderRadius:30, paddingVertical:6, alignItems:'center'}}>
                      <Image style={{width:15, height:15}} source={require('../assets/img/escaner.png')} /> 
                      <Text style={{color:'white',fontFamily:'Montserrat-Medium', fontSize:15, marginLeft:10}}>Escanear</Text>
                  </Pressable>
               </View>
             </View>
             <View style={{paddingTop:15, height:300}}>
               {
                  maniobristas.length > 0 ?
                  <View>
                    <FlatList 
                     scrollEnabled
                     data={maniobristas}
                     keyExtractor={(item) => item.id }
                     renderItem={({item}) => 
                      {
                       return (
                        <View style={{flexDirection:'row', justifyContent:'space-between', marginHorizontal:20, marginVertical:5}}>
                            <Checkbox
                             status={'checked'}
                             onPress={() => {
                               setChecked(!checked);
                             }}
                             />
                           <View style={{backgroundColor:'white', flexDirection:'row', alignItems:'center', width:300, justifyContent:'space-between', paddingHorizontal:17, paddingVertical:17, borderRadius:15 }}>
                             <Text style={{color:'#05173B', fontFamily:'Montserrat-Medium', fontSize:15, textTransform:'capitalize'}}>
                               {item.name + ' '+ item.apellido_paterno}
                             </Text>
                             <Pressable style={{backgroundColor:'#1768AC', paddingHorizontal:10, paddingVertical:5, borderRadius:15}}>
                                <Image style={{width:25, height:16}} source={require('../assets/img/ojo.png')} />
                             </Pressable>
                           </View>
                        </View>
                       )
                      }
                      }
                     />
                  </View>
                  :
                  <View>
                    <Text style={{textAlign:'center', marginVertical:20, textTransform:'uppercase', color:'#03256C', fontFamily:'Montserrat-SemiBold'}}>No hay maniobristas actualmente</Text>
                  </View>
               }
             </View>
             <View>
                
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
    }
)

export default ListaAsistencia