import axios from "axios";

export async function getJSONFromURI(uri: string) {
    const result = await axios.get(uri);
    return result.data;
}

export function ipfsCIDToHttpUrl(url: string, isJson: boolean) {
    if (!url.includes('textile'))
      return isJson ? `https://ipfs.io/ipfs/${url.replace('ipfs://', '')}/metadata.json` : `https://ipfs.io/ipfs/${url.replace('ipfs://', '')}`;
    else return url;
  }