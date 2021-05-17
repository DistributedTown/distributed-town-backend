import axios from "axios";

export async function getJSONFromURI(uri: string) {
    const result = await axios.get(uri);
    return result.data;
}

export function getNonce(): number {
    // return Math.floor(Math.random() * 1000000000);
    return 123;
}