import React, { useEffect } from 'react'
import { Image } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Logo from '../../../assets/logo.png'
import { setUserData } from '../../actions/userDataActions'
import { connect } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient'

const Splash = (props) => {
  const { style, dispatch, user } = props
  useEffect(() => {
    getData()
  }, [])

  useEffect(() => {
    setData()
  }, [])

  const setData = async () => {
    const res = await AsyncStorage.getItem('userData')
    const jsonValue = JSON.parse(res)
    if (jsonValue != null)
      await dispatch(setUserData(jsonValue))
  }

  const getData = async () => {
    const jsonValue = await AsyncStorage.getItem('userData')
    jsonValue != null ? setTimeout(() => { props.navigation.navigate('Main') }, 1500) : setTimeout(() => { props.navigation.navigate('BasicLogin') }, 1500)

    // console.log(JSON.stringify(res))
    // console.log(JSON.stringify(res.session_id))
    // res != null && res.user_type === 'Creator' && res.signup === 0 ? setTimeout(() => { props.navigation.navigate('AddPhone')}, 1500) :
    // jsonValue != null ? setTimeout(() => { props.navigation.navigate('Main') }, 1500) : setTimeout(() => { props.navigation.navigate('BasicLogin') }, 1500)
  }

  return (
    <LinearGradient colors={['#00A0DA', '#0080BA', '#005D96']} style={style.content}>
      <Image source={Logo} resizeMode="contain" style={style.image} />
    </LinearGradient>
  )
}
const mapStateToProps = (state) => ({
  user: state.user
})
export default connect(mapStateToProps)(Splash)
