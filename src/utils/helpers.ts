import axios from "axios";

export async function getJSONFromURI(uri: string) {
    const result = await axios.get(uri);
    return result.data;
}

export function ipfsCIDToHttpUrl(url: string, isJson: boolean) {
    if (!url.includes('https://'))
      return isJson ? `https://hub.textile.io/ipfs/${url.replace('ipfs://', '')}/metadata.json` : `https://hub.textile.io/${url.replace('ipfs://', '')}`;
    else return url;
  }