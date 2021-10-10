import {  Dispatch, SetStateAction } from 'react'
import { TrackObjectFull } from '../types/spotifyTypes'


export default function findDuplicates(setDuplicates: Dispatch<SetStateAction<TrackObjectFull[][]>>,
    sortedItems: TrackObjectFull[], setResultsReady: Dispatch<SetStateAction<boolean>>){
   const filteredresults = sortedItems.map((t, i: number) => {
       console.log('in map function i is', i)
       if (sortedItems.length - i > 1) return searchDuplicates(i, sortedItems)
       return []
   }).filter(t => t.length > 1).filter((t, i, arr) => {
       if(i > 0){
           if(t[0].id === arr[i -1][1].id){
               console.log("found extra dup,", t, arr[i - 1]);
               return false
           }
           console.log("didn't find an extra dup", t, arr[i - 1]);
           return true;
       }
       return true;
   })
   setDuplicates(filteredresults)
   setResultsReady(true)    
}

function searchDuplicates(i: number, items:TrackObjectFull[]) {
   let j = 1
   console.log("just entered findDuplicates")
   console.log("items[i]", items[i]);
   
   if(items[i].name === items[i + j].name){
       const duplicate:TrackObjectFull[] = [items[i]]
       while(i + j < items.length &&items[i].name === items[i + j].name){
           //if there is a different amount of artist, then probably it's a different version
           if(items[i].artists.length === items[i + j].artists.length){
               if(items[i].artists[0].name === items[i + j].artists[0].name){
                   duplicate.push(items[i + j])
               }
           }
           j++;
           console.log(`in while loop, i:${i}, j:${j}`)
       }
       if (duplicate.length > 1) return duplicate
   }
   return []
}