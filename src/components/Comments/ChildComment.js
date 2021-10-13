import React, { useState, useEffect } from 'react'
import { View, TouchableOpacity, Image, Dimensions } from 'react-native'
import { Text, Thumbnail } from 'native-base'
import defaultAvatar from '../../../assets/grayman.png'
import CommentImg from '../../../assets/Comment.png'
import { env } from '../../env'
import { encode } from 'base-64'
import { ChildCommentLike } from './ChildCommentLike'
import { ChildCommentDisLike } from './ChildCommentDisLike'
import { ChildCommentShare } from './ChildCommentShare'
import SubChildCommentsList from './SubChildCommentsList'
import SubCommentReplyModal from './SubCommentReplyModal'
import ReplayImg from '../../../assets/Replay_Comment.png'
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger, renderers
} from 'react-native-popup-menu';
import Clipboard from '@react-native-community/clipboard'
import Ionicon from 'react-native-vector-icons/dist/Ionicons'
import styles from '../../styles/common'
import ChildCommentReportModal from './ChildCommentReportModal'
import {timesAgo} from '../../utils'

const { width, height } = Dimensions.get('window')

export const ChildComment = ({ childComment, user, post, comment, setChildComments }) => {
    const [selectedVote, setSelectedVote] = useState('')
    const [shared, setShared] = useState('')
    const [response, setResponse] = useState({})
    const [showReply, setShowReply] = useState(false)

    const imageUrl = `${env.baseUrl}${childComment.profile_image}`
    const commentImage = `${env.baseUrl}${childComment.comment_image}`
    const { SlideInMenu } = renderers
    const [showReport, setShowReport] = useState(false)
    const [profileImage, setProfileImage] = useState(imageUrl)

    useEffect(() => {
        // console.log(JSON.stringify(childComment.profile_image))
        let profileUrl = childComment.profile_image.search("https")
        if (profileUrl >= 0) {
            setProfileImage(childComment.profile_image)
        } else {
            setProfileImage(imageUrl)
        }
    }, [])

    useEffect(() => {
        // console.log(JSON.stringify(comment))
        // if(comment){
        // console.log(JSON.stringify(childComment))
        // }
    }, [])

    const commentHandler = async (value) => {
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
            if (value === 'hide') {
                formData.append('parent_id', comment.id)
                formData.append('user_id', user.data.session_id)
                formData.append('hide_com_id', childComment.id)
                formData.append('user_id', user.data.session_id)
                formData.append('post_id', post.id)
                // console.log('hide')
            } else if (value === 'delete') {
                formData.append('parent_id:', comment.id)
                formData.append('del_com_id', childComment.id)
                formData.append('user_id', user.data.session_id)
                formData.append('post_id', post.id)
                // console.log('delete')
            }
            // console.log(JSON.stringify(formData))

            const url = `${env.baseUrl}comments/get_child_comment_list` // get post comments api
            const response = await fetch(url, {
                method: 'POST',
                headers: myHeaders,
                body: formData
            })
            const data = await response.json()
            setChildComments(data)
            console.log(JSON.stringify(data))
        } catch (error) {
            alert(error)
            console.error(error)
        }
    }

    const reportComment = () => {
        // alert("Report comment")
        setShowReport(true)
    }

    return (
        <View style={{ flex: 1, flexWrap: 'wrap', flexDirection: 'column', alignSelf: 'center', marginRight: 5, marginLeft: 0, marginTop: 0, borderLeftWidth: 0, borderLeftColor: '#ddd', borderStyle: 'solid', paddingLeft: 0 }}>
            <View style={{ flex: 1, flexDirection: 'row', marginBottom: 7 }}>
                <Thumbnail
                    source={
                        // user.data.login_with === 'gmail' && childComment.profile_image.length > 0 ||
                        // user.data.login_with === 'facebook' && childComment.profile_image.length > 0 ? { uri: childComment.profile_image } :
                        childComment.profile_image === null || childComment.profile_image === undefined || childComment.profile_image.length === 0 ? defaultAvatar :
                            { uri: profileImage }}
                    style={{ width: 35, height: 35 }}
                />

                <View style={{ flex: 1, padding: 10, backgroundColor: '#f7f7f7', borderRadius: 5, width: '100%' }}>
                    {/* Child Comment header */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View>
                            <Text style={{ fontWeight: 'bold', fontSize: 12 }}>{childComment.name}</Text>
                            <Text style={{ color: '#039bd4', fontSize: 10 }}>@{childComment.handle_name}</Text>
                        </View>
                        <View>
                            <View>
                                <Menu renderer={SlideInMenu}>
                                    <MenuTrigger><Ionicon name="ellipsis-horizontal-sharp" size={14} style={{ alignSelf: 'flex-end' }} /></MenuTrigger>
                                    <MenuOptions>
                                        <MenuOption onSelect={() => reportComment()} style={styles.menuOption}>
                                            <Text style={styles.menuText}>Report Comment</Text>
                                        </MenuOption>
                                        <MenuOption onSelect={() => {
                                            Clipboard.setString(childComment.comment_text)
                                            // alert(childComment.comment_text)
                                        }} style={styles.menuOption}>
                                            <Text style={styles.menuText}>Copy</Text>
                                        </MenuOption>
                                        <MenuOption value='hide' onSelect={value => {
                                            commentHandler(value)
                                        }} style={styles.menuOption}>
                                            <Text style={styles.menuText}>Hide</Text>
                                        </MenuOption>
                                        {childComment.user_id === user.data.session_id ?
                                            <MenuOption value='delete' onSelect={value => {
                                                commentHandler(value)
                                            }} style={styles.menuOption}>
                                                <Text style={styles.menuText}>Delete</Text>
                                            </MenuOption> : null}
                                    </MenuOptions>
                                </Menu>
                            </View>
                            <Text style={{ fontSize: 10, color: '#808080' }}>
                                {timesAgo(childComment.cdate_date)}
                            </Text>
                        </View>
                    </View>

                    {/* Child Comment image */}
                    {childComment.comment_image === null || childComment.comment_image === '' ? null :
                        <View style={{ height: 250}}>
                            <Image
                                source={{ uri: commentImage }}
                                resizeMode="stretch"
                                style={{ width: '100%', height: 150 }}
                            />
                        </View>}

                    {/* Child Comment description */}
                    <Text style={{ fontSize: 12, paddingTop: 5 }}> {childComment.comment_text}</Text>
                    {/* {childComment.comment_image.length > 0 ? <Image source={{uri: childComment.comment_image}} style={[styles.uploadAvatar]} resizeMode="stretch" /> : null} */}
                </View>
            </View>

            {/* Comment footer */}
            <View style={{ flex: 1, flexWrap: 'wrap', flexDirection: 'row', height: 40, paddingTop: 7, paddingLeft: 40, justifyContent: 'flex-start', alignItems: 'center' }}>

                {/* Like comment */}
                <ChildCommentLike childComment={childComment} user={user} selectedVote={selectedVote} setSelectedVote={setSelectedVote} response={response} setResponse={setResponse} />

                {/* Dislike comment */}
                <ChildCommentDisLike childComment={childComment} user={user} selectedVote={selectedVote} setSelectedVote={setSelectedVote} response={response} setResponse={setResponse} />

                {/* Comment comment */}
                <TouchableOpacity
                    onPress={() => setShowReply(true)}
                    style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 20 }}>
                    <Image source={ReplayImg}
                        // source={
                        //     share !== '' && share === 'comment'
                        //         ? CommentColor
                        //         : CommentImg
                        // }
                        resizeMode="stretch"
                       style={styles.commentFooterImage}
                    />
                    <View>
                        {/* <Text style={{ marginLeft: 2 }}>{childComment.comment_count !== null || childComment.comment_count !== undefined ? childComment.comment_count : null}</Text> */}
                    </View>
                </TouchableOpacity>

                {/* Share comment 
                <ChildCommentShare childComment={childComment} user={user} shared={shared} setShared={setShared} />
                */}
                {/* <CommentShare comment={comment} user={user} shared={shared} setShared={setShared} /> */}
            </View>

            {/* ************************ Sub Child comments ************************* */}
            {/* Sub Child Comments List */}
            <View style={{ marginLeft: Platform.OS === 'ios' ? 5 : 0, width: width - 45 }}>
                <SubChildCommentsList childComment={childComment} user={user} showReply={showReply} post={post} />
            </View>

            <SubCommentReplyModal showReply={showReply} setShowReply={setShowReply} childComment={childComment} user={user} post={post} />
            <ChildCommentReportModal showReport={showReport} setShowReport={setShowReport} comment={comment} childComment={childComment} post={post} />
        </View>
    )
}