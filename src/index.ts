import fastify from "fastify";
import zod from "zod";
import sql from "./config/db";
import { env } from "./config/env";

const app = fastify()

app.get("/movsensor/sensor/:id", async (request) => {
    const schema = zod.object({
        id: zod.string().or(zod.number())
    })

    const { id } = schema.parse(request.params)
    return await sql`SELECT * FROM mov_sensor WHERE sensor_codigo = ${id}`
})

app.get("/movsensor", async () => {
    const results = await sql`SELECT * FROM mov_sensor`

    if (!results.length) {
        return []
    }

    return results
})

app.get("/movsensor/:id", async (request) => {
    const schema = zod.object({
        id: zod.string().or(zod.number())
    })

    const { id } = schema.parse(request.params)
    return await sql`SELECT * FROM mov_sensor WHERE sensormov_id = ${id}`
})

app.post("/movsensor", async (request, reply) => {
    const schema = zod.object({
        sensor_codigo: zod.string().or(zod.number()),
    })

    const { sensor_codigo } = schema.parse(request.body)

    const result = await sql`
        INSERT INTO mov_sensor (sensor_codigo)
        VALUES (${sensor_codigo})
        returning *;
    `

    return reply.send(result)
})

app.put("/movsensor", async (request, reply) => {
    const schema = zod.object({
        id: zod.string().or(zod.number()),
        sensor_dthora_saida: zod.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/, {
            message: "Data e hora de saída inválida, formato esperado: yyyy-MM-ddTHH:mm:ss"
        }),
    })

    const body = schema.parse(request.body)
    const { sensor_dthora_saida, id } = body

    const result = await sql`
        UPDATE mov_sensor
        SET sensormov_status = false, sensormov_dthora_saida = ${sensor_dthora_saida}
        WHERE sensormov_id = ${id}
        returning *;
    `

    return reply.status(200).send(result)
})

app.listen({ port: +env.PORT }, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }

    console.log(`Server listening at ${address}`)
})
