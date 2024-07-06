# Homelab Connector

![GitHub deployments](https://img.shields.io/github/deployments/aamirazad/homelab-connector/Production?label=build&logo=vercel)

## About

This is a very unfinished project with many goals but few features. The vision is for this website to be the one-stop shop to connect everything. But I'm starting with just homelab services. What do I mean connect? I mean obsidian connect. If you don't know how obsidian works or the idea behind it, you have these notes that you can link to each other to do very powerful things. So I thought I would bring that power to all my services. Here's an example use case: I have a paperless document that I scanned. Maybe it's a manual for a smart home appliance. So I can connect the manual to the home assistant appliance. Then maybe I have an obsidian note about all the ways I'm using the device, and I can connect it too. That way, I don't have to rely on search, which can sometimes be inefficient and inconsistent (for example, if you name the note in obsidian differently).

## Features

### Paperless search

#### Your paperlesss instance setup

I hope to remove the need to do this but right now, you have to set the [PAPERLESS_CORS_ALLOWED_HOSTS](https://docs.paperless-ngx.com/configuration/#PAPERLESS_CORS_ALLOWED_HOSTS) on you docker compose env file to whatever url your using to connect to my website. This is to enable pdf preview which, to my understanding, won't let an external service download a pdf.

#### Now, on my website

It's very simple. Go to homelab connector with the link in the GitHub, sign in/create an account (use GitHub sign in). Then click on your icon at the top and click Settings. Here, you will put in your paperless URL and token. Then you can click paperless at the top, and you should be able to see a search box. Search for a document; after clicking on it, a popup should appear with a preview of the document, and (soon) you will see buttons to connect it to other stuff.

## Planned features

- [ ] Connections
- [ ] Immich functionality
- [ ] Home assistant functionality
- [ ] Obisidna functionality
- [ ] Graph view
- [ ] Self hostable
