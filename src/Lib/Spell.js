import { Auth, Database } from './firebase'

const Spell = {
    remove: (key) => {
        Database.ref('userdata').child(Auth.currentUser.uid).child('spells').child(key).remove()
        Database.ref('custom_spells').child(key).remove()
    }
}

export default Spell