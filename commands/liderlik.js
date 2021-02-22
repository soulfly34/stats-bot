const db = require('quick.db');
const {MessageEmbed} = require('discord.js')

const moment = require('moment')
require('moment-duration-format')
moment.locale('tr')

module.exports = {
   name: 'liderlik',
   aliases: [],
   run: async(client, message, args) => {
     
     let dataMessage = await db.get(`messageData`) || {};
     let dataVoice = await db.get(`voiceData`) || {};
     
     const topMessage = Object.keys(dataMessage).map(id => {
       return {
         userID: id,
         data: Object.values(dataMessage[id].channel || {}).reduce((a, b) => a + b, 0)
       } 
     }).sort((a, b) => b.data - a.data).slice(0, 5).map((data, i) => `${message.guild.members.cache.get(data.userID)}: \`${data.data} Mesaj\``)
     
     const topVoice = Object.keys(dataVoice).map(id => {
       return {
         userID: id,
         data: Object.values(dataVoice[id].channel || {}).reduce((a, b) => a + b, 0)
       } 
     }).sort((a, b) => b.data - a.data).slice(0, 5).map((data, i) => `${message.guild.members.cache.get(data.userID)}: \`${moment.duration(data.data).format("M [Ay], W [Hafta], DD [Gün], HH [Saat], mm [Dakika], ss [Saniye]")}\``)

     const embed = new MessageEmbed()
     .setColor("GREEN")
     .setTitle(`${message.guild.name} | Liderlik`)
     .addField("Mesaj | Top 5 - Kullanıcı", topMessage.length >= 1 ? topMessage : "Veri Yok!")
     .addField("Sesli | Top 5 - Kullanıcı", topVoice.length >= 1 ? topVoice : "Veri Yok!")
     .setFooter(`Stats Botu Yaptırmak İçin ! Soulfly#0101`, client.user.avatarURL()) // burayı silme kalsın 1 kaç hafta
     .setTimestamp()
     return message.channel.send(embed)
     
   }
}