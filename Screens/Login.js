import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react'
import { SafeAreaView, Text, View, StyleSheet, Alert, BackHandler, ImageBackground, Image} from 'react-native'
//Native Paper
import { TextInput, Button } from 'react-native-paper';
import axios from 'axios';
//Navigation
import { useNavigation } from '@react-navigation/native';

export default function Login() 
{
    const navigate = useNavigation();
    const [clicked, setClicked] = useState(false);
   //Obtenemos al estar en la pantalla los datos de storage
   const [usuario, setUsuario] = useState('');
   const [contraseña, setContraseña] = useState('');
   useEffect(()  => 
   {
     const obtenerDatos = async () => 
     {
        const emailStorage = await AsyncStorage.getItem('usuario');
        const contraseñaStorage = await AsyncStorage.getItem('contraseña');
  
        if(emailStorage !== '' && contraseñaStorage !== '')
        {
           setUsuario(emailStorage);
           setContraseña(contraseñaStorage);
        }
     }
     obtenerDatos();
   },[]);

   const Login = async () => 
   {
      setClicked(true);
      if(usuario !== '' && contraseña !== '')
      {
        await axios.post('https://asistencia-maniobras-4mklxuo4da-uc.a.run.app/api/sanctum/token',{
            email: usuario,
            password:contraseña,
            device_name:'movil'
        })
        .then(response => 
            {
                //console.log('accede')
               //console.log(response.data)
               saveInStorage(usuario, contraseña)
               navigate.navigate('ManiobrasList',{data:response.data});
               setClicked(false);
            })
            .catch(err => 
                {
                    Alert.alert('ERROR', 'Las credenciales son erroneas o no tiene acceso a internet' , [{
                        text:'OK'
                      }])
                      setClicked(false);
                })
      }
      else
      {
        Alert.alert('ERROR', 'Los campos son requeridos', 
        [
            {text:'Aceptar'}
        ]);
      }
   }

   const saveInStorage = async (usuario, contraseña) => 
   {
      try 
      {
       await  AsyncStorage.setItem('usuario', usuario);
       await AsyncStorage.setItem('contraseña',contraseña);
      } 
      catch (error) 
      {
        
      }
   }

  return (
    <View style={{backgroundColor:'#03256C', flex:1, paddingVertical:25}} >
      <View style={{flex:2, justifyContent:'center'}}>
         <Text style={[styles.text,{textAlign:'center', color:'#CBCED9', textTransform:'uppercase', fontSize:25}]}>
            PLATAFORMA
         </Text>
         <View>
            <Text style={{color:'white', textAlign:'center', fontSize:40, fontFamily:'Montserrat-Medium'}}>
               ASISTENCIA
            </Text>
            <Text style={{color:'white', textAlign:'center', fontSize:40, fontFamily:'Montserrat-Medium'}}>
               MANIOBRAS
            </Text>
         </View>
      </View>
      <ImageBackground source={require('../assets/img/onda.png')} style={{flex:7}} imageStyle={{height:700}}> 
         <View style={{justifyContent:'center'}}>
            <View style={{alignItems:'center'}}>
              <Image style={{marginTop:0, width:180, height:220, marginTop:15}} source={require('../assets/img/mono.png')} />
            </View>
            <View style={{marginHorizontal:30}}>
              <View style={styles.containerInput}>
                 <TextInput style={{backgroundColor:'#F4F5F9'}}  label="Usuario" value={usuario} keyboardType='email-address' onChangeText={(newText)=>{setUsuario(newText)}}   />
              </View>
              <View style={styles.containerInput}>
                 <TextInput style={{backgroundColor:'#F4F5F9'}} label="Contraseña" value={contraseña} onChangeText={(newText)=>{setContraseña(newText)}} secureTextEntry={true}  />
              </View>
              <Button mode="contained" onPress={()=>{Login()}} style={{backgroundColor:'#1768AC', marginHorizontal:40}}  loading={clicked}>
                 Iniciar sesión
              </Button>
              <View style={{alignItems:'center', marginVertical:15}}>
               <Image style={{width:100, height:30}} source={require('../assets/img/coorsa-gris.png')} />
              </View>
            </View>
         </View>
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
    containerInput:
    {
      marginVertical:12
    },
    text:{
      fontFamily:'Montserrat-Medium'
    }
});