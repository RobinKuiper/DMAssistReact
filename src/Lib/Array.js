export const removeByKey = (array, params) => {
    array.some((item, index) => {
        if(array[index][params.key] === params.value){
            array.splice(index, 1)
            return true
        }
        return false
    })
    return array
}