import React, { useEffect, useState } from 'react'
import { View, Text, ActivityIndicator, FlatList, Platform, Dimensions,TouchableOpacity,Image } from 'react-native'
import UsePostFetch from '../../../hooks/UsePostFetch'
import styles from '../../../styles/common'
import { httpService } from '../../../utils'
import AlbumPost from '../../../components/AlbumPost'
import Ionicon from 'react-native-vector-icons/dist/Ionicons'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import CreatePost from '../../../components/CreatePost/CreatePost'
import ShowAlbums from "./ShowAlbums";

import Hashtag from '../Hashtag/Hashtag'
import { env } from '../../../env'


export const ProfileAlbums = (props) => {
    const { user, height, width, filterMenu, setFilterMenu, postTypes, onHomePostSend,
        showPosts, setShowPosts, setPosts, menuId, setMenuId
    } = props
    const formData = new FormData()
    formData.append('user_id', user.data.session_id)
    const { loading, error, data } = UsePostFetch('album/album_name_list', 'POST', formData)

    const [selected, setSelected] = useState('all')
    const [albumNames, setAlbumNames] = useState([])
    const [albums, setAlbums] = useState([])
    const [filterdAlbums, setFilterdAlbums] = useState([])
    const [items, setItems] = useState(10)
    const [loadmore, setLoadmore] = useState(false)
    const [noData, setNoData] = useState('')
    const [hashTag, setHashTag] = useState({})
    const [hashtagModal, setHashtagModal] = useState(false)

    // const [menuId, setMenuId] = useState(0)
    const [editing, setEditing] = useState(false)
    const [newPost, setNewPost] = useState(0)
    const [loadingList, setLoadingList] = useState(false)
    const [albumFolders,setAlbumFolders]=useState([]);

    const [showalbums,setshowalbums]=useState(false);
    const [albumtitle,setalbumtitle]=useState('');

    const ac = new AbortController()
    const signal = ac.signal

    let isMount = true

    useEffect(() => {
        getAlbums()
        getAlbumNames()
        getAlbumfolders();
        // console.log(JSON.stringify('albums ', albums))
        // console.log(JSON.stringify('albums ', albumNames))
        return () => {
            // setPosts(false)
            ac.abort()
            isMount = false
        }
    }, [])

    // ======================================================== Fetch hashtag data fn
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

    const  getAlbumfolders=async()=>{
        await httpService('album/album_folders', 'POST', formData, { signal: signal })
        .then(res => res.json())
        .then(json => {
            if (json.status === 0) {
                setNoData(json.msg)
            } else {
                // console.log("AlbumFolders : ", JSON.stringify(json.data));
                if (isMount) setAlbumFolders(json.data)

            }
            // console.log("Albums: ", JSON.stringify(json))
        })
        .catch(error => { alert(error); console.log(error) })

    }

    const getAlbumNames = async () => {
        await httpService('album/album_name_list', 'POST', formData, { signal: signal })
            .then(res => res.json())
            .then(json => {
                if (json.status === 0) {
                    setNoData(json.msg)
                } else {
                    if (isMount) setAlbumNames(json.data)

                }
                // console.log("Albums: ", JSON.stringify(json))
            })
            .catch(error => { alert(error); console.log(error) })
    }

    const getAlbums = async () => {
        setLoadingList(true)
        await httpService('album/album_list', 'POST', formData, { signal: signal })
            .then(res => res.json())
            .then(json => {
                if (isMount) {
                    setAlbums(json.data)
                    setFilterdAlbums(json.data)
                    // console.log("Albums: ", JSON.stringify(json))
                    setLoadingList(false)
                }
            })
            .catch(error => {
                console.log(error)
                alert(error)
                setLoadingList(false)
            })
    }

    const getFilteredAlbums = async (value) => {
        // console.log(value)
        setFilterMenu(false)
        if (value === 'all') {
            setFilterdAlbums(albums)
        } else {
            let filteredItems = albums.filter(album => album.album_name.toLowerCase() === value.toLowerCase())
            // console.log("filteredItems", JSON.stringify(filteredItems))
            setFilterdAlbums(filteredItems)
        }
    }

    const onValueChange = () => { }

    const loadMore = () => {
        if (items <= filterdAlbums.length) {
            setLoadmore(true)
            setTimeout(() => {
                setLoadmore(false)

                setItems(items + 10)
            }, 100)
        }
    }

    const headerComp = () => {
        return <Text>Header Component</Text>
    }

    const footerComp = () => {
        if (loadmore) {
            return <ActivityIndicator color="#00639c" size='large' style={{ height: 50, backgroundColor: '#fff' }} />
        } else {
            return <View></View>
        }
    }

    return (
        <View>
            {showPosts ?
                <CreatePost
                    onPostSend={(data) => onHomePostSend(data)}
                    postTypes={postTypes} user={user}
                    editing={editing} setEditing={setEditing}
                    setNewPost={setNewPost} newPostFetch={getAlbums}
                // fetchData={fetchData} 
                /> :
                <>
                    {loadingList && <ActivityIndicator color="#00639c" size='large' style={{ height: 50, backgroundColor: '#fff' }} />}
                  {albumFolders.length>0?
                        <FlatList
                            data={albumFolders}
                             numColumns={2}     
                            // keyExtractor={item => item.id.toString()}
                            renderItem={({ item, index }) => {
                              
                                    return(
                                        <TouchableOpacity onPress={()=>{setshowalbums(true);setalbumtitle(item.name)}}>
                                    <View style={{width:Dimensions.get('screen').width*.47,height:Dimensions.get('screen').width*.5,marginRight:5, marginBottom:4,shadowOffset: {
                                        width: 0,
                                        height: 2,
                                      },
                                      alignSelf:'center',
                                      borderRadius:3,
                                      shadowOpacity: 0.03,
                                    shadowRadius: 4.84,
                                    marginLeft:5,
                                    marginTop:15,
                                    backgroundColor:'#fff',
                                   elevation:8,}}>
                                    <Image
                                               source={{ uri:  `${env.baseUrl}${item.post_image}`}}
                                               resizeMode="stretch"
                                               style={{ width: Dimensions.get('screen').width*.47, height: Dimensions.get('screen').width*.4 }}
                                           />
                                   <Text style={{color:"#000000",textAlign:'center',marginTop:5,width: Dimensions.get('screen').width*.48}}>{item.name}</Text>
                               </View>
                               </TouchableOpacity>
                                    );
                            }}
                            // initialNumToRender={1}
                            // bounces={false}
                            // onEndReached={() => loadMore()}
                            // onEndReachedThreshold={0.2}
                            // ListHeaderComponent={headerComp}
                            // ListFooterComponent={footerComp}
                            style={{ marginBottom:20 }}
                        /> 
                        
                        : <Text style={styles.noData}>No data found</Text>
                    } 

                  
             {showalbums &&
                    <ShowAlbums
                        newPost={ShowAlbums} setNewPost={setshowalbums} title={albumtitle} user={user}
                    />
                }
                  
                    {/* {albums.length > 0 ?
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
                        /> : <Text style={styles.noData}>No data found</Text>
                    } */}
                </>
            }

            {/* Filters */}
            {/* {showPosts ? null :
                <>
                    {albumNames.length > 0 &&
                        <View style={{
                            position: 'absolute', right: 20, top: -35
                        }}>
                            <TouchableOpacity onPress={() => setFilterMenu(!filterMenu)}
                                style={{ position: 'absolute', top: -0, right: 5 }}
                            >
                                <Ionicon name="ios-filter-outline" size={25} />
                            </TouchableOpacity>
                            {filterMenu &&
                                <>
                                    <TouchableWithoutFeedback
                                        style={{
                                            backgroundColor: 'rgba(0,0,0,.01)',
                                            position: 'relative', top: -220, left: 25,
                                            width: width + 50, height: height
                                        }}
                                        onPressIn={() => {
                                            setFilterMenu(false)
                                        }}
                                    >
                                    </TouchableWithoutFeedback>
                                    <View style={{
                                        position: 'absolute', right: -5, top: 30, width: 150,
                                        backgroundColor: '#fff', zIndex: 9999, elevation: 9999,
                                        shadowColor: '#aaa', shadowOffset: { width: 0, height: 7 }, shadowOpacity: 0.25,
                                        padding: 0, borderWidth: 1, borderColor: '#ddd'
                                    }}>
                                        <TouchableOpacity onPress={() => getFilteredAlbums('all')}
                                            style={{ paddingVertical: 10, paddingHorizontal: 20 }}
                                        >
                                            <Text>All</Text>
                                        </TouchableOpacity>
                                        {albumNames.map(album => {
                                            return <TouchableOpacity key={album.id} onPress={() => getFilteredAlbums(album.name)}
                                                style={{ paddingVertical: 10, paddingHorizontal: 20 }}
                                            >
                                                <Text>{album.name}</Text>
                                            </TouchableOpacity>
                                        })}
                                    </View>
                                </>
                            }
                        </View>
                    }
                </>
            } */}

            {hashtagModal &&
                <Hashtag user={user}
                    isVisible={hashtagModal} setIsVisible={setHashtagModal}
                    hashTag={hashTag} setHashTag={setHashTag}
                />
            }
        </View>
    )
}