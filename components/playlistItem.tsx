import type { NextPage } from 'next'
import Link from 'next/link'
import { PlaylistObjectSimplified, Token } from '../types/spotifyTypes'
import styles from '../styles/components/playlistItem.module.css'

type Props = {
  playlist: PlaylistObjectSimplified,
  accessToken: Token
}

const PlaylistItem: NextPage<Props> = ({ playlist, accessToken }) => {
    const imgHref = playlist.images.length > 0 ? playlist.images[playlist.images.length - 1].url : '/defaultPlaylist.svg'
  return (
    <Link href={{
      pathname:`/check`,
      query: {
        playlistLink: playlist.tracks.href,
        accessToken: accessToken.s
      }
    }}>
    <div className={styles.playlist}>
        
            <img                          
                src={imgHref}            
                height={60}
                width={60}
                alt={'playlist picture'}
            />
            <h4>{playlist.name}</h4>
            <p>{`${playlist.tracks.total} songs`}</p>
                
    </div>
    </Link>
  )
}



export default PlaylistItem;
