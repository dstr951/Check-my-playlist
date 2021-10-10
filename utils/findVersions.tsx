import {  Dispatch, SetStateAction } from 'react'
import { TrackObjectFull, ArtistObjectSimplified } from '../types/spotifyTypes'


export default function findVersions(setVersions: Dispatch<SetStateAction<TrackObjectFull[][]>>,
    sortedItems: TrackObjectFull[], setResultsReady: Dispatch<SetStateAction<boolean>>){
        console.log("started findVersions");
        
   const filteredresults = sortedItems.map((t, i: number) => {
       console.log('in map function i is', i)
       if (sortedItems.length - i > 1) return searchVersions(i, sortedItems)
       return []
   }).filter(t => t.length > 1).filter((t, i, arr) => {
       if(i > 0){
           if(t[0].id === arr[i -1][1].id){
               console.log("found extra ver,", t, arr[i - 1]);
               return false
           }
           console.log("didn't find an extra ver", t, arr[i - 1]);
           return true;
       }
       return true;
   })
   setVersions(filteredresults)
   setResultsReady(true)    
}

function searchVersions(i: number, items:TrackObjectFull[]) {
   let j = 1
   console.log("just entered searchVersions")
   console.log("items[i]", items[i]);
   const strippedName = items[i].name.split(/ - | \(/)
   console.log(`track name is:${items[i].name} and stripped name is: ${strippedName[0]}`);
   
   
   if(items[i + j].name.includes(strippedName[0])){
       const duplicate:TrackObjectFull[] = [items[i]]
       while(i + j < items.length &&items[i + j].name.includes(strippedName[0])){
           //if there is a different amount of artist, then probably it's a different version
           if(artistIncluded(items[i + j].artists,items[i].artists[0].id)){    
                console.log("the artists name is included");
                           
                duplicate.push(items[i + j])               
           }
           j++;
           console.log(`in while loop, i:${i}, j:${j}`)
       }
       console.log(`after while loop duplicate has ${duplicate.length} items`);
       
       if (duplicate.length > 1) return duplicate
   }
   return []
}

function artistIncluded(artists: ArtistObjectSimplified[] , artistId: string){
    const ids: string[] = [];
    artists.map(artist => ids.push(artist.id))
    return ids.includes(artistId)
}