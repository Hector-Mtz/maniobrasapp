import React, { useEffect, useState } from 'react'
import { Text, View, SafeAreaView, StyleSheet, Pressable, Image, TextInput, Modal, TouchableOpacity, Alert } from 'react-native'
import axios from 'axios';
//Navigation
import { useNavigation } from '@react-navigation/native';
import Header from '../Components/Header';
import { FlatList } from 'react-native-gesture-handler';
import {  ActivityIndicator } from 'react-native-paper';
import PDFView from '../Components/PDFView';
//
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
//
import AsyncStorage from '@react-native-async-storage/async-storage';
//
import CheckBox from 'react-native-check-box'

const ListaAsistencia = (props) => 
{
    const navigate = useNavigation();
    const [datosSesion, setDatosSesion] = useState({});
    const [turno, setTurno] = useState(props.route.params.turno);
    const [busqueda, setBusqueda] = useState('');
    const [maniobristas, setManiobristas] = useState([]);
    const[ejecutar, setEjecutar] = useState(false);

    //Huellas biometricas

    useEffect(()=> 
    {
      //console.log(props.route.params.turno)
      setDatosSesion(props.route.params.data);
      setTurno(props.route.params.turno);
      //console.log(turno);
      consultarLista(turno);
    },[busqueda])
    
    const returnToTurnos = () => 
    {
       setEjecutar(false)
       navigate.navigate('TurnosList',{data:datosSesion, maniobra:props.route.params.maniobra});
    }

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
   const [lista, setLista] = useState(null)
   const [activityIndicator, setActivityIndicator] = useState(false)
   const consultarLista = async (turno) => 
    {
      setActivityIndicator(true);
       await axios.get('https://asistencia-maniobras-4mklxuo4da-uc.a.run.app/api/getListaAsitencia',{
        params:{
            turno:turno,
            fecha:fechaTo,
            busqueda:busqueda
        }
       }).then(response => 
        {
            //console.log(response.data)
            if(response.data.lista !== undefined)
            {
              let arrayTemp = [];
              for (let index = 0; index < response.data.lista.length; index++) 
              {
                const maniobristaTemp = response.data.lista[index];
                maniobristaTemp.bg = 'white';
                maniobristaTemp.color = '#05173B'
                arrayTemp.push(maniobristaTemp);
              }
              setManiobristas(arrayTemp);
            }
            else
            {
              setManiobristas([]);
            }
            setLista(response.data.lista_id)

            setActivityIndicator(false);
        })
        .catch(err => 
        {
            console.log(err.response);
            setActivityIndicator(false);

        });
    }

    const [viewModalInfo, setViewModalInfo] = useState(false);

    const [maniobristaActual, setManiobristaActual] = useState({});
    const verInfo = (maniobrista) => 
    {
      //console.log(maniobrista)
      setManiobristaActual(maniobrista);
      setViewModalInfo(true);
    }

    const [viewDocumento, setViewDocumento] = useState(false);
    const [documentoSelected, setDocumentoSelected] = useState('');
    const [maniobristaBuscado, setManiobristaBuscado] = useState(null);
    const viewDoc = (doc) =>
    {
      setViewDocumento(true);
      //console.log(doc);
      setDocumentoSelected(doc)
      //console.log(documentoSelected);
    }
    const onSuccess = async (response) => 
    {
      if(maniobristas.length > 0)
      {
        //console.log(response.data)
        let maniobristaABuscar = maniobristas.filter((maniobrista) => maniobrista.value == response.data);
        setManiobristaBuscado(maniobristaABuscar[0]);
        if(maniobristaABuscar.length > 0)
        {
           //console.log(maniobristaABuscar)
           //recorremos todos para setearle los valores
           for (let index = 0; index < maniobristas.length; index++) 
           {
               const maniobristaTemp = maniobristas[index];
               maniobristaTemp.bg = 'white';
               maniobristaTemp.color = '#05173B';
           }
           //seteamos la fecha en el momento que coincidio
           let hours = fecha.getHours();
           let minutes = fecha.getMinutes();
           let seconds = fecha.getSeconds();
           
           if(hours < 10)
           {
             hours = '0'+hours;
           }
           
           if(minutes < 10)
           {
             minutes = '0'+minutes;
           }
           
           if(seconds < 10)
           {
              seconds = '0'+seconds;
           }
           
           let horaMovil = hours+':'+minutes+':'+seconds;
            //hay auq actualizar en la bd seteandolo la hr del telefono y la del servidor
            try 
            {
               await axios.post('https://asistencia-maniobras-4mklxuo4da-uc.a.run.app/api/actualizarAsistencia',{
                params:{
                  hora:horaMovil,
                  maniobrista: maniobristaABuscar[0]
                }
               })
               .then(response=> 
                {
                   console.log(response.data)
                   maniobristaABuscar[0].asistencia = true;
                   maniobristaABuscar[0].bg = '#2CBEE1';
                   maniobristaABuscar[0].color = 'white'
        
                   let newData = maniobristas.sort(function(x,y){ return x == maniobristaABuscar[0] ? -1 : y ==  maniobristaABuscar[0] ? 1 : 0; });
                   setManiobristas(newData)
                })
                .catch(err => 
                {
                  
                })
            } 
            catch (error) 
            {
              
            }
        }    
        else
        {
          //console.log('no coincide el codigo')
          Alert.alert('Alerta', 'El código no coincide con ningun registro' , [{
            text:'OK'
          }])
          
        }
      }
      else
      {
        console.log('err')
      }

      let newManiobristas = maniobristas;
      setManiobristas([]);

      setTimeout(function(){ actualizar(newManiobristas)}, 2);
    }

    //React.useCallback(debounce(onSuccess,1000),[])

    const actualizar = (array) => 
    {
      setManiobristas(array);
    }

    const enviar =  () =>
    {
      if(maniobristas.length !== 0)
      {
        navigate.navigate('Envio',{data:datosSesion, turno:props.route.params.turno, maniobra:props.route.params.maniobra, lista:lista })
        setEjecutar(false)
      }
      else
      {
        Alert.alert('Alerta', 'No hay reporte a enviar.' , [{
          text:'OK'
        }])
      }
    }

    const guardarListaActual = () => 
    {
      //console.log('guardar')
       
       console.log(turno)
       //console.log(busqueda)
    }

  return (
    <SafeAreaView style={{flex:1}}>
        <View style={styles.container}>
           <Header />
           <View style={styles.container1}>
             <Text style={{color:'white', fontSize:24, fontFamily:'Montserrat-Light'}} >¡Bienvenido de nuevo</Text>
             {
              datosSesion !== {} ?
              <View>
                 <Text style={{color:'white', fontFamily:'Montserrat-SemiBold', fontSize:26}}>{datosSesion.name} !</Text>
              </View>
              : null
             }
           </View>
           <View style={{backgroundColor: '#F4F5F9',  flex:5, borderTopStartRadius:36,borderTopEndRadius:36, marginTop:-30}}>
            <View style={{flexDirection:'row', justifyContent:'space-between', marginHorizontal:0, padding:10}}>
              <View style={{flexDirection:'row'}}>
                 <Pressable onPress={()=>{returnToTurnos()}} style={{padding:15}}>
                    <Image style={{transform: [{rotate: '180deg'}]}}  source={require('../assets/img/flecha.png')} />
                 </Pressable>  
                 <View>
                   <Text style={{color:'#03256C', fontFamily:'Montserrat-SemiBold', fontSize:22}}>Asistencia</Text>
                   <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                      <Text style={{color:'#1768AC',fontFamily:'Montserrat-Medium', fontSize:21}}>{fechaTo}</Text>
                   </View>
                 </View>
              </View>
                <View style={{padding:20}}>
                   <TextInput onChangeText={(newText => {setBusqueda(newText)})}  placeholder='Buscar' placeholderTextColor='#989FB5' style={{backgroundColor:'#E3E5EE', paddingVertical:0, width:120, borderRadius:15, paddingHorizontal:10, fontFamily:'Montserrat-Medium'}} />
                   <Image style={{position:'absolute', zIndex:10, marginHorizontal:115, marginVertical:27, width:15, height:15}} source={require('../assets/img/buscar.png')} />
                </View>
             </View>
             <View style={{flexDirection:'row', justifyContent:'center'}}>
                <QRCodeScanner
                      onRead={(e)  =>
                      {
                           onSuccess(e)
                      }}
                      reactivate={true}
                      reactivateTimeout={5000}
                      showMarker={true}
                      fadeIn={true}
                      cameraContainerStyle={{width:100, height:20,}}
                      containerStyle={{width:100, height:20}}
                      markerStyle={{width:100, height:132, borderColor:'#2CBEE1'}}
                      flashMode={RNCamera.Constants.FlashMode.off}
                      cameraStyle={{width:100, height:100, position:'relative', marginHorizontal:60, marginVertical:10}}
                    />
                <View style={{marginHorizontal:60, marginTop:-15}}>
                  {
                    maniobristaBuscado !== null ?
                    <View>
                      <Image style={{width:100, height:132, marginVertical:10}} source={{ uri: maniobristaBuscado.foto }} />
                    </View>
                    :
                    <View style={{marginVertical:20}}>
                      <Image style={{width:80, height:90}} source={require('../assets/img/perfil_gris.png')} />
                    </View>
                  }
                </View>
             </View>
             <View style={{flexDirection:'row', justifyContent:'center'}} >
              {
                activityIndicator ?
                 <ActivityIndicator style={{marginTop:200, position:'absolute'}} animating={true} color='#1768AC' size='large' />
                 : null
              }
             </View>
             <View style={{paddingTop:15, height:250, marginBottom:10, marginTop:10,marginHorizontal:0, paddingHorizontal:20}}>
               {
                  maniobristas.length > 0 ?
                  <View>
                    {
                      !activityIndicator ?
                      <View>
                         <FlatList 
                          scrollEnabled
                          data={maniobristas}
                          keyExtractor={(item) => item.id }
                          renderItem={({item}) => 
                           {
                            return (
                             <View style={{flexDirection:'row', justifyContent:'space-between', marginHorizontal:2, marginVertical:5, alignItems:'center'}}>
                                 <CheckBox
                                  isChecked={item.asistencia ? true : false}
                                  onClick={()=>
                                  {
                                     console.log('hola');
                                  }}
                                  checkBoxColor='#1768AC'
                                  />
                                <View style={{backgroundColor:item.bg , flexDirection:'row', alignItems:'center', width:270, justifyContent:'space-between', paddingHorizontal:17, paddingVertical:17, borderRadius:15 }}>
                                  <Text style={{color:item.color, fontFamily:'Montserrat-Medium', fontSize:15, textTransform:'capitalize'}}>
                                    {item.name + ' '+ item.apellido_paterno}
                                  </Text>
                                  <Pressable onPress={()=>{verInfo(item)}} style={{backgroundColor:'#1768AC', paddingHorizontal:10, paddingVertical:5, borderRadius:15}}>
                                     <Image style={{width:25, height:16}} source={require('../assets/img/ojo.png')} />
                                  </Pressable>
                                </View>
                             </View>
                            )
                           }
                           }
                          />
                          <View style={{flexDirection:'row', justifyContent:'center'}}>
                             <Modal animationType="fade" transparent visible={viewModalInfo}>
                               <View style={{backgroundColor:'white', height:530, width:345, marginVertical:'30%',marginHorizontal:'5%', paddingHorizontal:'8%', paddingVertical:'5%' ,borderRadius:30, shadowColor: "#000",
                                           shadowOffset: {
                                           	width: 0,
                                           	height: 2,
                                           },
                                           shadowOpacity: 0.25,
                                           shadowRadius: 3.84,
                                           elevation: 5,
                                          }}>
                                  <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                     <Text style={{fontFamily:'Montserrat-SemiBold', color:'#03256C', fontSize:20}}>Información</Text>
                                     <View>
                                       <Pressable onPress={()=>{setViewModalInfo(false)}} style={{backgroundColor:'#F4F5F9', padding:10, borderRadius:80}}>
                                         <Image style={{width:10, height:10}} source={require('../assets/img/equis.png')} />
                                       </Pressable>
                                     </View>
                                  </View>
                                  <View>
                                     <View style={{flexDirection:'row', justifyContent:'space-around',marginVertical:10}}>
                                         <View>
                                           <Text style={{color:'#989FB5', fontFamily:'Montserrat-Medium', fontSize:13}}>Nombre</Text>
                                           <TextInput style={{textTransform:'capitalize', backgroundColor:'#F4F5F9', borderRadius:15, color:'#05173B', width:130,fontFamily:'Montserrat-Medium',width:280}} editable={false} value={maniobristaActual.name} />
                                         </View>
                                     </View>
                                     <View style={{flexDirection:'row', justifyContent:'space-around', marginVertical:10}}>
                                         <View>
                                           <Text style={{color:'#989FB5', fontFamily:'Montserrat-Medium', fontSize:13}}>Apellido paterno</Text>
                                           <TextInput style={{textTransform:'capitalize', backgroundColor:'#F4F5F9', borderRadius:15,color:'#05173B', width:130,fontFamily:'Montserrat-Medium'}} value={maniobristaActual.apellido_paterno} editable={false} />
                                         </View>
                                         <View>
                                           <Text style={{color:'#989FB5', fontFamily:'Montserrat-Medium', fontSize:13}}>Apellido materno</Text>
                                           <TextInput style={{textTransform:'capitalize', backgroundColor:'#F4F5F9',borderRadius:15,color:'#05173B', width:130,fontFamily:'Montserrat-Medium'}} editable={false} value={maniobristaActual.apellido_materno} />
                                         </View>
                                     </View>
                                     <View style={{flexDirection:'row', marginVertical:10}}>
                                       <View style={{flexDirection:'row', alignItems:'center'}}>
                                          <View>
                                            <Text style={{color:'#989FB5', fontFamily:'Montserrat-Medium', fontSize:13}}>NSS</Text>
                                            <View style={{backgroundColor:'#F4F5F9',width:210,borderRadius:15,paddingVertical:15, paddingHorizontal:10, flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                                             <Text style={{textTransform:'uppercase',color:'#05173B',fontFamily:'Montserrat-Medium'}}>{maniobristaActual.nss} </Text>
                                             <Pressable onPress={()=>{viewDoc(maniobristaActual.docNss)}} style={{backgroundColor:'#1768AC', paddingHorizontal:10, paddingVertical:5, borderRadius:15}}>
                                                <Image style={{width:25, height:16}} source={require('../assets/img/ojo.png')} />
                                             </Pressable>
                                           </View>
                                          </View>
                                           <View>
                                             <Pressable onPress={()=>{viewDoc(maniobristaActual.alta_imss)}} style={{backgroundColor:'#1768AC', paddingHorizontal:10, paddingVertical:5, borderRadius:15, marginHorizontal:10, marginTop:17}}>
                                                <Image style={{width:39, height:39}} source={require('../assets/img/IMSS-Logo_aguila.png')} />
                                             </Pressable>
                                           </View>
                                       </View>
                                     </View>
                                     <View style={{flexDirection:'row', justifyContent:'space-around', marginVertical:10}}>
                                       <View>
                                           <Text style={{color:'#989FB5', fontFamily:'Montserrat-Medium', fontSize:13}}>RFC</Text>
                                           <View style={{backgroundColor:'#F4F5F9',width:280,borderRadius:15,paddingVertical:15, paddingHorizontal:10, flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                                             <Text style={{textTransform:'uppercase',color:'#05173B',fontFamily:'Montserrat-Medium'}}>{maniobristaActual.rfc} </Text>
                                             <Pressable onPress={()=>{viewDoc(maniobristaActual.docRfc)}} style={{backgroundColor:'#1768AC', paddingHorizontal:10, paddingVertical:5, borderRadius:15}}>
                                                <Image style={{width:25, height:16}} source={require('../assets/img/ojo.png')} />
                                             </Pressable>
                                           </View>
                                       </View>
                                     </View>
                                     <View style={{flexDirection:'row', justifyContent:'space-around', marginVertical:10}}>
                                       <View>
                                           <Text style={{color:'#989FB5', fontFamily:'Montserrat-Medium', fontSize:13}}>CURP</Text>
                                           <View style={{backgroundColor:'#F4F5F9',width:280,borderRadius:15,paddingVertical:15, paddingHorizontal:10, flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                                             <Text style={{textTransform:'uppercase',color:'#05173B',fontFamily:'Montserrat-Medium'}}>{maniobristaActual.curp} </Text>
                                             <Pressable onPress={()=>{viewDoc(maniobristaActual.docCurp)}} style={{backgroundColor:'#1768AC', paddingHorizontal:10, paddingVertical:5, borderRadius:15}}>
                                                <Image style={{width:25, height:16}} source={require('../assets/img/ojo.png')} />
                                             </Pressable>
                                           </View>
                                       </View>
                                     </View>
                                  </View>
                               </View>
                             </Modal>
                          </View>
                          <View>
                            <Modal animationType="fade" visible={viewDocumento} >
                              <View style={{padding:20}}>
                                 <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                     <View>
                                       <Pressable onPress={()=>{setViewDocumento(false)}} style={{backgroundColor:'#F4F5F9', padding:10, borderRadius:80}}>
                                         <Image style={{width:10, height:10}} source={require('../assets/img/equis.png')} />
                                       </Pressable>
                                     </View>
                                  </View>
                                  <View >
                                     <PDFView documento={documentoSelected} />
                                  </View>
                              </View>
                            </Modal>
                          </View>
                      </View>
                      : null
                    }
                  </View>
                  :
                  <View>
                    {
                      !activityIndicator ?
                      <View>
                          <Text style={{textAlign:'center', marginVertical:40, textTransform:'uppercase', color:'#03256C', fontFamily:'Montserrat-SemiBold'}}>No hay maniobristas actualmente</Text>
                      </View>
                      : null
                    }
                  </View>
               }
             </View>
             <View style={{flexDirection:'row', justifyContent:'center', marginTop:20 }}>
              {/*
                <Pressable onPress={()=>{guardarListaActual()}} style={{flexDirection:'row', alignItems:'center', borderColor:'#1768AC', borderWidth:2, paddingHorizontal:15, paddingVertical:5, borderRadius:20}}>
                   <Image style={{width:18, height:18, marginRight:10}} source={require('../assets/img/guardar.png')} />
                   <Text style={{fontFamily:'Montserrat-Medium', color:'#1768AC', fontSize:17}}>Guardar</Text>
                </Pressable>
                */
              }
                <Pressable onPress={()=>{enviar()}} style={{backgroundColor:'#1768AC',flexDirection:'row', alignItems:'center', paddingHorizontal:20, paddingVertical:5, borderRadius:20}}>
                   <Image style={{width:25, height:25, marginRight:10}} source={require('../assets/img/enviar.png')} />
                   <Text style={{fontFamily:'Montserrat-Medium', color:'white', fontSize:17}}>Enviar</Text>
                </Pressable>
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
            paddingTop:30,
            borderBottomRightRadius:0,
            zIndex:-1
        },
    }
)

export default ListaAsistencia