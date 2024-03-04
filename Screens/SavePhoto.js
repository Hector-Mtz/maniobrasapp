import React, { useEffect, useState } from 'react'
import { Image, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import {  ActivityIndicator } from 'react-native-paper';
//
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
//
import Header from '../Components/Header';
import axios from 'axios';
import { TouchableOpacity } from 'react-native-gesture-handler';
//Navigation
import { useNavigation } from '@react-navigation/native';

export default function SavePhoto(props) 
{
    const navigate = useNavigation();
    useEffect(()=>
    {
     
    },[]);

    
    const [maniobrista, setManiobrista] = useState(null);
    const [activityIndicator, setActivityIndicator] = useState(false)
    const consultarManiobrista = async (escaneo) => 
    {
      //console.log(escaneo.data)
      setActivityIndicator(true);
      await axios.get('https://asistencia-maniobras-4mklxuo4da-uc.a.run.app/api/buscarManiobrista',{params:{
        codigo:escaneo.data
      }})
      .then(response => 
       {
          //console.log(response.data)
          if(response.data !== '')
          {
            setManiobrista(response.data)
          }
          else
          {

          }
          setActivityIndicator(false);
       })
       .catch(err => 
       {
         setActivityIndicator(false);
       })

    }

    const [photo, setPhoto] = useState(null);
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
                let newPhoto = response.assets?.[0];
                setPhoto(newPhoto);
              }
            });
    }

    const [showActivityIndicator, setShowActivityIndicator] = useState(false);
    const enviarPhoto = async () =>
    {
       setShowActivityIndicator(true);
        if(photo !== null)
        {
           let formData = new FormData();
           let localUri = photo.uri;
           let filename = localUri.split('/').pop();
           let match = /\.(\w+)$/.exec(filename);
           let type = match ? `image/${match[1]}` : `image`;
           let foto = {uri: localUri, name: filename, type}
           let newObjFoto = {foto:foto}
           //console.log(newObjFoto)
           formData.append('foto', foto)
           formData.append('maniobrista', maniobrista.id);

           await axios.post('https://asistencia-maniobras-4mklxuo4da-uc.a.run.app/api/savePhoto',
           formData , {headers: { 'Content-Type': 'multipart/form-data' }}
           )
           .then(response => 
            {
                console.log(response.data);
                setShowActivityIndicator(false);
                goBack();
            })
            .catch(err=>
            {
              console.log(err);
            })
        }
        else
        {
          setShowActivityIndicator(false);
        }
    }

    const goBack = () => 
    {
        navigate.goBack();
    }
  return (
    <SafeAreaView style={{flex:1}}>
      <View style={styles.container}>
        <Header />
        <View style={styles.container1}>
        </View>
        <View style={{backgroundColor: '#F4F5F9',  flex:5, borderTopStartRadius:36,borderTopEndRadius:36, marginTop:-30}}>
        <View>
          <Pressable onPress={()=>{goBack()}} style={{padding:15}}>
              <Image style={{transform: [{rotate: '180deg'}]}}  source={require('../assets/img/flecha.png')} />
           </Pressable>  
        </View>
        <View style={{marginVertical:20
        }}>
             <QRCodeScanner
                      onRead={(e)  =>
                      {
                           consultarManiobrista(e)
                      }}
                      reactivate={true}
                      reactivateTimeout={5000}
                      showMarker={true}
                      fadeIn={true}
                      cameraContainerStyle={{width:100, height:20,}}
                      containerStyle={{width:100, height:20}}
                      markerStyle={{width:100, height:132, borderColor:'#2CBEE1'}}
                      flashMode={RNCamera.Constants.FlashMode.off}
                      cameraStyle={{width:100, height:100, position:'relative', marginHorizontal:130, marginVertical:10}}
                    />
             <View style={{flexDirection:'row', justifyContent:'center'}}>
                {
                    activityIndicator ?
                     <ActivityIndicator  style={{marginTop:200, position:'absolute'}} animating={true} color='#1768AC' size='large' />
                    : null   
                }
             </View>
             <View style={{marginVertical:150, marginHorizontal:15}}> 
               {
                 maniobrista !== null ?
                 <View>
                   <View style={{flexDirection:'row', justifyContent:'space-around'}}>
                     <View>
                       <Text style={{fontFamily:'Montserrat-SemiBold', fontSize:15,color:'#989FB5'}}>Nombre</Text>
                       <Text style={{color:'#05173B', fontFamily:'Montserrat-Medium'}}>{maniobrista.name}</Text>
                     </View>
                     <View>
                        <View>
                           <Text style={{fontFamily:'Montserrat-SemiBold',fontSize:15,color:'#989FB5'}}>Apellido paterno</Text>
                           <Text style={{color:'#05173B',fontFamily:'Montserrat-Medium'}}>{maniobrista.apellido_paterno}</Text>
                        </View>
                        <View>
                           <Text style={{fontFamily:'Montserrat-SemiBold',fontSize:15,color:'#989FB5'}}>Apellido materno</Text>
                           <Text style={{color:'#05173B',fontFamily:'Montserrat-Medium'}}>{maniobrista.apellido_materno}</Text>
                        </View>
                     </View>
                   </View>
                   <View style={{marginTop:25, flexDirection:'row', justifyContent:'space-around', alignItems:'center'}}>
                    <View>
                        {
                            photo !== null ?
                            <View >
                                <View style={{flexDirection:'row', justifyContent:'center'}}>
                                  <Image style={{width:100, height:120}} source={{ uri: photo.uri }}/>
                                </View>
                            </View>
                            :null
                        }
                      </View>
                      <View>
                         <View style={{flexDirection:'row', justifyContent:'center', marginTop:5}}>
                               <TouchableOpacity  onPress={()=> 
                               {
                                   takePhoto()
                               }} style={{backgroundColor:'#2CBEE1', borderRadius:100, padding:15,}}>
                                 <Image style={{width:50, height:40}} source={require('../assets/img/icono-foto.png')} />
                               </TouchableOpacity>
                          </View>
                      </View>
                    </View>
                 </View>
                 :
                 <View>
                    <Text  style={{textAlign:'center', marginVertical:40, textTransform:'uppercase', color:'#03256C', fontFamily:'Montserrat-SemiBold'}}>No se ha recuperado ninguna información</Text>
                 </View>
               }
             </View>
             <View style={{marginTop:-100}}>
              <View>
                {
                  photo !== null ?
                  <View style={{flexDirection:'row', marginTop:0, justifyContent:'center'}}>
                    <TouchableOpacity onPress={()=>{setPhoto(null)}} style={{borderColor:'#1768AC',borderWidth:2, paddingHorizontal:30, paddingVertical:10, borderRadius:30, marginHorizontal:30}}>
                        <Text style={{fontFamily:'Montserrat-SemiBold', fontSize:20, color:'#1768AC'}}>Borrar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{enviarPhoto()}} style={{backgroundColor:'#1768AC',paddingHorizontal:20, paddingVertical:10, borderRadius:30,marginHorizontal:30}}>
                        <Text style={{fontFamily:'Montserrat-SemiBold', fontSize:20, color:'white'}}>Guardar</Text>
                    </TouchableOpacity>
                  </View>
                  : null
                }
              </View>
               <View style={{marginTop:25}}>
                  {
                    showActivityIndicator ?
                    <ActivityIndicator  size="large" color="#1768AC" />
                    : null
                  }
               </View>
             </View>
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