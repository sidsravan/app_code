import React, { useState, useEffect } from 'react'
import { Modal, View, Image, TouchableOpacity, Platform } from 'react-native'
import { Header, Right, Left, Body, Button, Title, Text, Content, Footer, Item, Input, Thumbnail } from 'native-base'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchChildComments, setCommentId } from '../../actions/childCommentsActions'
import { env } from '../../env'
import { encode } from 'base-64'
import Ionicon from 'react-native-vector-icons/dist/Ionicons'
import ImagePicker from 'react-native-image-crop-picker'
import styles from '../../styles/common'
import defaultAvatar from '../../../assets/grayman.png'
import { fetchComments } from "../../actions/commentsActions"
import { timesAgo } from '../../utils'
import { Loader } from '../Loader'
import KeyboardStickyView from 'rn-keyboard-sticky-view'
import LinearGradient from 'react-native-linear-gradient'

const ReplyModal = (props) => {
    const { commentId, handleCommentId, showReply, setShowReply, comment, user, post, handleFetchChildComments, handleFetchComments } = props
    const StatusBarStyle = Platform.OS === 'ios' ? 'dark-content' : 'dark-content'
    const [value, setValue] = useState('')
    const [height, setHeight] = useState(0)
    const [avatarSource, setAvatarSource] = useState('')
    const profileImageComment = `${env.baseUrl}${comment.profile_image}`
    const imageUrl = `${env.baseUrl}${comment.comment_image}`
    const [disable, setDisable] = useState(true)
    const [loaded, setLoaded] = useState(false)
    const [profileImage, setProfileImage] = useState(profileImageComment)

    useEffect(() => {
        let profileUrl = comment.profile_image.search("https")
        if (profileUrl >= 0) {
            setProfileImage(comment.profile_image)
        } else {
            setProfileImage(profileImageComment)
        }
    }, [])

    useEffect(() => {
        setHeight(45)
        // alert(JSON.stringify(comment))
        
        return () => {
            setAvatarSource('')
            setDisable(true)
        }
    }, [])

    const submitComment = async () => {
        setLoaded(true)
        let data = {
            user_id: user.data.session_id,
            post_id: post.id,
            comment_id: comment.id,
            comment_text: value,
            comment_image: avatarSource,
            name: user.data.name,
            handle_name: user.data.handle_name,
            profile_image: user.data.profile_image
        }
        // console.log(JSON.stringify(data))
        // dispatch(addComment(data))
        try {
            const username = 'memefeed'
            const password = 'Connect12345!'
            const myHeaders = new Headers()
            myHeaders.append('Content-Type', 'multipart/form-data')
            myHeaders.append(
                'Authorization',
                `Basic ${encode(`${username}:${password}`)}`
            )

            let formData = new FormData()
            formData.append('user_id', data.user_id)
            formData.append('post_id', data.post_id)
            formData.append('parent_id', data.comment_id)
            formData.append('comment_text', data.comment_text)
            formData.append('comment_image', data.comment_image)
            formData.append('name', data.name)
            formData.append('handle_name', data.handle_name)
            formData.append('profile_image', data.profile_image)

            // console.log("formData: " + JSON.stringify(formData))
            const url = `${env.baseUrl}comments/commentList` // --> add comment api for post
            const response = await fetch(url, {
                method: 'POST',
                headers: myHeaders,
                body: formData
            })
            const res = await response.json()
            // alert(JSON.stringify(res))
            setValue('')
            setAvatarSource('')
            setHeight(45)
            handleFetchChildComments(comment.id)
            handleFetchComments(post.id)
            setShowReply(false)
            setDisable(true)
            setLoaded(false)
        } catch (error) {
            alert(error)
            console.error(error)
            setValue('')
            setHeight(45)
            setAvatarSource('')
            setDisable(true)
            setLoaded(false)
        }
    }

    // Image crop
    const options = {
        // width: 300,
        // height: 400,
        cropping: true,
        includeBase64: true,
        mediaType: 'photo',
        showCropFrame: true,
        useFrontCamera: true,
        compressImageQuality: 0.5,
        freeStyleCropEnabled: true,
        multiple: false
    }
    const openGalleryHandler = () => {
        ImagePicker.openPicker(options).then(image => {
            setAvatarSource(`data:image/png;base64,${image.data}`)
            setDisable(false)
        }).catch(error => {
            alert(error)
            console.log(error)
            setDisable(true)
        })
    }

    return (
        <>
            <Modal
                animationType="slide"
                // transparent={true}
                visible={showReply}
                onRequestClose={() => {
                    setShowReply(false)
                }}>
                {loaded && <Loader />}
                <LinearGradient colors={['#009CD6', '#005A93']}>
                    <Header noShadow style={{ backgroundColor: 'transparent' }} androidStatusBarColor="#fff" iosBarStyle={StatusBarStyle}>
                        <Left style={{ flex: 0.5 }}>
                            <Button
                                transparent
                                onPress={() => setShowReply(false)}>
                                <Ionicon name="arrow-back-outline" color="#fff" style={styles.fs25} />
                            </Button>
                        </Left>
                        <Body>
                            <Title style={{ fontWeight: 'bold', alignSelf: 'center', marginLeft: -40, color: '#fff' }}>Reply Comment</Title>
                        </Body>
                        <Right style={{ flex: 0.3 }}>
                            <Button
                                transparent
                                onPress={() => setShowReply(false)}>
                                <Ionicon name="close" color="#fff" style={styles.fs25} />
                            </Button>
                        </Right>
                    </Header>
                </LinearGradient>
                <Content>
                    {/* Comment */}
                    <View style={{ flex: 1, flexDirection: 'row', marginLeft: 10, marginTop: 10 }}>
                        <Thumbnail
                            source={
                                // user.data.login_with === 'gmail' && comment.profile_image.length > 0 || user.data.login_with === 'facebook' && comment.profile_image.length > 0 ? { uri: comment.profile_image } :
                                comment.profile_image.length > 0 ? { uri: profileImage } :
                                    comment.profile_image === null || comment.profile_image === undefined ? defaultAvatar :
                                        defaultAvatar
                            }
                        />
                        <View style={{ padding: 10, backgroundColor: '#f7f7f7', borderRadius: 5, width: '81%' }}>

                            {/* Comment header */}
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ fontWeight: 'bold' }}>{comment.name}</Text>
                                <Text style={{ fontSize: 12, color: '#808080' }}>
                                    {timesAgo(comment.cdate_date)}
                                </Text>
                            </View>
                            <Text style={{ color: '#039bd4', fontSize: 13 }}>{comment.handle_name}</Text>

                            {/* Comment image */}
                            {comment.comment_image === null || comment.comment_image === '' ? null :
                                <View style={{ height: 180, paddingTop: 5 }}>
                                    <Image
                                        source={{ uri: imageUrl }}
                                        resizeMode="stretch"
                                        style={{ width: '100%', height: '100%' }}
                                    />
                                </View>}

                            {/* Comment description */}
                            <Text style={{ fontSize: 14, paddingTop: 5 }}>{comment.comment_text}</Text>
                        </View>
                    </View>

                </Content>
                {avatarSource.length > 0 ?
                    <Footer style={{ backgroundColor: '#fff', paddingHorizontal: 10, minHeight: 120, maxHeight: 120 }}>
                        {avatarSource.length > 0 ? <Image source={{ uri: avatarSource }} style={[styles.uploadAvatar]} resizeMode="stretch" /> : null}
                    </Footer> : null}
                <KeyboardStickyView style={{ backgroundColor: '#fff', minHeight: 45, height: height, maxHeight: 120 }}
                    keyboardVerticalOffset={44}
                >
                    <Footer style={{ paddingHorizontal: 5, marginBottom: Platform.OS === 'ios' ? 30 : 0, backgroundColor: '#fff', minHeight: 45, height: height, maxHeight: 120 }}>
                        <Item rounded style={[styles.footerItem, { minHeight: 45, height: height, top: Platform.OS === 'ios' ? 0 : -5 }]}>
                            <Ionicon active name='camera' style={[styles.fs20, styles.darkGreyColor]} onPress={() => openGalleryHandler()} />
                            <Input placeholder='Comment here..'
                                multiline={true}
                                style={[styles.input, { minHeight: 30, height: height, maxHeight: 120 }]}
                                // onChangeText={(value) => setValue(value)}
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
                            // autoFocus="true"
                            />
                            <TouchableOpacity disabled={disable} onPress={submitComment}>
                                <Ionicon active name='send' style={[styles.fs20, styles.themeColor, { opacity: disable ? 0.6 : 1 }]} />
                            </TouchableOpacity>
                            {/* <Ionicon active name='send' style={[styles.fs20, styles.themeColor]} onPress={() => submitComment()} /> */}
                        </Item>
                    </Footer>
                </KeyboardStickyView>
            </Modal>
        </>
    )
}

function mapStateToProps(state) {
    return {
        user: state.user,
        commentId: state.postComments.commentId
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        handleCommentId: setCommentId,
        handleFetchChildComments: fetchChildComments,
        handleFetchComments: fetchComments
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ReplyModal)
