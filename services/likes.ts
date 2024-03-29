import { getSession } from "next-auth/react"
import { Page, ResponseObject } from "../types/facebook"
import axios from "./axios.config"

// https://developers.facebook.com/docs/graph-api/reference/page/

const likeQuery = `likes?fields=id,name,about,link,picture,followers_count,category`

export const getLikePages = async (limit: number = 20, signal?: AbortSignal, next?: string): Promise<ResponseObject<Page>> => {
    return new Promise((resolve, reject) => {
        getSession()
            .then((session) => {
                if (!session) {
                    reject('can not get session')
                    return
                }
                let url = `/${session.token.id}/${likeQuery}&access_token=${session.token.accessToken}&limit=${limit}`
                if (next) {
                    url = next
                }
                axios.get<ResponseObject<Page>>(url, { signal })
                    .then(res => {
                        if (res.status != 200) {
                            reject('http error status: ' + res.status)
                            return
                        }
                        if (res.data.data.length == 0) {
                            reject('got empty data: ' + res.status)
                            return
                        }
                        resolve(res.data)
                    })
                    .catch(err => {
                        reject(err)
                    })
            })
            .catch(err => {
                reject(err)
            })
    });
}
