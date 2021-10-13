import React, { useState, useEffect } from 'react'
import { Text } from 'native-base'
import { View, Image, TouchableOpacity } from 'react-native'
import { encode } from 'base-64'
import { env } from '../../env'
import Up from '../../../assets/Up_Arrow.png'
import UpColor from '../../../assets/Up_Arrow_Colour.png'
import styles from '../../styles/common'

export const ChildCommentLike = ({ childComment, user, selectedVote, setSelectedVote, response, setResponse }) => {
    // const [response, setResponse] = useState({})

    useEffect(() => {
        // alert(comment.up_vote_count)
    }, [])

    const handleLike = async (id) => {
        setSelectedVote('like')

        try {
            const username = 'memefeed'
            const password = 'Connect12345!'
            const myHeaders = new Headers()
            myHeaders.append('Content-Type', 'multipart/form-data')
            myHeaders.append('Authorization', `Basic ${encode(`${username}:${password}`)}`)

            let formData = new FormData()
            formData.append('id', id)
            formData.append('type', 'upvote')
            formData.append('up_vote', user.data.session_id)
            formData.append('down_vote', 0)

            const api = `${env.baseUrl}comments/commentvotes`
            const res = await fetch(api, {
                method: 'POST',
                headers: myHeaders,
                body: formData
            })
            let responseJson = await res.json()
            // alert(JSON.stringify(responseJson))
            setResponse(responseJson)
        } catch (err) {
            console.log('err', err.toString())
        }
    }

    return (
        <TouchableOpacity
            onPress={() => handleLike(childComment.id)}
            disabled={
                Object.keys(response).length > 0 && selectedVote === 'like' ? true
                    : Object.keys(response).length > 0 && selectedVote === 'dislike' ? false
                        : childComment.up_vote_user_id === user.data.session_id ? true
                            : false
            }
            // disabled={Object.keys(response).length > 0 && selectedVote === 'like' ? true : false}
            style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 20 }}>
            <Image
                source={
                    Object.keys(response).length > 0 && selectedVote === 'like' ? UpColor
                        : Object.keys(response).length > 0 && selectedVote === 'dislike' ? Up
                            : childComment.up_vote_user_id === user.data.session_id ? UpColor
                                : Up
                }
                // source={
                //         Object.keys(response).length > 0 && selectedVote === 'like' ? UpColor : Up
                //     } 
                resizeMode="stretch" style={styles.childCommentFooterImage} />
            <View>
                <Text style={{ marginLeft: 2 }}>
                    {Object.keys(response).length > 0 && response.up_vote_count == 0 ? null : Object.keys(response).length > 0 && response.up_vote_count > 0 ? response.up_vote_count : childComment.up_vote_count == '0' ? null : childComment.up_vote_count}
                </Text>
            </View>
        </TouchableOpacity>
    )
}