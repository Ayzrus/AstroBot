import { Schema } from "mongoose";
import { t } from "../utils.js";

export const guildSchema = new Schema(
    {
        id: t.string,
        channels: {
            logs: t.channelInfo,
            logscommands: t.channelInfo,
            transcripts: t.channelInfo,
        },
        parents: {
            tickets: t.parentInfo
        },
        tickets: {
            roles: [String],
            closed: [String, Boolean]
        }
    },
    {
        statics: {
            async get(id: string) {
                return await this.findOne({ id }) ?? this.create({ id });
            }
        }
    }
);