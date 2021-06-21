import React, {useState, useEffect} from 'react'
import axios from 'axios'

function useAuth(code) {
    const [accessToken,setAccessToken] =useState()
    const [refreshToken, setRefreshToken] = useState()
    const [expiresIn, setExpiresIn] = useState()

    useEffect(()=>{
        axios.post('http://localhost:3001/login',{
            code,
        }).then(res=>{
            setAccessToken(res.data.accessToken)
            setRefreshToken(res.data.refreshToken)
            setExpiresIn(res.data.expiresIn)
            window.history.pushState({}, null, '/') //remove all characters frome '/' (code= section)
        }).catch((e)=>{
            window.location= '/'
        })
    }, [code])

    useEffect(()=>{
        if (!refreshToken || !expiresIn) return

        const interval = setInterval(()=>{

            
            axios.post('http://localhost:3001/refresh',{
                refreshToken,
            }).then(res=>{
                setAccessToken(res.data.accessToken)
                setExpiresIn(res.data.expiresIn)
                
            }).catch((e)=>{
                window.location= '/'
            })
            
        }, (expiresIn-60)*1000) 

        return () =>clearInterval(interval)
    }, [refreshToken, expiresIn])
    return accessToken
}

export default useAuth
