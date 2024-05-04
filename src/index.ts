import fastify from "fastify";
import { z } from "zod";
import { prisma } from "./config/db";
import { env } from "./config/env";

const app = fastify()

// Sensor routes
app.get('/sensors', async () => {
    const sensors = prisma.sensor.findMany()
    return sensors
})

app.get('/sensors/:sensor', async (request, reply) => {
    const schema = z.object({
        sensor: z.string(),
    })

    const { sensor } = schema.parse(request.params)

    const record = await prisma.sensor.findUnique({ where: { sensor } })

    if (!record) {
        return reply.status(404).send()
    }

    return record
})

app.post('/sensors', async (request, reply) => {
    const schema = z.object({
        name: z.string(),
        sensor: z.string(),
        status: z.boolean(),
        latitude: z.number(),
        longitude: z.number(),
    })

    const { name, sensor, status, latitude, longitude } = schema.parse(request.body)

    // check if sensor already exists
    const existingSensor = await prisma.sensor.findUnique({ where: { sensor } })

    if (existingSensor) {
        return reply.status(409).send({ message: 'Sensor already exists' })
    }

    // Save to database
    const record = await prisma.sensor.create({ data: { name, sensor, status, latitude, longitude } })

    return reply.status(201).send(record)
})

app.put('/sensors/:sensor', async (request, reply) => {
    const schema = z.object({
        status: z.boolean(),
    })

    const { sensor } = z.object({ sensor: z.string() }).parse(request.params)
    const { status } = schema.parse(request.body)

    // Update to database
    const record = await prisma.sensor.update({ where: { sensor }, data: { status } })

    if (!record) {
        return reply.status(404).send()
    }

    return record
})

app.listen({ port: +env.PORT }, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }

    console.log(`Server listening at ${address}`)
})
