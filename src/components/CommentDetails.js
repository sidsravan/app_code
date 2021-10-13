import React, { useState, useEffect } from 'react'
import { Platform, Modal } from 'react-native'
import { Content, Header, Right, Left, Body, Button, Title, View, Text, Spinner } from 'native-base'
import LinearGradient from 'react-native-linear-gradient'
import Ionicon from 'react-native-vector-icons/dist/Ionicons'
import { Loader } from './Loader'
import styles from '../styles/common'
import Post from './Post'
import { httpService } from '../utils'
import { connect } from 'react-redux'
import Comment from './Comments/Comment'
import { MenuProvider } from 'react-native-popup-menu'
import { removeFetchedNotifsData } from '../actions/notifsActions'

const CommentDetails = props => {
    const StatusBarStyle = Platform.OS === 'ios' ? 'dark-content' : 'dark-content'
    const { newComment, setNewComment, user, notifData, removeFetchedNotifsData } = props
    const [comments, setComments] = useState([])
    const [loaded, setLoaded] = useState(false)
    const [post, setPost] = useState({})
    const [comment, setComment] = useState({})
    const [loading, setLoading] = useState(false)
    let isMount = true
    
    useEffect(() => {
        getPostDetails()
        getCommentDetails()
        return () => {
            isMount = false
            removeFetchedNotifsData()
        }
    }, [])

    // get post details
    const getPostDetails = async () => {
        setLoading(true)
        const url = 'posts/newpost_notifications'
        const formData = new FormData()
        formData.append('user_id', user.data.session_id)
        formData.append('post_id', Number(notifData.post_id))
        // console.log("getPostDetails from Comment Details formdata: ", JSON.stringify(formData))

        await httpService(url, 'POST', formData)
            .then(res => res.json())
            .then(json => {
                if (isMount) setPost(json[0])
                // console.log("getPostDetails from Comment Details data: ", JSON.stringify(json))
                setLoading(false)
            })
            .catch(error => {
                alert(error)
                console.log(error)
                setLoading(false)
            })
    }

    // get comment details
    const getCommentDetails = async () => {
        setLoading(true)
        const url = 'comment/comment_notification'
        const formData = new FormData()
        formData.append('user_id', user.data.session_id)
        formData.append('comment_id', Number(notifData.id))
        // console.log("getCommentDetails from Comment Details formdata: ", JSON.stringify(formData))

        await httpService(url, 'POST', formData)
            .then(res => res.json())
            .then(json => {
                if (isMount) setComment(json[0])
                // console.log("getCommentDetails from Comment Details data: ", JSON.stringify(json))
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
                visible={newComment}
                onRequestClose={() => {
                    setNewComment(false)
                    removeFetchedNotifsData()
                }}>
                {/* {loaded && <Loader />} */}
                <LinearGradient colors={['#009CD6', '#005A93']}>
                    <Header noShadow style={{ backgroundColor: 'transparent' }} androidStatusBarColor="#fff" iosBarStyle={StatusBarStyle}>
                        <Left style={{ flex: 0.5 }}>
                            <Button
                                transparent
                                onPress={() => {
                                    setNewComment(false)
                                    removeFetchedNotifsData()
                                }}
                            >
                                <Ionicon name="arrow-back-outline" color="#fff" style={styles.fs25} />
                            </Button>
                        </Left>
                        <Body>
                            <Title style={{ fontWeight: 'bold', alignSelf: 'center', marginLeft: -40, color: '#fff' }}>Comment Details</Title>
                        </Body>
                        <Right style={{ flex: 0.3 }}>
                            <Button
                                transparent
                                onPress={() => {
                                    setNewComment(false)
                                    removeFetchedNotifsData()
                                }}
                            >
                                <Ionicon name="close" color="#fff" style={styles.fs25} />
                            </Button>
                        </Right>
                    </Header>
                </LinearGradient>
                <Content>
                    <MenuProvider>
                        {loading ? <Spinner color="#00639c" style={{ marginTop: 10, alignSelf: 'center' }} /> :
                            Object.keys(post).length > 0 && Object.keys(comment).length > 0 ?
                                <Comment comment={comment} post={post} setComments={setComments} />
                                : <Text style={styles.noData}>No data found</Text>}
                    </MenuProvider>
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
export default connect(mapStateToProps)(CommentDetails)
