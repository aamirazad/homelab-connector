# Homelab Connector

![GitHub deployments](https://img.shields.io/github/deployments/aamirazad/homelab-connector/Production?label=build&logo=vercel)
![GitHub License](https://img.shields.io/github/license/aamirazad/homelab-connector)
[![wakatime](https://wakatime.com/badge/user/a74de5a2-6029-42fc-af5a-6c68022b44ae/project/232c8974-8691-43e4-a304-03c7c8722fb5.svg)](https://wakatime.com/badge/user/a74de5a2-6029-42fc-af5a-6c68022b44ae/project/232c8974-8691-43e4-a304-03c7c8722fb5)

## About

This is a very unfinished project with many goals but few features. The vision is for this website to be the one-stop shop to connect everything. But I'm starting with just homelab services. What do I mean connect? I mean obsidian connect. If you don't know how obsidian works or the idea behind it, you have these notes that you can link to each other to do very powerful things. So I thought I would bring that power to all my services. Here's an example use case: I have a paperless document that I scanned. Maybe it's a manual for a smart home appliance. So I can connect the manual to the home assistant appliance. Then maybe I have an obsidian note about all the ways I'm using the device, and I can connect it too. That way, I don't have to rely on search, which can sometimes be inefficient and inconsistent (for example, if you name the note in obsidian differently).

## Features

### Paperless search

#### Your paperlesss instance setup

I hope to remove the need to do this but right now, you have to set the [PAPERLESS_CORS_ALLOWED_HOSTS](https://docs.paperless-ngx.com/configuration/#PAPERLESS_CORS_ALLOWED_HOSTS) on you docker compose env file to whatever url your using to connect to my website. This is to enable pdf preview which, to my understanding, won't let an external service download a pdf.

#### Now, on my website

It's very simple. Go to homelab connector with the link in the GitHub, sign in/create an account (use GitHub sign in). Then click on your icon at the top and click Settings. Here, you will put in your paperless URL and token. Then you can click paperless at the top, and you should be able to see a search box. Search for a document; after clicking on it, a popup should appear with a preview of the document, and (soon) you will see buttons to connect it to other stuff.

### Whishper

After setting your whishper URL in the settings, go to the whishper page and serach for a recording. THis will not only search the names of the reocrdings, but also the transcriptions. After searching, you will see the name of the recording as well as it's transcription status and a link to it on the whishper page. It is important to note that whishper, as of right now, doens't have any authenticaiton. My service will assume the service is not accessable to the public web (cause it should not) and will only connect to it using your computer. After clicking on a recording, a popup will appear with a preview of the recording and buttons which will soon have powerful functionality.

## Planned features

- [x] [Paperless-ngx](https://paperless-ngx.com) functionality
- [x] [Whishper](https://whishper.net/) functionality
- [ ] [Immich](https://immich.app/) functionality
- [ ] [Home assistant](https://www.home-assistant.io/) functionality
- [ ] [Obsidian](https://obsidian.md/) functionality
- [ ] Connections
- [ ] Graph view
- [ ] Self hostable
