const fs = require('fs')
import logger from './src/logger'
import { launchServer, router } from './src/server'
import { Janus } from './src/janus-gateway-node'
import { setupJanusConfigs } from './src/setup-janus-configs'
import config from './src/config'

let janus = null

const createDummyRoomsForFun = async (nRooms) => {
  console.log('Creating rooms')
  for (let i = 0; i < nRooms; i++) {
    logger.info(`creating room ${i + 1}...`)
    const result = await janus.createRoom({
      load: {
        description: i % 2 ? `Cool vp8 room (${i})` : `Cool vp9 room (${i})`,
        bitrate: 512000,
        bitrate_cap: false,
        fir_freq: undefined,
        videocodec: i === 0 ? 'vp8' : 'vp9',
        vp9_profile: i === 0 ? undefined : '1',
        permanent: true,
      },
    })

    logger.info(`room ${i + 1} created...`)
    logger.json(result)
  }
}

/**
 * when request to server is made - use janus.createRoom method from janus instance
 * to create new room and send its info back in response
 */
const postNewRoom = async (req, res) => {
  try {
    const { description, videocodec, vp9_profile } = req.body
    // const description = `Cool vp9`
    // const videocodec = 'vp9'
    // const vp9_profile = '1'

    const load = logger.info(`creating room... ${description}`)

    const result = await janus.createRoom({
      load: {
        description: description || `room ${Math.round(Math.random() * 1000)}`,
        bitrate: 512000,
        bitrate_cap: false,
        fir_freq: undefined,
        videocodec: videocodec || 'vp9',
        permanent: true,
        vp9_profile: vp9_profile ? String(vp9_profile) : '1',
      },
    })
    const { load: rooms } = await janus.getRooms()

    const response = {
      success: true,
      code: 200,
      data: {
        roomsCount: rooms.length,
        ...result,
      },
    }

    return res.json(response)
  } catch (error) {
    logger.info(`creating room error...`)
    logger.error(error)

    const response = {
      success: false,
      code: 500,
      data: error,
    }

    return res.json(response)
  }
}

const getRooms = async (req, res) => {
  console.log('Get rooms')
  const result = await janus.getRooms()
  return res.json(result)
}

const deleteRoom = async (req, res) => {
  console.log('Delete room')
  const { roomId } = req.body
  const result = await janus.destroyRoom({
    load: {
      room_id: roomId,
    },
  })
  return res.json(result)
}

router.post('/room', postNewRoom)
router.post('/deleteRoom', deleteRoom)
router.get('/rooms', getRooms)

/**
 * janus gateway node usage example
 */
const main = async () => {
  await setupJanusConfigs()

  // const confFile = fs.readFileSync(
  //   `${config.janusConfigsDir}/janus.eventhandler.sampleevh.jcfg`,
  //   'utf8'
  // )
  // console.log('confFile: ', confFile)

  const server = await launchServer()
  console.log('Server running')

  janus = new Janus({
    instancesAmount: 1,
    logger,
    onError: (error) => logger.error(`ERROR ${error.message}`),
    webSocketOptions: {
      server,
    },
  })

  await janus.initialize().then((info) => {
    console.log('janus initialized ', info)
  })
}

main()
