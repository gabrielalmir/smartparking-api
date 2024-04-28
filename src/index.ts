import fastify from "fastify";
import zod from "zod";
import sql from "./config/db";
import { env } from "./config/env";

const app = fastify()

app.get("/sensor", async (request) => {
    return await sql`SELECT * FROM sensor`
})

app.get("/sensor/:id", async (request) => {
    const schema = zod.object({
        id: zod.string()
    })

    const { id } = schema.parse(request.params)
    return await sql`SELECT * FROM sensor WHERE sensor_id = ${id}`
})

app.post("/sensor", async (request, reply) => {
    const schema = zod.object({
        sensor_codigo: zod.string(),
        sensor_dtEntrada: zod.string(),
        sensor_hrEntrada: zod.string(),
        sensor_status: zod.boolean()
    })

    const { sensor_codigo, sensor_dtEntrada, sensor_hrEntrada, sensor_status } = schema.parse(request.body)

    await sql`
        INSERT INTO sensor (sensor_codigo, sensor_dtEntrada, sensor_hrEntrada, sensor_status)
        VALUES (${sensor_codigo}, ${sensor_dtEntrada}, ${sensor_hrEntrada}, ${sensor_status})
    `

    return reply.status(201).send()
})

app.put("/sensor/:id", async (request, reply) => {
    const schema = zod.object({
        id: zod.string(),
        sensor_codigo: zod.string(),
        sensor_dtEntrada: zod.string(),
        sensor_hrEntrada: zod.string(),
        sensor_hrSaida: zod.string(),
        sensor_status: zod.boolean()
    })

    const { id } = schema.parse(request.params)

    const body = schema.parse(request.body)
    const { sensor_codigo, sensor_dtEntrada, sensor_hrEntrada, sensor_hrSaida, sensor_status } = body

    await sql`
        UPDATE sensor
        SET sensor_codigo = ${sensor_codigo}, sensor_dtEntrada = ${sensor_dtEntrada}, sensor_hrEntrada = ${sensor_hrEntrada}, sensor_status = ${sensor_status}, sensor_hrSaida = ${sensor_hrSaida}
        WHERE sensor_id = ${id}
    `

    return reply.status(204).send()
})

app.listen({ port: +env.PORT }, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }

    console.log(`Server listening at ${address}`)
})
