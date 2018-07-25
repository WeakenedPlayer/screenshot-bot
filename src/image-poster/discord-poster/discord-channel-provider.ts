import { TextChannel } from 'discord.js';

export interface DiscordChannelProvider {
    getChannel(): TextChannel;
}
