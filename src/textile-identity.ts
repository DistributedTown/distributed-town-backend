import { PrivateKey, Users, KeyInfo } from '@textile/hub'

const keyInfo: KeyInfo = {
  key: 'bxrgtfj27tyecvkjprlwnyq7ksa',
  secret: 'bvnijpfkhvmfmux4oauypbdhgy3uxayfeqhcnvdy'
}

async function mailbox() {
  const identity = await PrivateKey.fromRandom()

  console.log(identity);
  console.log('Your public identity:', identity.public.toString())

  // Connect to the API with hub keys.
  this.client = await Users.withKeyInfo(keyInfo);

  // Authorize the user to access your Huh api
  await this.client.getToken(identity)

  // Setup the user's mailbox
  const mailboxID = await this.client.setupMailbox()

  // Create a listener for all new messages in the inbox
  this.client.watchInbox(mailboxID, this.handleNewMessage)

  // Grab all existing inbox messages and decrypt them locally
  const messages = await this.client.listInboxMessages()
  const inbox = []
  for (const message of messages) {
    inbox.push(await this.messageDecoder(message))
  }
}