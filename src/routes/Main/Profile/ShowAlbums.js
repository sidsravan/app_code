import React, { useState, useEffect } from 'react'
import { Platform, Modal,FlatList,Dimensions } from 'react-native'
import { Content, Header, Right, Left, Body, Button, Title, View, Text, Spinner } from 'native-base'
import LinearGradient from 'react-native-linear-gradient'
import Ionicon from 'react-native-vector-icons/dist/Ionicons'
import styles from '../../../styles/common'
import { httpService } from '../../../utils'
import AlbumPost from '../../../components/AlbumPost'


const ShowAlbums = props => {
    const { height, width } = Dimensions.get('window')
    const StatusBarStyle = Platform.OS === 'ios' ? 'dark-content' : 'dark-content'
    const { newPost, setNewPost, showPosts, setShowPosts, user, notifData,title } = props
    const formData = new FormData()
    formData.append('user_id', user.data.session_id)
    const [start, setStart] = useState(0)
    const [end, setEnd] = useState(9)
    const [editing, setEditing] = useState(false)
    const [loadmore, setLoadmore] = useState(false)
    const [menuId, setMenuId] = useState(0)
    const [post, setPost] = useState({})
    const [items, setItems] = useState(10)
    const [loadingList, setLoadingList] = useState(false)
    const [filterdAlbums, setFilterdAlbums] = useState([])
    const [albums, setAlbums1] = useState([])
    const ac = new AbortController()
    const signal = ac.signal
    let isMount = true

    useEffect(() => {
         getAlbums();
        return () => {
            isMount = false
        }
    }, [])

    // get Notifications
    const getAlbums = async () => {
        setLoadingList(true)
        console.log("formData: ", JSON.stringify(formData))
        await httpService('album/album_list', 'POST', formData, { signal: signal })
            .then(res => res.json())
            .then(json => {
                if (isMount) {

                    let filteredItems = json.data.filter(album => album.album_name.toLowerCase() === title.toLowerCase())
                    // console.log("filteredItems", JSON.stringify(filteredItems))
                    setFilterdAlbums(filteredItems)
                    // setFilterdAlbums(json.data)
                    // setAlbums1(json.data)
                    // console.log("Albums: ", JSON.stringify(json.data))
                    setLoadingList(false)
                }
            })
            .catch(error => {
                console.log(error)
                alert(error)
                setLoadingList(false)
            })
    }

    const getHashData = async (value) => {
        let key = value.substring(1)
        const url = 'hashtag/hashtags'
        const formData = new FormData()
        formData.append('user_id', user.data.session_id)
        formData.append('search_val', key)
        // console.log("Hashtag follow: ", JSON.stringify(formData))

        await httpService(url, 'POST', formData)
            .then(res => res.json())
            .then(json => {
                if (json.status === 0) {
                    alert(json.msg)
                } else {
                    if (isMount) setHashTag(json.data[0])
                    setHashtagModal(true)
                }
                // console.log("Hashtag data: ", JSON.stringify(json))
            })
            .catch(error => { alert(error); console.log(error) })
    }
    const footerComp = () => {
        if (loadmore) {
            return <ActivityIndicator color="#00639c" size='large' style={{ height: 50, backgroundColor: '#fff' }} />
        } else {
            return <View></View>
        }
    }

    const loadMore = () => {
        if (items <= filterdAlbums.length) {
            setLoadmore(true)
            setTimeout(() => {
                setLoadmore(false)

                setItems(items + 10)
            }, 100)
        }
    }
    return (
        <>
            <Modal
                animationType="slide"
                // transparent={true}
                visible={true}
                onRequestClose={() => {
                    setNewPost(false)
                }}>
                {/* {loaded && <Loader />} */}
                <LinearGradient colors={['#009CD6', '#005A93']}>
                    <Header noShadow style={{ backgroundColor: 'transparent' }} androidStatusBarColor="#fff" iosBarStyle={StatusBarStyle}>
                        <Left style={{ flex: 0.5 }}>
                            <Button
                                transparent
                                onPress={() => setNewPost(false)}>
                                <Ionicon name="arrow-back-outline" color="#fff" style={styles.fs25} />
                            </Button>
                        </Left>
                        <Body>
                            <Title style={{ fontWeight: 'bold', alignSelf: 'center', marginLeft: -40, color: '#fff' }}>{title}</Title>
                        </Body>
                        <Right style={{ flex: 0.3 }}>
                            <Button
                                transparent
                                onPress={() => setNewPost(false)}>
                                <Ionicon name="close" color="#fff" style={styles.fs25} />
                            </Button>
                        </Right>
                    </Header>

                    
                </LinearGradient>
                {filterdAlbums.length > 0 ?
                      <FlatList
                      data={filterdAlbums}
                            keyExtractor={item => item.id.toString()}
                            renderItem={({ item, index }) => {
                                if (index + 1 <= items) {
                                    return <AlbumPost post={item} user={user} menuId={menuId} setMenuId={setMenuId}
                                        start={0} end={9} filterdAlbums={filterdAlbums} setFilterdAlbums={setFilterdAlbums}
                                        editing={editing} setEditing={setEditing} setShowPosts={setShowPosts}
                                        getHashData={getHashData}
                                    />
                                }
                            }}
                            initialNumToRender={1}
                            bounces={false}
                            onEndReached={() => loadMore()}
                            onEndReachedThreshold={0.2}
                            // ListHeaderComponent={headerComp}
                            ListFooterComponent={footerComp}
                            style={{ height: Platform.OS === 'ios' ? height - 257 : height - 235 }}
                  />   : <Text style={styles.noData}>No data found</Text>
                    }
            </Modal>
        </>
    )
}


export default ShowAlbums;
