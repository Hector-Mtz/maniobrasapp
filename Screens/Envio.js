import React, { useEffect, useState } from 'react'
import { Text, View, SafeAreaView, StyleSheet, Pressable, Image, TextInput, Modal, TouchableOpacity, Alert } from 'react-native'
import axios from 'axios';
//Navigation
import { useNavigation } from '@react-navigation/native';
import Header from '../Components/Header';

import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { FlatList } from 'react-native-gesture-handler';

export default function Envio(props) 
{
   const navigate = useNavigation();
   const [datosSesion, setDatosSesion] = useState({});

   useEffect(()=>
   {
      setDatosSesion(props.route.params.data);
   },[]);

   const [openModalCam, setOpenModalCam] = useState(false);
   const openModalCamFunction = () => 
   {
      setOpenModalCam(true);
   }

   const [photos, setPhotos] = useState([]);
   const [selectPhoto, setSelectPhoto ] = useState(null);
   const [contador, setContador] = useState(1);

   useEffect(()=> 
   {
     if(selectPhoto !== null)
     {
       setPhotos([
         ...photos, selectPhoto
       ])
     }
   },[selectPhoto])

   const takePhoto = () => 
   {
      const options = 
      {
         mediaType: 'photo',
         includeBase64: false,
         maxHeight: 2000,
         maxWidth: 2000,
       };

       launchCamera(options, response => 
       {
         if (response.didCancel) 
         {
           console.log('User cancelled camera');
         } else if (response.error) 
         {
           console.log('Camera Error: ', response.error);
         } else 
         {
           let imageUri = response.uri || response.assets?.[0]?.uri;
           setContador(contador + 1);
           let newPhoto = response.assets?.[0];
           newPhoto.id = contador;
           setSelectPhoto(newPhoto);
           //console.log(response);
         }
       });
   }

   const borrarFoto = (id) => 
   {
     setPhotos(photos.filter(photo => photo.id !== id ));
   }

   const returnToListaAsistencia = () => 
   {
      //console.log(props.route.params)
      navigate.navigate('ListaAsistencia',{data:datosSesion, turno:props.route.params.turno, maniobra:props.route.params.maniobra});
   }

   const enviarPhotosListas = async () => 
   {
      if(photos.length !== 0)
      {
         let formData = new FormData();
         let arratTemporal = [];

         for (let index = 0; index < photos.length; index++) 
         {
           const fotoActual = photos[index];
           let localUri = fotoActual.uri;
           //setPhotoShow(localUri);
           let filename = localUri.split('/').pop();
           let match = /\.(\w+)$/.exec(filename);
           let type = match ? `image/${match[1]}` : `image`;
           let foto = {uri: localUri, name: filename, type}
           let newObjFoto = {foto:foto}
           arratTemporal.push(newObjFoto)
          }

         
          for (let index = 0; index < arratTemporal.length; index++) 
          {
            const foto = arratTemporal[index];
            let localUri = foto.foto.uri;
            let filename = localUri.split('/').pop();
            let match = /\.(\w+)$/.exec(filename);
            let type = match ? `image/${match[1]}` : `image`;
            let newFoto = { uri: localUri, name: filename, type };
            formData.append('fotos[]', newFoto);
            //newArrayObjcs.push(newFoto);
          }

          formData.append('lista',props.route.params.lista)

          console.log(formData)
          //console.log(arratTemporal);

         await axios.post('https://asistencia-maniobras-4mklxuo4da-uc.a.run.app/api/saveFotosLista',
          formData , {headers: { 'Content-Type': 'multipart/form-data' }}
           ).then(response => 
           {
             console.log(response.data)
             navigate.navigate('OkGuardaro',{data:datosSesion,maniobra:props.route.params.maniobra})
           })
          .catch(err => 
           {
              console.log(err.response.data)
              Alert.alert('ERROR', 'Ocurrio un error por parte de la conexion o el servidor' , [{
               text:'OK'
             }])
           })

      }
      else
      {
         Alert.alert('ERROR', 'No hay fotos para enviar.' , 
          [{
            text:'OK'
          }])
      }
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
                 <Pressable onPress={()=>{returnToListaAsistencia()}}  style={{padding:15}}>
                    <Image style={{transform: [{rotate: '180deg'}]}}  source={require('../assets/img/flecha.png')} />
                 </Pressable> 
              </View>
              <View style={{flexDirection:'row', justifyContent:'space-between', marginHorizontal:20, padding:0}}>
                 <Text style={{color:'#03256C', fontFamily:'Montserrat-SemiBold', fontSize:22}}>Enviar</Text>
              </View>
              <View style={{flexDirection:'col', marginHorizontal:50,}}>
               <View style={{flexDirection:'col', justifyContent:'center'}}>
                <View style={{flexDirection:'row', justifyContent:'center'}}>
                 <Pressable onPress={()=>{takePhoto()}} style={{backgroundColor:'#2CBEE1', borderRadius:100, padding:60,}}>
                    <Image style={{width:100, height:80}} source={require('../assets/img/icono-foto.png')} />
                  </Pressable>
                </View>
                 <View style={{marginTop:50}}>
                {
                  photos.length > 0 ?
                  <View>
                     <FlatList 
                     horizontal={true}
                     scrollEnabled
                     data={photos}
                     keyExtractor={(item) => item.id }
                     renderItem={({item}) => 
                         {
                            return (
                              <View style={{marginHorizontal:5}}>
                                  <TouchableOpacity onPress={()=>{borrarFoto(item.id)}}
                                  style={{ 
                                  borderRadius:100, padding:8, position:'absolute',
                                  zIndex:2
                                  }}>
                                     <Image style={{width:15, height:18}} source={require('../assets/img/equis.png')} />
                                  </TouchableOpacity>
                                  <Image style={{width:100, height:100}} source={{ uri: item.uri }}/>
                             </View>
                            )
                         }
                      }
                     />
                  </View>
                  :
                  <View>
                    <Text style={{textAlign:'center', color:'#05173B', fontSize:18, fontFamily:'Montserrat-Medium', marginVertical:15}}>Agregue una o varias fotos de la lista de asistencia</Text>
                    <Text  style={{textAlign:'center', color:'#989FB5', fontSize:13, fontFamily:'Montserrat-Medium', marginVertical:0}}>Por favor asegurese de que se vean los datos claramente.</Text>
                  </View>
                }
                <View style={{ flexDirection:'row', justifyContent:'space-around', marginVertical:50}}>
                   <TouchableOpacity onPress={()=>{setPhotos([]); setSelectPhoto(null)}} style={{borderColor:'#1768AC',borderWidth:2, paddingHorizontal:15, paddingVertical:10, borderRadius:30}}>
                     <Text style={{fontFamily:'Montserrat-SemiBold', fontSize:20, color:'#1768AC'}}>Borrar todo</Text>
                   </TouchableOpacity>
                   <TouchableOpacity onPress={()=>{enviarPhotosListas()}} style={{backgroundColor:'#1768AC',paddingHorizontal:40, paddingVertical:10, borderRadius:30}}>
                     <Text style={{fontFamily:'Montserrat-SemiBold', fontSize:20, color:'white'}}>Enviar</Text>
                   </TouchableOpacity>
                </View>
             </View>
               </View>
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
