import { View } from 'native-base';
import React from 'react';
import {
  Text,Image,Dimensions
} from 'react-native';


const Chartitem =(props)=>{ 
    if(props.loginid !==props.msguserid){
    return(
    <View style={{flexDirection:'row',alignSelf:'flex-start',marginLeft:2,marginTop:5,marginBottom:2,shadowOffset: {
        width: 0,
        height: 2,
      },
      borderRadius:10,
      shadowOpacity: 0.03,
    shadowRadius: 4.84,
    marginLeft:5,
    marginTop:5,
    backgroundColor:'#fff',
   elevation:8,}}>
        <View style={{width:'auto',borderRadius:10,flexDirection:'row'}}>
         <Image
    source={{ uri:  props.itemimage}}
    resizeMode="cover"
    style={{ width: 30, height:30,borderRadius: 15}}
    />
    <Text style={{color:'#000000',fontSize:12,marginLeft:5,padding:5,paddingRight:10}}>{props.title}</Text>
    </View>
    </View>
    );
    }else  if(props.loginid ===props.msguserid){
        return(
            <View style={{flexDirection:'row',alignSelf:'flex-end',marginRight:2,marginTop:5,marginBottom:2,shadowOffset: {
                width: 0,
                height: 2,
              },
              borderRadius:10,
              shadowOpacity: 0.03,
            shadowRadius: 4.84,
            marginLeft:5,
            marginTop:5,
            backgroundColor:'#fff',
           elevation:8,}}>
                <View style={{width:'auto',borderRadius:10,flexDirection:'row'}}>
                 <Image
            source={{ uri:  props.itemimage}}
            resizeMode="cover"
            style={{ width: 30, height:30,borderRadius: 15}}
            />
            <Text style={{color:'#000000',fontSize:12,marginLeft:5,padding:5,paddingRight:10}}>{props.title}</Text>
            </View>
            </View>
            );

    }
}

export default Chartitem;