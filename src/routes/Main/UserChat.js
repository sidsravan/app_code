import React, { useState, useEffect, useRef } from 'react'
import { Header, Right, Left, Body, Button, Title, View ,Footer, Item, Input } from 'native-base'
import { Modal, Platform, ScrollView,FlatList,Text ,Image,TouchableOpacity} from 'react-native'
import Ionicon from 'react-native-vector-icons/dist/Ionicons'
import styles from '../../styles/common'
import CommentForm from '../../components/Comments/CommentForm';
import Chartitem from "../../components/Chartitem";
import Listempty from "../../components/Listempty";
import CommentsList from '../../components/Comments/CommentsList'
import { MenuProvider } from 'react-native-popup-menu'
import {Loader} from '../../components/Loader'
import LinearGradient from 'react-native-linear-gradient'
import { httpService } from '../../utils'
import { env } from '../../env'



const UserChat = ({ isVisible, setIsVisible,username,loggedInUser,viewuserid }) => {
    const StatusBarStyle = Platform.OS === 'ios' ? 'dark-content' : 'dark-content'
    const [submit, setSubmit] = useState(false)
    const messagesEndRef = React.createRef()
    const scrollViewRef = useRef();
    const [loaded, setLoaded] = useState(false)
    const [chatlist,setchatlist]=useState(['']);


    const formData = new FormData()
    formData.append('user_id', loggedInUser.data.session_id);
    formData.append('to_user_id',viewuserid);

    const ac = new AbortController()
    const signal = ac.signal
    let isMount = true

    const [value, setValue] = useState('')
    const [height, setHeight] = useState(0)
    const [avatarSource, setAvatarSource] = useState('')
    const [disable, setDisable] = useState(true)

   const getchat=async()=>{

    setLoaded(true)
    console.log("formData: ", JSON.stringify(formData))
    await httpService('message/messages_list', 'POST', formData, { signal: signal })
        .then(res => res.json())
        .then(json => {
            if (isMount) {
                     console.log("userchat",json.data);
                     setchatlist(json.data);
                setLoaded(false)
            }
        })
        .catch(error => {
            console.log(error)
            alert(error)
            setLoaded(false)
        })

   }


    useEffect(() => {
       getchat();
        return () => {
            isMount = false
        }
    }, [])

    const scrollToBottom = () => {
        scrollViewRef.current.scrollToEnd({ animated: true })
    }


    const submitComment = async () => {
        setValue('');
        const formData = await new FormData()
       await formData.append('user_id', loggedInUser.data.session_id);
       await formData.append('to_user_id', viewuserid);
       await formData.append('msg',value);
       
        await httpService('message/send', 'POST', formData, { signal: signal })
        .then(res => res.json())
        .then(json => {
            if (isMount) {
                    //   console.log("sendmasg",json);
                    //  alert(json.data)
                    getchat();
                // setLoaded(false)
            }
        })
        .catch(error => {
            console.log("eerorsendmasg",error)
            alert(error)
            setLoaded(false)
        })


    }


    return (
        <>
        <Modal
            animationType="slide"
            // transparent={true}
            visible={isVisible}
            onRequestClose={() => {
                setIsVisible(false)
            }}>
                {loaded && <Loader />}
            <LinearGradient colors={['#009CD6', '#005A93']}>
            <Header noShadow style={{ backgroundColor: 'transparent' }} androidStatusBarColor="#fff" iosBarStyle={StatusBarStyle}>
                <Left style={{ flex: 0.5 }}>
                    <Button
                        transparent
                        onPress={() => setIsVisible(false)}>
                        <Ionicon name="arrow-back-outline" color="#fff" style={styles.fs25} />
                    </Button>
                </Left>
                <Body>
                    <Title style={{ fontWeight: 'bold', alignSelf: 'center', marginLeft: -40, color: '#fff' }}> {username}</Title>
                </Body>
                <Right style={{ flex: 0.3 }}>
                    <Button
                        transparent
                        onPress={() => setIsVisible(false)}>
                        <Ionicon name="close" color="#fff" style={styles.fs25} />
                    </Button>
                </Right>
            </Header>
            </LinearGradient>
            <MenuProvider>
                <ScrollView
                    ref={scrollViewRef}
                    onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
                >
                       <FlatList
                        ListEmptyComponent={<Listempty style={{ marginTop: 20 }}>No aaded Address to show</Listempty>}
                              data={chatlist}
                            renderItem={({ item }) =>
                            <Chartitem itemimage={ env.baseUrl +item.profile_image} title={item.msg} loginid={loggedInUser.data.session_id} msguserid={item.user_id} viewuserid={viewuserid}/>  
                            }
                            initialNumToRender={1}
                            bounces={false}
                            onEndReachedThreshold={0.2}
                           style={{marginTop:10}}
                            
                  /> 
                </ScrollView>
            </MenuProvider>

            <Footer style={{ paddingHorizontal: 5, marginBottom: Platform.OS === 'ios' ? 30 : 2, backgroundColor: '#fff', minHeight: 45, height: height, maxHeight: 120 }}>
                    <Item rounded style={[styles.footerItem, { minHeight: 45, height: height, top: Platform.OS === 'ios' ? 0 : -5 }]}>
                        <Input placeholder='Type here..'
                            multiline={true}
                            style={[styles.input, { minHeight: 30, height: height, maxHeight: 120 }]}
                            onChangeText={(value) => {
                                setValue(value)
                                if (value.length > 0 || avatarSource.length > 0) {
                                    setDisable(false)
                                } else {
                                    setDisable(true)
                                }
                            }}
                            value={value}
                            editable={true}
                            onContentSizeChange={(e) => setHeight(e.nativeEvent.contentSize.height)}
                            selectTextOnFocus={true}
                        // autoFocus={commentId > 0 ? true : false}
                        // defaultValue={commentId}
                        />
                        <TouchableOpacity disabled={disable} onPress={submitComment}>
                            <Ionicon active name='send' style={[styles.fs20, styles.themeColor, { opacity: disable ? 0.6 : 1 }]} />
                        </TouchableOpacity>
                    </Item>
                </Footer>
            
        </Modal>
    </>
    )
}

export default UserChat;