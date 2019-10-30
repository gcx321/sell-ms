
export default{
    get(key){
        let val = window.localStorage.getItem(key)
        return JSON.parse(val) 
    },
    set(key,val){
         window.localStorage.setItem(key, JSON.stringify(val))
    },
    remove(key){
        window.localStorage.removeItem(key)
    },
    clear(){
        window.localStorage.clear()
    }
}
