import React, { useState, useEffect } from 'react'
import { Platform, Modal } from 'react-native'
import { Content, Header, Right, Left, Body, Button, Title, View, Text, Spinner } from 'native-base'
import LinearGradient from 'react-native-linear-gradient'
import Ionicon from 'react-native-vector-icons/dist/Ionicons'
import { Loader } from '../components/Loader'
import styles from '../styles/common'
import Post from './Post'
import { httpService } from '../utils'
import { connect } from 'react-redux'
import { removeFetchedNotifsData } from '../actions/notifsActions'

const PostDetails = props => {
    const StatusBarStyle = Platform.OS === 'ios' ? 'dark-content' : 'dark-content'
    const { newPost, setNewPost, showPosts, setShowPosts, user, notifData, removeFetchedNotifsData } = props
    const [loading, setLoading] = useState(false)
    const [start, setStart] = useState(0)
    const [end, setEnd] = useState(9)
    const [editing, setEditing] = useState(false)
    const [menuId, setMenuId] = useState(0)
    const [post, setPost] = useState({})
    let isMount = true

    useEffect(() => {
        getPostDetails()
        return () => {
            isMount = false
            removeFetchedNotifsData()
        }
    }, [])

    // get Notifications
    const getPostDetails = async () => {
        setLoading(true)
        const url = 'posts/newpost_notifications'
        const formData = new FormData()
        formData.append('user_id', user.data.session_id)
        formData.append('post_id', Number(notifData.id))
        console.log("getPostDetails formdata: ", JSON.stringify(formData))

        await httpService(url, 'POST', formData)
            .then(res => res.json())
            .then(json => {
                if (isMount) setPost(json[0])
                console.log("getPostDetails data: ", JSON.stringify(json))
                setLoading(false)
            })
            .catch(error => {
                alert(error)
                console.log(error)
                setLoading(false)
            })
    }

    return (
        <>
            <Modal
                animationType="slide"
                // transparent={true}
                visible={newPost}
                onRequestClose={() => {
                    setNewPost(false)
                    removeFetchedNotifsData()
                }}>
                {/* {loaded && <Loader />} */}
                <LinearGradient colors={['#009CD6', '#005A93']}>
                    <Header noShadow style={{ backgroundColor: 'transparent' }} androidStatusBarColor="#fff" iosBarStyle={StatusBarStyle}>
                        <Left style={{ flex: 0.5 }}>
                            <Button
                                transparent
                                onPress={() => {
                                    setNewPost(false)
                                    removeFetchedNotifsData()
                                }}
                            >
                                <Ionicon name="arrow-back-outline" color="#fff" style={styles.fs25} />
                            </Button>
                        </Left>
                        <Body>
                            <Title style={{ fontWeight: 'bold', alignSelf: 'center', marginLeft: -40, color: '#fff' }}>Post Details</Title>
                        </Body>
                        <Right style={{ flex: 0.3 }}>
                            <Button
                                transparent
                                onPress={() => {
                                    setNewPost(false)
                                    removeFetchedNotifsData()
                                }}
                            >
                                <Ionicon name="close" color="#fff" style={styles.fs25} />
                            </Button>
                        </Right>
                    </Header>
                </LinearGradient>
                <Content>
                    <View>
                        {loading ? <Spinner color="#00639c" style={{ marginTop: 10, alignSelf: 'center' }} /> :
                            Object.keys(post).length > 0 ?
                                <Post post={post} user={user} start={start} end={end}
                                    setShowPosts={setShowPosts} setEditing={setEditing}
                                    menuId={menuId} setMenuId={setMenuId}
                                />
                                : <Text style={styles.noData}>No data found</Text>}
                    </View>
                </Content>
            </Modal>
        </>
    )
}

// Map Redux state to React component props
const mapStateToProps = (state) => ({
    user: state.user,
    notifData: state.notifData.notifData,
    removeFetchedNotifsData: removeFetchedNotifsData
})
// Connect Redux to React
export default connect(mapStateToProps)(PostDetails)
