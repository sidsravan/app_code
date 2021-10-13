import React, { useCallback, useState, useEffect } from 'react'
import { Text, Thumbnail } from 'native-base'
import { View, TouchableOpacity, Image, TouchableWithoutFeedback, Platform, Dimensions, useWindowDimensions } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { env } from '../../env'
import { encode } from 'base-64'
import { setCommentId } from '../../actions/childCommentsActions'
import { CommentLike } from './CommentLike'
import { CommentDisLike } from './CommentDisLike'
import { CommentShare } from './CommentShare'
import ChildCommentsList from './ChildCommentsList'

import CommentImg from '../../../assets/Comment.png'
import ReplayImg from '../../../assets/Replay_Comment.png'
import CommentColor from '../../../assets/Comment_Colour.png'
import defaultAvatar from '../../../assets/grayman.png'
import ReplyModal from './ReplyModal'
import ReportModal from './ReportModal'
import styles from '../../styles/common'
import Ionicon from 'react-native-vector-icons/dist/Ionicons'
import { timesAgo } from '../../utils'

import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger, renderers
} from 'react-native-popup-menu';
import Clipboard from '@react-native-community/clipboard'

const { width, height } = Dimensions.get('window')

const Comment = ({ comment, user, post, setComments, setLoaded }) => {
    const [selectedVote, setSelectedVote] = useState('')
    const [shared, setShared] = useState('')
    const [response, setResponse] = useState({})
    const [showReply, setShowReply] = useState(false)
    const imageUrl = `${env.baseUrl}${comment.profile_image}`
    const commentImage = `${env.baseUrl}${comment.comment_image}`
    const { SlideInMenu } = renderers

    const [showReport, setShowReport] = useState(false)
    const [profileImage, setProfileImage] = useState(imageUrl)

    useEffect(() => {
        let profileUrl = comment.profile_image.search("https")
        if (profileUrl >= 0) {
            setProfileImage(comment.profile_image)
        } else {
            setProfileImage(imageUrl)
        }
    }, [])

    const commentHandler = async (value) => {
        setLoaded(true)
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
                formData.append('postid', post.id)
                formData.append('user_id', user.data.session_id)
                formData.append('hide_com_id', comment.id)
                // console.log('hide')
            } else if (value === 'delete') {
                formData.append('postid', post.id)
                formData.append('del_com_id', comment.id)
                // console.log('delete')
            }
            // console.log(JSON.stringify(formData))

            const url = `${env.baseUrl}comments/commentList` // get post comments api
            const response = await fetch(url, {
                method: 'POST',
                headers: myHeaders,
                body: formData
            })
            const data = await response.json()
            setComments(data)
            // console.log(JSON.stringify(data))
            setLoaded(false)
        } catch (error) {
            setLoaded(false)
            alert(error)
            console.error(error)
        }
    }

    const reportComment = () => {
        // alert("Report comment")
        setShowReport(true)
    }

    return (
        <View key style={{
            flexWrap: 'wrap', flexDirection: 'column', width: width - 40, alignSelf: 'center', marginRight: 10,
            marginLeft: 10, marginTop: 10
        }}>

            {/* ************************ Parent comment ************************* */}
            <View style={{ flex: 1, flexDirection: 'column' }}>
                {/* Comment */}
                <View style={{ flex: 1, flexDirection: 'row' }}>

                    {/* Comment user pic */}
                    <Thumbnail style={{ width: 35, height: 35 }}
                        source={comment.profile_image === null ||
                            comment.profile_image === undefined ||
                            comment.profile_image.length === 0 ? defaultAvatar :
                            { uri: profileImage }}
                    />
                    <View style={{ padding: 10, backgroundColor: '#f7f7f7', borderRadius: 5, width: width - 80 }}>

                        {/* Comment header */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View>
                                <Text style={{ fontWeight: 'bold',fontSize: 12 }}>{comment.name}</Text>
                                <Text style={{ color: '#039bd4', fontSize: 10 }}>@{comment.handle_name}</Text>
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
                                                Clipboard.setString(comment.comment_text)
                                                // console.log(comment.comment_text)
                                            }} style={styles.menuOption}>
                                                <Text style={styles.menuText}>Copy</Text>
                                            </MenuOption>
                                            <MenuOption value='hide' onSelect={value => {
                                                commentHandler(value)
                                            }} style={styles.menuOption}>
                                                <Text style={styles.menuText}>Hide</Text>
                                            </MenuOption>
                                            {comment.user_id === user.data.session_id ?
                                                <MenuOption value='delete' onSelect={value => {
                                                    commentHandler(value)
                                                }} style={styles.menuOption}>
                                                    <Text style={styles.menuText}>Delete</Text>
                                                </MenuOption> : null}
                                        </MenuOptions>
                                    </Menu>
                                </View>
                                <Text style={{ fontSize: 12, color: '#808080' }}>
                                    {timesAgo(comment.cdate_date)}
                                </Text>
                            </View>
                        </View>
                        {comment.comment_image === null || comment.comment_image === '' ? null :
                            <View style={{ height: 0 }}>
                                <Image
                                    source={comment.comment_img}
                                    resizeMode="stretch"
                                    style={{ width: '100%', height: 150 }}
                                />
                            </View>
                        }

                        {/* Comment description */}
                        <Text style={{ fontSize: 14, paddingTop: 5 }}>{comment.comment_text}</Text>

                        {/* Comment image */}
                        {comment.comment_image === null || comment.comment_image === '' ? null :
                            <View style={{ height: 250 }}>
                                <Image
                                    source={{ uri: commentImage }}
                                    resizeMode="stretch"
                                    style={{ width: '100%', height: '100%' }}
                                />
                            </View>}
                    </View>
                </View>

                {/* Comment footer */}
                <View style={{ flex: 1, flexWrap: 'wrap', flexDirection: 'row', height: 40, paddingTop: 10, paddingLeft: 40, justifyContent: 'flex-start', alignItems: 'center' }}>

                    {/* Like comment */}
                    <CommentLike comment={comment} user={user} selectedVote={selectedVote} setSelectedVote={setSelectedVote} response={response} setResponse={setResponse} />

                    {/* Dislike comment */}
                    <CommentDisLike comment={comment} user={user} selectedVote={selectedVote} setSelectedVote={setSelectedVote} response={response} setResponse={setResponse} />

                    {/* Comment comment */}
                    <TouchableOpacity
                        onPress={() => setShowReply(true)}
                        style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 20 }}>
                        <Image source={ comment.comment_count > 0 ? CommentColor : ReplayImg}
                            // source={
                            //     share !== '' && share === 'comment'
                            //         ? CommentColor
                            //         : CommentImg
                            // }
                            resizeMode="stretch"
                            style={styles.commentFooterImage}
                        />
                        <View>
                            <Text style={{ marginLeft: 5 }}>{comment.comment_count !== null || comment.comment_count !== undefined ? comment.comment_count : null}</Text>
                        </View>
                    </TouchableOpacity>
                    

                    {/* Share comment 
                    <CommentShare comment={comment} user={user} shared={shared} setShared={setShared} />
                    * */}
                </View>
            </View>


            {/* ************************ Child comments ************************* */}
            {/* Child Comment */}
            <View style={{ width: width - 30 }}>
                <ChildCommentsList comment={comment} user={user} post={post} showReply={showReply} />
            </View>
            <ReplyModal showReply={showReply} setShowReply={setShowReply} comment={comment} post={post} />
            <ReportModal showReport={showReport} setShowReport={setShowReport} comment={comment} post={post} />

        </View>
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
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Comment))
