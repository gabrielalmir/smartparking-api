import mqtt from 'mqtt'
import { z } from 'zod'
import { prisma } from './config/db'
import { env } from './config/env'

const client = mqtt.connect(env.MQTT_URL)
const topic = env.MQTT_TOPIC
const messageInterval = 5000

interface BrokerMessage {
    topic: string
    message: Buffer
    timestamp: Date
}

const queue = new Map<string, BrokerMessage>()

client.on('connect', () => {
    console.log('Connected to MQTT broker')
    console.log('*-'.repeat(20))
    client.subscribe(topic)
})

client.on('message', async (topic, message) => {
    try {
        addMessageToQueue({ topic, message, timestamp: new Date() })
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('Error processing message:', error.errors.map((e) => e.message))
        }
        else if (error instanceof SyntaxError) {
            console.error('Error processing message:', 'Invalid JSON format')
        } else {
            console.error('Error processing message:', error)
        }
    }
})

function addMessageToQueue(brokerMessage: BrokerMessage) {
    const { topic } = brokerMessage
    queue.set(topic, brokerMessage)
}

async function processBrokerData(brokerMessage: BrokerMessage) {
    const { topic, message, timestamp } = brokerMessage

    const schema = z.object({
        sensor: z.string({ message: 'Invalid sensor' }),
        status: z.boolean({ message: 'Invalid status' }).or(z.number().transform((v) => !!v)),
    })

    const { sensor, status } = schema.parse(JSON.parse(message.toString()))

    // Log parsed message
    console.log('*-'.repeat(20))
    console.log('Received message on topic:', topic)
    console.table({ sensor, status, timestamp: timestamp.toLocaleString() })

    // Save to database
    await prisma.sensor.update({ where: { sensor }, data: { status } })
}

setInterval(() => {
    if (queue.size === 0) return
    queue.forEach(async (message, topic) => {
        await processBrokerData(message)
        queue.delete(topic)
    })
}, messageInterval)
