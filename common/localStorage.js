export const setUserInfo = (user) =>{
    
    let d = new Date();
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('timestamp', d.getTime());
}
export const setToken = (token) =>{
    localStorage.setItem('token', token);
}

export const removeUserInfo = () =>{
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('timeStamp');
}

export const getData = key =>{
    return localStorage.getItem(key);
}

export const setData = (key, data) =>{
    localStorage.setItem(key, data);
}