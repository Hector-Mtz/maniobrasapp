import React from 'react';
import { StyleSheet, Dimensions, View, Text } from 'react-native';
import Pdf from 'react-native-pdf';

export default class PDFExample extends React.Component {
    render() {
        //console.log(this.props.documento)
        const myArray = this.props.documento.split(" ");
        let word = myArray[0].substring(2, myArray[0].length-2 );        
        const source = { uri: word, 
        cache: true };

        return (
            <View style={styles.container}>
                <Pdf
                
                    horizontal={false}
                    trustAllCerts={false}
                    source={source}
                    onLoadComplete={(numberOfPages,filePath) => {
                        //console.log(`Number of pages: ${numberOfPages}`);
                    }}
                    onPageChanged={(page,numberOfPages) => {
                        //console.log(`Current page: ${page}`);
                    }}
                    onError={(error) => {
                        //console.log(error);
                    }}
                    onPressLink={(uri) => {
                        //console.log(`Link pressed: ${uri}`);
                    }}
                    style={styles.pdf}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    pdf: 
    {
        width:'104%',
        height:'100%',
    }
});