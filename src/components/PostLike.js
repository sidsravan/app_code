import React, { useEffect, useState } from 'react'
import { Text } from 'native-base'
import { View, Image, TouchableOpacity } from 'react-native'
import { encode } from 'base-64'
import { env } from '../env'
import Up from '../../assets/Up_Arrow.png'
import UpColor from '../../assets/Up_Arrow_Colour.png'
import styles from '../styles/common'

export const PostLike = ({ post, user, selectedVote, setSelectedVote, response, setResponse }) => {

    useEffect(() => {
        // alert(JSON.stringify(response))
    }, [])

    const handleLike = async (postid) => {
        setSelectedVote('like')

        try {
            const username = 'memefeed'
            const password = 'Connect12345!'
            const myHeaders = new Headers()
            myHeaders.append('Content-Type', 'multipart/form-data')
            myHeaders.append('Authorization', `Basic ${encode(`${username}:${password}`)}`)

            let formData = new FormData()
            formData.append('id', postid)
            formData.append('type', 'upvote')
            formData.append('up_vote', user.data.session_id)
            formData.append('down_vote', 0)

            // console.log("Up vote formData: " + JSON.stringify(formData))

            const api = `${env.baseUrl}posts/likes`
            const res = await fetch(api, {
                method: 'POST',
                headers: myHeaders,
                body: formData
            })
            console.log('Up vote res: ', res)
            let responseJson = await res.json()
            // alert(JSON.stringify(responseJson))
            setResponse(responseJson)
        } catch (err) {
            console.log('err', err.toString())
        }
    }

    return (
        <TouchableOpacity
            onPress={() => handleLike(post.id)}
            disabled={
                Object.keys(response).length > 0 && selectedVote === 'like' ? true 
                : Object.keys(response).length > 0 && selectedVote === 'dislike' ? false 
                : post.up_vote_user_id === user.data.session_id ? true
                : false
            }
            style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
                source={
                    Object.keys(response).length > 0 && selectedVote === 'like' ? UpColor
                        : Object.keys(response).length > 0 && selectedVote === 'dislike' ? Up
                            : post.up_vote_user_id === user.data.session_id ? UpColor
                                : Up
                }
                resizeMode="stretch"
                style={styles.postIcon}
            />
            <View>
                <Text style={styles.text_color}>
                    {
                        Object.keys(response).length > 0 && response.up_vote_count == 0 ? null
                            : Object.keys(response).length > 0 && response.up_vote_count > 0 ? response.up_vote_count
                                : post.up_vote_count == '0' ? null : post.up_vote_count
                    }
                </Text>
            </View>
        </TouchableOpacity>
    )
}