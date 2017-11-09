import { Auth, Database } from './firebase'

const Monster = {
    remove: (key) => {
        Database.ref('userdata').child(Auth.currentUser.uid).child('monsters').child(key).remove()
        Database.ref('custom_monsters').child(key).remove()
    }
}

export default Monster