
const CryptoJS = createCryptoJS()

let headers = {
    'User-Agent': 'okhttp/4.12.0',
    client: 'app',
    deviceType: 'Android',
}

let appConfig = {
    ver: 20250511,
    title: '乐播',
    site: 'https://apiyutu.com/',
}

async function getConfig() {

    let config = appConfig
    config.tabs = await getTabs()
    return jsonify(appConfig)
}

async function getTabs() {
    try {
        let list = []
        let url = appConfig.site + `/api.php/provide/vod`

        const { data } = await $fetch.get(url)
        const tagList = JSON.parse(data).class
        tagList.forEach((e) => {
            list.push({
                name: e.type_name,
                ui:1,
                ext: {
                    id: e.type_id,
                },
            })
        })

        return list
    } catch (error) {
        $print(error)
    }
}

async function getCards(ext) {
    ext = JSON.parse(ext)
    let cards = []
    let { id, page = 1 } = ext


    const url = appConfig.site + `/api.php/provide/vod/`



    const header = headers
    header['content-type'] = 'application/json'

    const body = {
        ac: 'detail',
        pg: page,
        t: id,
    }

    const { data } = await $fetch.post(url, jsonify(body), {
        headers: header,
    })

    // const res = JSON.parse(data)




    argsify(data).list.forEach((e) => {
        cards.push({
            vod_id: String(e.vod_id),
            vod_name: e.vod_name,
            vod_pic: e.vod_pic,
            vod_remarks: `更新至01`,
            ext: {
                id: String(e.vod_id),
                typeId: String(id),
            },
        })
    })

    //  $utils.toastInfo(cards[5]['vod_name'])

    return jsonify({
        list: cards,
    })
}

async function getTracks(ext) {
    ext = argsify(ext)
    let tracks = []
    let { id, typeId } = ext



    // get playerList
    const url = appConfig.site + `/api.php/provide/vod/`

    const header = headers
    header['content-type'] = 'application/json'
    const body = {
        ids: id,
        ac: 'detail',
    }



    const { data } = await $fetch.post(url, jsonify(body), {
        headers: header,
    })

    let playlist = argsify(data)

    if (playlist.list.length > 0) {

        // 遍历播放列表
        for (const element of playlist.list) {

            let name = element.vod_name
            let id = element.vod_play_url.substr(5)
            tracks.push({
                name: name,
                pan: '',
                ext: {
                    id,
                },

            })
        }
    } else {
        // 单集视频
        tracks.push({
            name: name,
            pan: '',
            ext: {
                id,
            },

        })
    }

    // $utils.toastInfo(tracks[0].ext.id)

    return jsonify({
        list: [{
            title: '默认分组',
            tracks,
        },],
    })


}

async function getPlayinfo(ext) {
    ext = argsify(ext)

    let playUrl = ext.id

    return jsonify({ urls: [playUrl] })
}

async function search(ext) {
    ext = argsify(ext)
    let cards = []

    const page = ext.page || 1
    const url = `${appConfig.site}/api.php/provide/vod/`
    let body = {

        wd: ext.text,
        pg: ext.page,
        ac: 'detail',
    }

    const header = headers
    header['content-type'] = 'application/json'

    const { data } = await $fetch.post(url, jsonify(body), {
        headers: header,
    })

    argsify(data).list.forEach((e) => {
        cards.push({
            vod_id: String(e.vod_id),
            vod_name: e.vod_name,
            vod_pic: e.vod_pic,
            ext: {
                id: String(e.vod_id),
                typeId: String(e.vod_id),
            },
        })
    })

    return jsonify({
        list: cards,
    })
}
