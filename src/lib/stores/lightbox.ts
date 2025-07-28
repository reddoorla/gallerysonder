import { get, writable } from 'svelte/store';
import { createClient, isFilled } from '@prismicio/client';
import { type ArtistDocument, type ArtworkDocument } from '../../prismicio-types';

const getActiveArtwork = async (uid:string|null) => {
    if(uid){
        const client = createClient("gallerysonder")
        activeArtwork.set(await client.getByUID("artwork", uid));
        if(isFilled.contentRelationship(get(activeArtwork)?.data.artist)){
            //@ts-ignore
            const artistUID = get(activeArtwork)?.data.artist.uid;
            if(artistUID)
            activeArtist.set(await client.getByUID("artist",artistUID))
        }
    }else{
        activeArtwork.set(null)
    }
}

export const isLightboxActive = writable(false);
export const showInquiryForm = writable(false);
export const lightboxImageUrl = writable('');
export const activeArtworkUid = writable('')

export const activeArtwork = writable<ArtworkDocument<string>|null>(null);
export const activeArtist = writable<ArtistDocument<string>|null>(null);

activeArtworkUid.subscribe((uid:string|null)=> {
    getActiveArtwork(uid);
    
})

