import React, { useCallback, useEffect, useState,FC } from 'react'
import { Image, Platform, TouchableOpacity, Pressable, Text, View, SafeAreaView, KeyboardAvoidingView,Dimensions } from 'react-native'
import { encode } from 'base-64'
import { env } from '../../env'
import { connect } from "react-redux"
import { bindActionCreators } from 'redux'
import { Footer, Item, Input } from 'native-base'
import ImagePicker from 'react-native-image-crop-picker'
import Ionicon from 'react-native-vector-icons/dist/Ionicons'
import styles from '../../styles/common'
import { fetchComments } from '../../actions/commentsActions'
import { setCommentId } from '../../actions/childCommentsActions'
import { Loader } from '../Loader'
import { MentionInput } from 'react-native-controlled-mentions'
export const { width, height } = Dimensions.get('window');

const users = [];

const renderSuggestions: (suggestions: Suggestion[]) => FC<MentionSuggestionsProps> = (suggestions) => (
    { keyword, onSuggestionPress },
) => {
    if (keyword == null) {
        return null;
    }

    return (
        <View>
            {suggestions
                .filter(one => one.name.toLocaleLowerCase().includes(keyword.toLocaleLowerCase()))
                .map(one => (
                    <Pressable
                        key={one.id}
                        onPress={() => onSuggestionPress(one)}

                        style={{ padding: 12 }}
                    >
                        <Text>{one.name}</Text>
                    </Pressable>
                ))
            }
        </View>
    );
};
var renderMentionSuggestions = renderSuggestions(users);



const CommentForm = ({ post, user, scrollToBottom, setSubmit, setLoaded }) => {
    const [value, setValue] = useState('')
    const [height, setHeight] = useState(0)
    const [avatarSource, setAvatarSource] = useState('')
    const [disable, setDisable] = useState(true)

    useEffect(() => {
        setHeight(45)
        // setLoaded(true)
        // alert(JSON.stringify(user))
        getListOfuser();
        return () => {
            setAvatarSource('')
            setDisable(true)
        }
    }, [])

    const getListOfuser = async () => {

        const url = `https://memefeed.app/meme_feed/users/get_users_nemes` // get post comments api
        const response = await fetch(url, {
            method: 'get',
        })
        const data = await response.json()
        if (data && data.status == 1) {
            renderMentionSuggestions = renderSuggestions(data.data);
        }

    }



    // const handleImageUpload = () => {
    //     const options = {
    //         title: 'Select Image',
    //         // customButtons: [{name: 'fb', title: 'Choose Photo from Facebook'}],
    //         storageOptions: {
    //             skipBackup: true,
    //             path: 'images',
    //         },
    //     }
    //     ImagePicker.showImagePicker(options, (response) => {
    //         if (response.didCancel) {
    //             console.log('User cancelled image picker')
    //         } else if (response.error) {
    //             setAvatarSource('')
    //             setDisable(true)
    //             console.log('ImagePicker Error: ', response.error)
    //         } else if (response.customButton) {
    //             console.log('User tapped custom button: ', response.customButton)
    //         } else {
    //             setAvatarSource('data:image/png;base64,' + response.data)
    //             setDisable(false)
    //         }
    //     })
    // }

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
        }).catch(error => {
            alert(error)
            console.log(error)
        })
    }

    const submitComment = async () => {
        setLoaded(true)
        let data = {
            user_id: user.data.session_id,
            post_id: post.id,
            comment_id: 0,
            comment_text: value,
            comment_image: avatarSource,
            name: user.data.name,
            handle_name: user.data.handle_name,
            profile_image: user.data.profile_image
        }
        // console.log("Data: " + JSON.stringify(data))
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

            // alert("Form data: " + JSON.stringify(formData))

            const url = `${env.baseUrl}comments/commentList` // --> add comment api for post
            const response = await fetch(url, {
                method: 'POST',
                headers: myHeaders,
                body: formData
            })
            const res = await response.json()
            // console.log("Comment response: " + JSON.stringify(res))
            setValue('')
            setHeight(45)
            setAvatarSource('')
            setSubmit(true)
            setDisable(true)
            scrollToBottom()
            setLoaded(false)
        } catch (error) {
            alert(error)
            console.error(error)
            setValue('')
            setAvatarSource('')
            setHeight(45)
            setDisable(true)
            setLoaded(false)
        }
    }

    return (
        <KeyboardAvoidingView
            enabled={Platform.OS === 'ios'}
            behavior="padding"
            style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: '#fff' }}>
            <SafeAreaView>
                <View style={[{ flexDirection: "row", backgroundColor: '#ccc', marginHorizontal: 10, paddingHorizontal: 10, paddingBottom: 5, borderRadius: 15, paddingTop: 5, alignItems: 'center', }]}>
                    <Ionicon active name='camera' style={[styles.fs20, styles.darkGreyColor]} onPress={() => openGalleryHandler()} />

                    <MentionInput
                        autoFocus
                        value={value}
                        onChange={(value) => {
                            setValue(value)
                            if (value.length > 0 || avatarSource.length > 0) {
                                setDisable(false)
                            } else {
                                setDisable(true)
                            }
                        }}

                        partTypes={[
                            {
                                trigger: '@',
                                renderSuggestions: renderMentionSuggestions,
                            },
                            {
                                pattern: /(https?:\/\/|www\.)[-a-zA-Z0-9@:%._\+~#=]{1,256}\.(xn--)?[a-z0-9-]{2,20}\b([-a-zA-Z0-9@:%_\+\[\],.~#?&\/=]*[-a-zA-Z0-9@:%_\+\]~#?&\/=])*/gi,
                                textStyle: { color: 'blue' },
                            },
                        ]}


                        style={{
                            marginRight: 50,
                            width:width-80

                        }}
                        placeholder="Type here..."
                    />


                    <TouchableOpacity style={{
                        position: "absolute",
                        right: 0, marginRight: 15
                    }} disabled={disable} onPress={submitComment}>
                        <Ionicon active name='send' style={[styles.fs20, styles.themeColor, { opacity: disable ? 0.6 : 1 }]} />
                    </TouchableOpacity>

                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>

    )
}

function mapStateToProps(state) {
    return {
        user: state.user,
        storeCommentId: state.postComments.commentId,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        handleCommentId: setCommentId,
        handleFetchComments: fetchComments
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(CommentForm)
// const mapStateToProps = (state) => ({
//     user: state.user
// })
// export default connect(mapStateToProps)(CommentForm)
