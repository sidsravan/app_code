// Create Redux action types
export const SET_NOTIF_SUCCESS = 'SET_NOTIF_SUCCESS'
export const REMOVE_NOTIF_DATA = 'REMOVE_NOTIF_DATA'

// Create Redux action creators that return an action
export const setNotifsData = (data) => ({
    type: SET_NOTIF_SUCCESS,
    payload: data,
})

export const removeNotifsData = (data) => ({
    type: REMOVE_NOTIF_DATA,
    payload: data,
})

export function fetchNotifsData(data) {
    console.log(JSON.stringify("fetchNotifsData Actions: ", data))
    return async (dispatch) => {
        dispatch(setNotifsData(data))
    }
}

export function removeFetchedNotifsData(data) {
    console.log(JSON.stringify("removeNotifsData Actions: ", data))
    return async (dispatch) => {
        dispatch(removeNotifsData(data))
    }
}

// Combine them all in an asynchronous thunk
// export function fetchPosts() {
//     return async (dispatch) => {
//         dispatch(getPosts())

//         try {
//             const response = await fetch('https://jsonplaceholder.typicode.com/posts')
//             const data = await response.json()

//             dispatch(getNotifsSuccess(data))
//         } catch (error) {
//             dispatch(getPostsFailure())
//         }
//     }
// }