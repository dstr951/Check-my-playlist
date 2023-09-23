import type { NextPage } from 'next'
import Router from 'next/router'

import { useEffect, useState } from 'react'


import axiosRegular from '../axios/axiosReagular'
import { ListOfCurrentUsersPlaylistsResponse, PlaylistObjectSimplified, Token } from '../types/spotifyTypes'
import styles from '../styles/pages/Playlists.module.css'
import Layout from '../components/layout'
import PlaylistItem from '../components/playlistItem'



const Playlists: NextPage = () => {    
    const [accessToken, setAccessToken] = useState({successful: false, s: ""})  
    
    useEffect(() => {        
        setAccessToken(parseAccessToken())

    }, [])

    const [playlists, setPlaylists] = useState<undefined|ListOfCurrentUsersPlaylistsResponse>(undefined)

    useEffect(() => {
        if(accessToken.successful) {        
            getMyPlaylists(accessToken, setPlaylists)            
        }             
    }, [accessToken])   
    

  return (
    <div className={styles.container}>  
      <Layout>
          <div>
          <h1>choose a playlist</h1> 
          </div>
        
        <div className={styles.playlistList}>
            {loadPlaylists(playlists, accessToken)}
        </div>               
      </Layout>
    </div>
  )
}

function parseAccessToken():Token {
    const hashFragment = window.location.href.split('#')
    const firstargument = hashFragment[1].split('&')[0].split('=')    
    if(firstargument[0] === 'access_token') return {successful: true, s: firstargument[1]}
    else if (firstargument[0] === 'error') return {successful: false, s: firstargument[1]}
    return {successful: false, s: 'error parsing url'}
}

async function getMyPlaylists(accessToken:Token, setPlaylists:(arg0:undefined|ListOfCurrentUsersPlaylistsResponse) => void){
    axiosRegular(accessToken.s).get('v1/me/playlists',{
        params: {
            limit: 50
        }
    })
    .then((res) => {
        setPlaylists(res?.data)        
    })//.catch(error => {if(parseInt(error.message.split('code ')[1]) === 401) location.replace('/')});
     
}

function loadPlaylists(playlists:undefined|ListOfCurrentUsersPlaylistsResponse, accessToken:Token){
   return  playlists !== undefined ? playlists.items.map((playlist, i) => {       
        return <PlaylistItem playlist={playlist} accessToken={accessToken} key={i}/>
    }): <div>loading...</div>
}

export default Playlists;