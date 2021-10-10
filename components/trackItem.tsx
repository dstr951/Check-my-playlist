import type { NextPage } from 'next'
import { useState, Dispatch, SetStateAction } from 'react'
import { TrackObjectFull } from '../types/spotifyTypes'
import styles from '../styles/components/trackItem.module.css'

type Props = {
  track: TrackObjectFull,
  primary: Boolean,
  playlistLink: string,
  accessToken: string
}

const TrackItem: NextPage<Props> = ({ track, primary, playlistLink, accessToken }) => {
  const images = track.album.images
  const imgHref = images.length > 0 ? images[images.length - 1].url : '/defaultPlaylist.svg'
  const [deleteClass, setDeleteClass] = useState(styles.trash) 
  const [deleteHref, setDeleteHref] = useState('/trash.svg');
  const deprecated = track.available_markets?.length === 0
  return (    
    <div className={`${styles.track} ${primary?styles.primary:''}`}>        
            <img                          
                src={imgHref}            
                height={40}
                width={40}
                alt={"album's picture"}
                className={deprecated?styles.deprecated:''}
            />
            <h4>{track.name}</h4>
            <p>{`from the album: ${track.album.name}`}</p>
            <div className={`${styles.delete} ${deleteClass}`} onClick={e => removeTrackFromPlaylist(track, playlistLink, accessToken, setDeleteClass, setDeleteHref)}>
              <img     
                src={deleteHref}   
                height={20}
                width={20}
                alt={"trash"}                
              />
            </div>  
    </div>    
  )
}

import axiosRegular from '../axios/axiosReagular'
function removeTrackFromPlaylist(track: TrackObjectFull,playlistLink: string, accessToken: string, setDeleteClass: Dispatch<SetStateAction<string>>, setDeleteHref: Dispatch<SetStateAction<string>>){
  console.log(track, playlistLink, accessToken);
  setDeleteClass(styles.loading);
  setDeleteHref('/three-dots.svg');

  axiosRegular(accessToken).delete(playlistLink, {
    data:{
      tracks:[{"uri":track.uri}]
    }
  }).then(() => {setDeleteClass(styles.success);setDeleteHref('/checkmark.svg');})
  console.log("deleted");  
}

export default TrackItem;
