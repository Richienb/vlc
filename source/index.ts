"use strict"

import vlcStatic from "vlc-static"
import uniqueString from "unique-string"
import internalIp from "internal-ip"
import getPort from "get-port"
import execa from "execa"
import got from "got"
import queryString from "query-string"
import joinUrl from "url-join"

namespace vlc {
	export interface Status {
		readonly fullscreen: number | boolean
		readonly audiodelay: number
		readonly apiversion: number
		readonly currentplid: number
		readonly time: number
		readonly volume: number
		readonly length: number
		readonly random: boolean
		readonly audiofilters: AudioFilters
		readonly rate: number
		readonly videoeffects: VideoEffects
		readonly state: VLCPlaylistStatus
		readonly loop: boolean
		readonly version: string
		readonly position: number
		readonly date?: string
		readonly information?: Information
		readonly repeat: boolean
		readonly subtitledelay: number
		readonly equalizer: Equalizer[]
	}

	export type VLCPlaylistStatus =
		| "stopped"
		| "playing"
		| "paused"
		| "unknown"

	export interface AudioFilters {
		filter_0: string
		filter_1?: string
		filter_2?: string
		filter_3?: string
		filter_4?: string
	}

	export interface Equalizer {
		presets: Presets
		bands: Record<string, number>
		preamp: number
	}

	export interface Presets {
		"preset id=\"0\"": string
		"preset id=\"1\"": string
		"preset id=\"2\"": string
		"preset id=\"3\"": string
		"preset id=\"4\"": string
		"preset id=\"5\"": string
		"preset id=\"6\"": string
		"preset id=\"7\"": string
		"preset id=\"8\"": string
		"preset id=\"9\"": string
		"preset id=\"10\"": string
		"preset id=\"11\"": string
		"preset id=\"12\"": string
		"preset id=\"13\"": string
		"preset id=\"14\"": string
		"preset id=\"15\"": string
		"preset id=\"16\"": string
		"preset id=\"17\"": string
	}

	export interface Information {
		chapter: number
		chapters: any[]
		title: number
		category: Category
		titles: any[]
	}

	export interface Category {
		"Stream 0": Stream0
		"Stream 1": Stream1
		meta: Record<string, string | number>
	}

	export interface Stream0 {
		Decoded_format: string
		Color_transfer_function: string
		Chroma_location: string
		Video_resolution: string
		Frame_rate: string
		Codec: string
		Orientation: string
		Color_space: string
		Type: string
		Color_primaries: string
		Buffer_dimensions: string
	}

	export interface Stream1 {
		Codec: string
		Channels: string
		Type: string
		Bits_per_sample: string
		Language: string
		Sample_rate: string
	}

	export interface VideoEffects {
		hue: number
		saturation: number
		contrast: number
		brightness: number
		gamma: number
	}

	export interface Playlist {
		ro: string
		type: string
		name: string
		id: string
		children: Playlist[]
	}
}

async function vlc() {
	const password = uniqueString()
	const ip = await internalIp.v4()
	const port = await getPort()

	const address = `http://${ip}`

	const instance = execa(vlcStatic(), ["--extraintf", "http", "--intf", "wx", "--http-host", ip, "--http-port", port.toString(), "--http-password", password])

	return new class VLC {
		/**
		Get the current player status.
		*/
		public async info(): Promise<vlc.Status> {
			const { body } = await got<vlc.Status>(joinUrl(address, "requests", "status.json"), {
				port,
				password,
				responseType: "json"
			})

			return body
		}

		/**
		Get the current playlist information.
		*/
		public async playlist(): Promise<vlc.Playlist> {
			const { body } = await got<vlc.Playlist>(joinUrl(address, "requests", "playlist.json"), {
				port,
				password,
				responseType: "json"
			})

			return body
		}

		/**
		Execute a command.

		@param command The [command](https://wiki.videolan.org/VLC_HTTP_requests#Full_command_list) to execute.
		@param options The data to encode with the command.
		*/
		public async command(command: string, options?: Record<string, string | number | boolean>) {
			await got(joinUrl(address, "requests", "status.json", `?${queryString.stringify({
				command,
				...options
			}).replace(/\+/, "%20")}`), {
				port,
				password
			})
		}

		/**
		Kill the process.
		*/
		public kill(): void {
			instance.kill()
		}
	}()
}

export = vlc
