# Distributed town

## Overview

The idea is to build a DAO-Project using a credit system and geo-location to build "selfsustainable community hubs”. Distributed Town is a Social DAO that lets local communities self-organize, and manage their skills and resources collectively. Fully autonomous from government grants approval and slow, bureaucratic red-tape in attracting skills and resources locally. It uses a mutual credit system and geo-location to build “self-sustainable community hubs”. The project aims to bring DAO’s ease of use to local communities through a simple registration system, and an intuitive UI that mimics the urban environment.

## Functionalities: 

- User should be able to register and select their skills
- User should be able to login 
- User should be able to join a community
- User should be able to place an offer (Credtis calculation?)
- User should be able to list all offers inside this community 
- User should be able to pick and offer and complete it
- User should who has placed an offer should be able to rate the user who is completing it. The credits trasferred should depend on this rate.
- User should be able to switch between communities.
- User should be able to create a community? How? 

## Technical stack

Distributed town will be implemented with a NodeJS server dealing with all the off-chain data and calling the smart contracts. The NodeJS app will be a REST API. The off-chain data will be stored in a MongoDB. The MongoDB will be only accessible from the NodeJS app. The client side of the Distributed Wallet will be a mobile application. It will be implemented with React Native. We are going to use blockchain in order to ensure the tracability and immutability of the credits transfers. We are going to use RSK, because it's secure, it allows Ethereum like smart contracts and it works on top of bitcoin. RSK allows us to easily deploy and run our smart contracts without the need of running our own node.

## On-chain and off-chain 

When deciding which data should be stored offchain and onchain we should keep in mind the feature cost, feature capability, and privacy. We should store on the blockchain the least amount of data possible because of the cost. All types of entity descriptions will be stored off chain and only the crucial for the logic and payments data will be stored on chain. 

Off chain: 
- Organizations
- Gig details
- User details 
- User skills

On chain:
- User identity (address)
- Credits
- Gig reference (and possibly hash) of each transfer

In order to ensure that the credits offered for a gig will still be available once the gig is completed, we are going to implement a locking mechanism. The flow will be as follows:

1. User1 opens a gig 
2. User1’s credits get locked 
3. User2 completes the gig 
4. User1’s credits get transferred to User2’s wallet


The left credits which don't belong to any users will be locked, there will be one ghost user
