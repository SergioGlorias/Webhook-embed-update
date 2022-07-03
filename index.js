import 'dotenv/config'
import fs from 'fs'
import { WebhookClient, MessageEmbed } from 'discord.js'
import dayjs from 'dayjs'

const client = new WebhookClient({
    url: process.env.DISCORD_WEBHOOK_URL,
}, {
    rest: {
        timeout: 60000,
        retries: 5
    }
})

let msgID = ''

async function run() {
    let dir = fs.readdirSync('./', { withFileTypes: true })
    dir = dir.filter(d => d.isFile())
    dir = dir.filter(d => d.name === "IDmsg.txt")
    if (dir.length === 0) {
        fs.writeFileSync('./IDmsg.txt', '', 'utf8')
    }

    msgID = fs.readFileSync('./IDmsg.txt', 'utf8')
    let msgExit = true
    if (msgID !== '') {
        try {
            const msg = await client.fetchMessage(msgID)
            const embed = new MessageEmbed()
                .setImage('attachment://file.png')
            await client.editMessage(msg, {
                embeds: [embed],
                files: [{
                    attachment: process.env.IMAGE_URL + "?time=" + dayjs().unix(),
                    name: 'file.png'
                }]
            })
        }
        catch (err) {
            console.error(err)
            msgExit = false
        }
    } else {
        msgExit = false
    }

    if (!msgExit) {
        try {
            const embed = new MessageEmbed()
                .setImage('attachment://file.png')
            let msg = await client.send({
                embeds: [embed],
                files: [{
                    attachment: process.env.IMAGE_URL + "?time=" + dayjs().unix(),
                    name: 'file.png'
                }]
            })
            fs.writeFileSync('./IDmsg.txt', msg.id, 'utf8')
        } catch (err) {
            console.error(err)
        }
    }

}

setInterval(run, process.env.SEG_TIME_MENSAGE * 1000)
run()