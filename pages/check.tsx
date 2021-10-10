import type { NextPage, GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useState, useEffect } from 'react'

import styles from '../styles/pages/check.module.css'
import Layout from '../components/layout'
import TrackItem from '../components/trackItem'
import findDuplicates from '../utils/findDuplicates'
import findVersions from '../utils/findVersions'
import { PagingObject, PlaylistTrackObject, TrackObjectFull, SavedTrackObject, } from '../types/spotifyTypes'

type pageProps = {
    playlist: PagingObject<PlaylistTrackObject> | PagingObject<SavedTrackObject>,
    playlistLink: string,
    accessToken: string
}

const Check: NextPage<pageProps> = ({ playlist, playlistLink, accessToken }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const [sortedItems] = useState<TrackObjectFull[]>([])
    useEffect(() => {
        playlist.items.map((t:PlaylistTrackObject) => sortedItems.push(t.track))
        sortedItems.sort((a: TrackObjectFull, b: TrackObjectFull) => {
            if (a.artists[0].name > b.artists[0].name) return 1
            if (a.artists[0].name < b.artists[0].name) return -1
            
            if (a.name > b.name) return 1
            if (a.name < b.name) return -1
                
            return 1
        })
        console.log("after sort, sortedItems are:", sortedItems)        
    }, [])    
    
    const [duplicates, setDuplicates] = useState<TrackObjectFull[][]>([]) 
      
    useEffect(() => {
        console.log("duplicates are:",duplicates)        
    }, [duplicates])

    const [resultsReady, setResultsReady] = useState(false)
    const [resultsText, setResultsText] = useState("Start by picking a check that you want me to do for you")
    useEffect(() => {
        if(resultsReady && duplicates.length > 0) setResultsText("Here's what I found for you")
        if(resultsReady && duplicates.length === 0) setResultsText("Looks like your playlist is good to go :)")        
    }, [resultsReady])

  return (       
      <Layout>
       <div className={styles.checkPage}>                      
           <div className={styles.grid}>
               <div className={styles.options}>
                <h1>{`what do you want to do today?`}</h1>
                   <button onClick={(e) => {
                       e.preventDefault()   
                       if(resultsReady) {
                           setDuplicates([])
                           setResultsReady(false)
                       }                 
                       findDuplicates(setDuplicates, sortedItems, setResultsReady)                    
                    }}>check for duplicate songs</button>
                    <button onClick={(e) => {
                       e.preventDefault()
                       if(resultsReady) {
                            setDuplicates([])
                            setResultsReady(false)
                        }   
                       findVersions(setDuplicates, sortedItems, setResultsReady)                    
                    }}>check for differnet versions of the same song</button>
               </div>
               <div className={styles.results}>
                   <h2>{resultsText}</h2>
                   <div>
                        {displayDuplicates(duplicates, playlistLink, accessToken)}
                   </div>
               </div>
           </div>
       </div>
      </Layout>
    
  )
}
import axiosRegular from '../axios/axiosReagular'

export const getServerSideProps: GetServerSideProps = async (context) => {
    const limit = 50;
    const accessToken = context.query.accessToken ? context.query.accessToken as string: 'error'
    const playlistLink = context.query.playlistLink ? context.query.playlistLink as string: 'error'
    const response: PagingObject<TrackObjectFull> = await axiosRegular(accessToken).get(playlistLink,{
        params: {
            limit: limit
        }
    })
    .then(res => res.data)
    .catch(err => console.log("\n\n\n\n\n\nerror error error error error error",err.response?.data,"\n\n\n\n\n"))
    if(response?.total > response?.items.length) {
        let offset = 0;
        const promises=[]
        do{
            offset += limit;
            promises.push(axiosRegular(accessToken).get(playlistLink,{
                params: {
                    limit: limit,
                    offset: offset
                }
            }).then(res => {
                console.log("res.data.item.length is",res.data.items.length);
                console.log(`offset is ${offset} and limit is ${limit}`);               
                
                
                
                res.data.items.map((t: TrackObjectFull) => response?.items.push(t))
                console.log("after map, response.items.length is", response?.items.length);
                
            }))

        }while(response.total > offset + limit)
        console.log("before promises.all here is some data:");
        console.log(`promises has ${promises.length} offset is ${offset} and currently response has ${response.items.length} items`);
        await Promise.all(promises)
        console.log("im after the await statement");
        
    }
    
    
    

    console.log("before return statement data has ", response?.items.length);
    console.log(`token is ${accessToken} and playlistLink is ${playlistLink}`);
    
    
    return {
        props:{
            playlist: response,
            playlistLink: playlistLink,
            accessToken: accessToken          
        }            
    }
}

function displayDuplicates(duplicates: TrackObjectFull[][], playlistLink: string, accessToken: string){  
    return (
        duplicates.length > 0 &&
        <div className={styles.display}>
            {duplicates.map((duplicate, j) => {
                duplicate.sort((a, b) => a.album.release_date > b.album.release_date? 1 : -1)
                if(duplicate.length === 1) return <div>`woops, this isn&apost right, please contact me`</div>
                return (
                    <div key={j}>
                        <div className={styles.primary}><h2>The song: </h2><TrackItem track={duplicate[0]} primary={true} playlistLink={playlistLink} accessToken={accessToken}/></div>
                                            
                        <p>{
                            `seems to appear ${duplicate.length > 2 ?
                            `${duplicate.length - 1} more times:` : "again once:"}`
                        }</p>
                        <div className={styles.secondary}>
                            {duplicate.map((d, i) =>{if(i>0) return <TrackItem track={duplicate[i]} primary={false} playlistLink={playlistLink} accessToken={accessToken} key={i}/>})}
                        </div>                    
                    </div>
                )
            })}
        </div>        
    )
}

export default Check;