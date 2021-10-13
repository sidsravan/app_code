import React, { useState, useEffect } from 'react'
import { View, FlatList } from 'react-native'
import { Text, List, Thumbnail, Spinner, Header, Left, Body, Right, Title} from 'native-base'
import { connect } from 'react-redux'
import { httpService, timesAgo } from '../../utils'
import styles from '../../styles/common'
import { env } from '../../env'
import defaultAvatar from '../../../assets/grayman.png'
import LinearGradient from 'react-native-linear-gradient'
const Notifications = props => {
    const { user, navigation } = props
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    let isMount = true
	const StatusBarStyle = Platform.OS === 'ios' ? 'dark-content' : 'dark-content'
    useEffect(() => {
        getNotifications()
        return () => {
            isMount = false
        }
    }, [])

    // get Notifications
    const getNotifications = async () => {
        setLoading(true)
        const url = 'notifications/get_notifications'
        const formData = new FormData()
        formData.append('user_id', user.data.session_id)
        // console.log("Notifications formdata: ", JSON.stringify(formData))

        await httpService(url, 'POST', formData)
            .then(res => res.json())
            .then(json => {
                if (isMount) setData(json.data)
                // console.log("Notifications data: ", JSON.stringify(json.data))
                setLoading(false)
            })
            .catch(error => {
                alert(error)
                console.log(error)
                setLoading(false)
            })
    }

    return (
        <View>
        
       { /* -- Notification Title Start Here -- */ }
		<LinearGradient colors={['#009CD6', '#005A93']}>
			<Header noShadow style={{ backgroundColor: 'transparent' }} androidStatusBarColor="#fff" iosBarStyle={StatusBarStyle}>
				<View style={{ flex: 0.9, flexDirection: 'row'}}>
					<Left style={{ flex: 0.9, flexDirection: 'row' }}>
						 <Title style={{fontStyle:'italic',fontWeight:'bold'}}>Notification</Title>
					</Left>
				</View>
			</Header>
		</LinearGradient>
		{/* -- Notification Title End Here -- */}
		
            {loading ? <Spinner color="#00639c" style={{ marginTop: 10, alignSelf: 'center' }} /> : null}
            {data.length > 0 ?
                <FlatList
                    data={data} keyExtractor={item => item.id}
                    renderItem={({ item, index }) => {
                        let http = item.profile_image.search('https')
                        let imageUrl = `${env.baseUrl}${item.profile_image}`
                        return <View style={{ width: '100%', height: 70, flexDirection: 'row', backgroundColor: index % 2 == 0 ? '#e7f0f7' : 'transparent' }}>
                            <View style={{ flex: 0.3, justifyContent: 'center', alignItems: 'center' }}>
                                <Thumbnail
                                    style={{ width: 50, height: 50 }}
                                    source={item.profile_image === null || item.profile_image === '' ? defaultAvatar
                                        : http >= 0 ? { uri: item.profile_image }
                                            : item.profile_image.length > 0 ? { uri: imageUrl } :
                                                defaultAvatar}
                                // source={
                                //     user.data.profile_image === null || user.data.profile_image === undefined ? defaultAvatar :
                                //         user.data.login_with === 'gmail' || user.data.login_with === 'facebook' ? { uri: user.data.profile_image } :
                                //             user.data.profile_image.length > 0 ? { uri: imageUrl } :
                                //                 defaultAvatar}
                                />
                            </View>
                            <View style={{ flex: 0.5, justifyContent: 'center', padding: 10 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 14, marginTop: 5 }}>{item.name}</Text>
                                <Text style={{ fontSize: 12, color: '#808080', fontWeight: 'bold' }}>{item.notification}</Text>
                            </View>
                            <View style={{ flex: 0.3 }}>
                                <Text style={{ marginTop: 20, paddingLeft: 4, fontSize: 12, color: '#808080' }}>
                                    {timesAgo(item.cdate)}
                                </Text>
                            </View>
                        </View>
                    }}
                />
                : <Text style={styles.noData}>No data found</Text>
            }
        </View>
    )
}

// Map Redux state to React component props
const mapStateToProps = (state) => ({
    user: state.user
})
// Connect Redux to React
export default connect(mapStateToProps)(Notifications)
