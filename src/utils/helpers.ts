import axios from "axios";

export async function getJSONFromURI(uri: string) {
    const result = await axios.get(uri);
    return result.data;
}