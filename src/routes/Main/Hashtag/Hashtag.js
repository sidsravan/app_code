import React, { useEffect, useState } from 'react'
import { ScrollView, View, Text, Modal, TouchableOpacity, FlatList, Pressable, TextInput } from 'react-native'
import { Header, Right, Left, Body, Button, Title, Item, Picker, Spinner } from 'native-base'
import Ionicon from 'react-native-vector-icons/dist/Ionicons'
import { httpService } from '../../../utils'
import styles from '../../../styles/common'
import HashtagPost from '../../../components/HashtagPost'
import { Loader } from '../../../components/Loader'
import LinearGradient from 'react-native-linear-gradient'
import moment from 'moment'
import DateTimePicker from '@react-native-community/datetimepicker'

const Hashtag = (props) => {
    const StatusBarStyle = Platform.OS === 'ios' ? 'dark-content' : 'dark-content'
    const { isVisible, setIsVisible, hashTag, setHashTag, user } = props
    let isMount = true

    // States    
    const [filters, setFilters] = useState(0)
    const [sortBy, setSortBy] = useState(0)
    const [datePosted, setDatePosted] = useState('select')
    const [start, setStart] = useState(0)
    const [end, setEnd] = useState(9)
    const [data, setData] = useState([])
    const [showPosts, setShowPosts] = useState(true)
    const [editing, setEditing] = useState(false)
    const [menuId, setMenuId] = useState(0)
    const [ptypeList, setPtypeList] = useState([])
    const [sortByList, setSortByList] = useState([])
    const [filterLoading, setFilterLoading] = useState(false)
    const [hashtagModal, setHashtagModal] = useState(false)
    const [loader, setLoader] = useState(false)
    const [follow, setFollow] = useState({})
    // Datetime states
    const [submittedDatePosted, setSubmittedDatePosted] = useState(false)
    const [showDatePosted, setShowDatePosted] = useState(false)
    const [date, setDate] = useState(new Date())
    const [fromDate, setfromDate] = useState('')
    const [toDate, settoDate] = useState('')
    const [showFromDate, setShowFromDate] = useState(false)
    const [showToDate, setShowToDate] = useState(false)


    useEffect(() => {
        getFilters()
        getSortBy()
        getHashtagPosts()
        // console.log("hashTag: " + JSON.stringify(hashTag))

        return () => {
            isMount = false
            setHashTag({})
        }
    }, [])

    const followHandler = async () => {
        const url = 'followers/following'
        const formData = new FormData()
        formData.append('user_id', user.data.session_id)
        formData.append('type', 'hash')
        formData.append('to_id', hashTag.id)
        // console.log("Hashtag follow: ", JSON.stringify(hashTag))

        await httpService(url, 'POST', formData)
            .then(res => res.json())
            .then(json => {
                if (json.status === 0) {
                    alert(json.msg)
                } else {
                    if (isMount) {
                        alert(json.msg)
                        setFollow(json)
                    }
                }
                // console.log("Hashtag follow: ", JSON.stringify(json))
            })
            .catch(error => { alert(error); console.log(error) })
    }
	// get Hashtag Posts
    const getHashtagNamePosts = async (val) => {
        setFilterLoading(true)
        const url = 'posts/postlist'
        const formData = new FormData()
        formData.append('user_id', user.data.session_id)
        formData.append('hash_tag_name', val)
        // console.log("Hashtag posts formdata: ", JSON.stringify(formData))

        await httpService(url, 'POST', formData)
            .then(res => res.json())
            .then(json => {
                if (isMount) setData(json)
                console.log("Hashtag Posts: ", JSON.stringify(json))
                setFilterLoading(false)
            })
            .catch(error => {
                alert(error)
                console.log(error)
                setFilterLoading(false)
            })
    }
    // get Hashtag Posts
    const getHashtagPosts = async () => {
		
        setFilterLoading(true)
        const url = 'posts/postlist'
        const formData = new FormData()
        formData.append('user_id', user.data.session_id)
        formData.append('hash_tag_id', hashTag.id)
        // console.log("Hashtag posts formdata: ", JSON.stringify(formData))

        await httpService(url, 'POST', formData)
            .then(res => res.json())
            .then(json => {
                if (isMount) setData(json)
                console.log("Hashtag Posts: ", JSON.stringify(json))
                setFilterLoading(false)
            })
            .catch(error => {
                alert(error)
                console.log(error)
                setFilterLoading(false)
            })
    }

    // getFilters
    const getFilters = async () => {
        const url = 'post_type/ptypelist'
        const formData = new FormData()
        formData.append('user_id', user.data.session_id)
        formData.append('hashtag_id', hashTag.id)
        // console.log("Hashtag follow: ", JSON.stringify(formData))

        await httpService(url, 'POST', formData)
            .then(res => res.json())
            .then(json => {
                if (isMount) setPtypeList(json)
                // console.log("Hashtag follow: ", JSON.stringify(json))
            })
            .catch(error => { alert(error); console.log(error) })
    }

    // getSortBy
    const getSortBy = async () => {
        const url = 'post/sort_filter_types'
        const formData = new FormData()
        formData.append('user_id', user.data.session_id)
        formData.append('hashtag_id', hashTag.id)
        // console.log("Hashtag follow: ", JSON.stringify(formData))

        await httpService(url, 'POST', formData)
            .then(res => res.json())
            .then(json => {
                if (isMount) setSortByList(json.data)
                // console.log("Hashtag follow: ", JSON.stringify(json))
            })
            .catch(error => { alert(error); console.log(error) })
    }

    // Filters onchange fn
    const filtersOnchange = async (value) => {
        if (value !== 0) {
            setFilterLoading(true)
            setFilters(value)
            // console.log(value)

            const url = 'posts/postlist'
            const formData = new FormData()
            formData.append('user_id', user.data.session_id)
            formData.append('post_type_filter_id', value)
            formData.append('hashtag_id', hashTag.id)

            // console.log("Hashtag follow: ", JSON.stringify(formData))

            await httpService(url, 'POST', formData)
                .then(res => res.json())
                .then(json => {
                    if (isMount) setData(json)
                    // console.log("Hashtag Filters Posts: ", JSON.stringify(json))
                    setFilterLoading(false)
                })
                .catch(error => {
                    alert(error)
                    console.log(error)
                    setFilterLoading(false)
                })
        }
    }

    const sortByOnchange = async (value) => {
        if (value !== 0) {
            setFilterLoading(true)
            setSortBy(value)
            // console.log(value)

            const url = 'posts/postlist'
            const formData = new FormData()
            formData.append('user_id', user.data.session_id)
            formData.append('sort_filter_id', value)
            formData.append('sort_hashtag_id', hashTag.id)
            // console.log("Hashtag follow: ", JSON.stringify(value))

            await httpService(url, 'POST', formData)
                .then(res => res.json())
                .then(json => {
                    if (isMount) setData(json)
                    // console.log("Hashtag Sort by Posts: ", JSON.stringify(json))
                    setFilterLoading(false)
                })
                .catch(error => {
                    alert(error)
                    console.log(error)
                    setFilterLoading(false)
                })
        }
    }

    // ======================================================== Fetch hashtag data fn
    const getHashData = async (value) => {
        setLoader(true)
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
                    getHashtagNamePosts(key)
                }
                // console.log("Hashtag data: ", JSON.stringify(json))
            })
            .catch(error => { alert(error); console.log(error) })
            .finally(() => setLoader(false))
    }

    // Date picker fns
    const showFromDateHandler = () => {
        setShowFromDate(true)
    }

    const showToDateHandler = () => {
        setShowToDate(true)
    }

    const onFromDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date
        setShowFromDate(Platform.OS === 'ios')
        setfromDate(moment(currentDate).format('YYYY-MM-DD'))
        console.log("currentDate", moment(currentDate).format('YYYY-MM-DD'))
    }

    const onToDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date
        setShowToDate(Platform.OS === 'ios')
        settoDate(moment(currentDate).format('YYYY-MM-DD'))
        console.log("currentDate", moment(currentDate).format('YYYY-MM-DD'))
    }
    
    const submitDateHandler = async () => {
        if(fromDate.length === 0){
            alert("Please select from date")
            return false
        }
        if(toDate.length === 0){
            alert("Please select from date")
            return false
        }
        setSubmittedDatePosted(true)
        setFilterLoading(true)
        const url = 'posts/postlist'
        const formData = new FormData()
        formData.append('user_id', user.data.session_id)
        formData.append('date_hashtag_id', hashTag.id)
        formData.append('from_date_filter', fromDate)
        formData.append('to_date_filter', toDate)
        console.log("Date filters formdata: ", JSON.stringify(formData))

        await httpService(url, 'POST', formData)
            .then(res => res.json())
            .then(json => {
                if (isMount) setData(json)
                console.log("Date filters Posts: ", JSON.stringify(json))
                setFilterLoading(false)
                cancelDateHandler()
            })
            .catch(error => {
                alert(error)
                console.log(error)
                setFilterLoading(false)
                cancelDateHandler()
            })
    }

    const showDatePostedHandler = () => {
        setShowDatePosted(true)
    }

    const cancelDateHandler = () => {
        setShowDatePosted(false)
        setfromDate('')
        settoDate('')
    }

    return (
        <>
            {/* {console.log(hashTag.name)} */}
            <Modal animationType="slide" visible={isVisible}
                onRequestClose={() => {
                    setIsVisible(false)
                    setHashTag({})
                }}
            >
                {/* Header */}
                <LinearGradient colors={['#009CD6', '#005A93']}>
                    <Header style={{ backgroundColor: '#fff' }} androidStatusBarColor="#fff" iosBarStyle={StatusBarStyle}>
                        <Left style={{ flex: 0.45 }}>
                            <Button
                                transparent
                                onPress={() => setIsVisible(false)}>
                                <Ionicon name="arrow-back-outline" color="#00639c" style={styles.fs25} />
                            </Button>
                        </Left>
                        <Body>
                            <Title style={{ fontWeight: 'bold', alignSelf: 'flex-start', marginLeft: -40, color: '#00639c' }}>#{hashTag.name}</Title>
                            <Text style={{ alignSelf: 'flex-start', marginLeft: -40, color: '#333', fontSize: 12 }}>{hashTag.followers_count}</Text>
                        </Body>
                        <Right style={{ flex: 0.3 }}>
                            {
                                hashTag.hashtag_status > 0 || follow.status === 1 || hashTag.to_id === user.data.session_id ?
                                    <View
                                        style={[styles.vhCenter, {
                                            borderWidth: 1, borderColor: '#00639c', borderRadius: 8, width: 120, height: 35, backgroundColor: '#00639c'
                                        }]}
                                    >
                                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>FOLLOWING</Text>
                                    </View>
                                    :
                                    <TouchableOpacity
                                        onPress={() => followHandler()}
                                        style={[styles.vhCenter, {
                                            borderWidth: 1, borderColor: '#00639c', borderRadius: 8, width: 90, height: 35,
                                        }]}
                                    >
                                        <Text style={{ color: '#00639c', fontWeight: 'bold' }}>FOLLOW</Text>
                                    </TouchableOpacity>
                            }
                        </Right>
                    </Header>
                </LinearGradient>

                {/* Filters */}
                {data.length > 0 || submittedDatePosted ?
                    <View style={[styles.row, { marginTop: 10, marginBottom: 10 }]}>
                        <Item picker style={styles.filterSelect}>
                            <Picker
                                mode="dropdown"
                                style={styles.filterPicker}
                                selectedValue={filters}
                                onValueChange={value => filtersOnchange(value)}
                            >
                                <Picker.Item label="Filters" value={0} />
                                {ptypeList.length > 0 ? ptypeList.map(item => {
                                    return <Picker.Item key={item.id} label={item.name} value={item.id} />
                                }) : null}
                            </Picker>
                        </Item>
                        <Item picker style={styles.filterSelect}>
                            <Picker
                                mode="dropdown"
                                style={styles.filterPicker}
                                selectedValue={sortBy}
                                onValueChange={value => sortByOnchange(value)}
                            >
                                <Picker.Item label="Sort by" value={0} />
                                {sortByList.length > 0 ? sortByList.map(item => {
                                    return <Picker.Item key={item.id} label={item.name} value={item.id} />
                                }) : null}
                            </Picker>
                        </Item>
                        <Item picker style={[styles.filterSelect, { height: 30, paddingLeft: 15, paddingRight: 37 }]}>
                            <Pressable onPress={() => showDatePostedHandler()} style={{ flexDirection: 'row' }}>
                                <Text numberOfLines={1}>Date posted</Text>
                                <Ionicon name="ios-caret-down" color="#777"
                                    style={[styles.fs20, { position: 'absolute', right: -20, top: 4, fontSize: 11 }]}
                                />
                            </Pressable>
                        </Item>
                    </View> : null
                }
                {showDatePosted &&
                <View style={{ paddingHorizontal: 20 }}>
                    <View style={[styles.row]}>
                        <Pressable onPress={() => showFromDateHandler()} style={styles.datepickerItem}>
                            <Text style={styles.fs12}>{fromDate.length > 0 ? fromDate : "From"}</Text>
                        </Pressable>
                        <Pressable onPress={() => showToDateHandler()} style={[styles.datepickerItem, { marginLeft: 20 }]}>
                            <Text style={styles.fs12}>{toDate.length > 0 ? toDate : "To"}</Text>
                        </Pressable>
                        {showFromDate && (
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={new Date()}
                                mode="date"
                                display="calendar"
                                onChange={onFromDateChange}
                            />
                        )}
                        {showToDate && (
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={new Date()}
                                mode="date"
                                display="calendar"
                                onChange={onToDateChange}
                            />
                        )}
                    </View>
                    <View style={[styles.row, {justifyContent: 'flex-end', marginTop: 10}]}>
                        <TouchableOpacity style={[styles.btn, styles.okbtn]} onPress={() => submitDateHandler()}>
                            <Text style={styles.whiteTxt}>Submit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.btn, styles.cancelbtn, {marginLeft: 10}]} onPress={() => cancelDateHandler()}>
                            <Text style={styles.whiteTxt}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                }
                {/* <View style={{ width: 150, height: 150 }}>
                    <DateTimePicker
                        style={{ width: 150, height: 150, borderColor: '#333', borderRadius: 0, borderWidth: 1 }}
                        testID="dateTimePicker"
                        value={date}
                        mode={mode}
                        is24Hour={false}
                        display="calendar"
                        onChange={() => onChange()}
                        maximumDate={new Date()}
                    />
                </View>
                <Text>fromDate: {fromDate}</Text> */}

                {filterLoading ? <Spinner color="#00639c" style={{ marginTop: 10, alignSelf: 'center' }} /> : null}
                {data.length > 0 ?
                    <FlatList
                        data={data}
                        renderItem={({ item }) => {
                            return <HashtagPost
                                post={item} start={start} end={end} data={data} setData={setData} setShowPosts={setShowPosts}
                                setEditing={setEditing} menuId={menuId} setMenuId={setMenuId} getHashData={getHashData}
                            />
                        }}
                        keyExtractor={item => item.id}
                    />
                    : <Text style={styles.noData}>No data found</Text>
                }
                {loader && <Loader />}
            </Modal>
        </>
    )
}

export default Hashtag
