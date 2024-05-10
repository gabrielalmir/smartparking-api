import mqtt from 'mqtt'
import { z } from 'zod'
import { prisma } from './config/db'
import { env } from './config/env'

const client = mqtt.connect(env.MQTT_URL)
const topic = 'smartparking-iot'

client.on('connect', () => {
    console.log('Connected to MQTT broker')
    console.log('*-'.repeat(20))
    client.subscribe(topic)
})

client.on('message', async (topic, message) => {
    try {
        await onBrokerMessage(topic, message)
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

async function onBrokerMessage(topic: string, message: Buffer) {
    console.log('Received message:', message.toString(), 'on topic:', topic)

    const schema = z.object({
        sensor: z.string({ message: 'Invalid sensor' }),
        status: z.boolean({ message: 'Invalid status' }).or(z.number().transform((v) => !!v)),
    })

    const { sensor, status } = schema.parse(JSON.parse(message.toString()))

    // Log parsed message
    console.log('Message parsed:')
    console.log('Sensor:', sensor)
    console.log('Status:', status)
    console.log('*-'.repeat(20))

    // Save to database
    await prisma.sensor.update({ where: { sensor }, data: { status } })

    // Show all sensors
    const sensors = await prisma.sensor.findMany()
    // show only the sensor and status
    console.table(sensors.map(({ sensor, status }) => ({ sensor, status })))
}
