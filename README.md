# How to connect a WhatsApp phone number with LoyJoy

LoyJoy can connect to WhatsApp via Twilio as well as via do-it-yourself Docker installation. Using Twilio to connect LoyJoy with WhatsApp is heavily recommended and very simple from side of LoyJoy by simply entering Twilio account data under Bot / Publish.

However, due to the beta status of WhatsApp in Twilio the following do-it-yourself approach based on Google Cloud Platform might be required. So let's go:


## Step 1: Set up a PostgreSQL database server

- Create new PostgreSQL 10 database in GCP with naming convention `whatsapp-<country-code><number>` and VM size as in other WhatsApp installations.
- Set allowed network to `0.0.0.0/0` for DB.
- Set flag `max_connections` to `1000`. This is super important in case following Google Compute Engine VM reboots and does not close connections.


## Step 2: Set up a Google Compute Engine

- Create new Google Compute Engine VM in GCP with naming convention `whatsapp-<country-code><number>`, Container Optimized OS (cannot be changed afterwards, so double check) and CPU/Mem as in other machines of this type.
- Set external static IP address for VM via `VPC network -> external ip address`.
- Fill meta variables of newly created Google Compute Engine VM.
- Start machine SSH into machine.
- Run `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/loyjoy/integration-whatsapp/master/install.sh)"`.


## Step 3: Configure WhatsApp on your Google Compute Engine VM

- Open the external ip in Web browser. A WhatsApp signin form should show up.
- The default admin username as defined by WhatsApp is `admin` with password `secret`. Set a secure password (64 chars!) and document it accordingly (ask the team, where to document, there is a place already).
- Register phone number (02-Registration > Requst-Code):  Request-Code { "cc": "49", "phone_number": "<number>", "method": "sms", cert: "<cert>" }
- You will receive a SMS under this phone number. Validate the account with the code you received via SMS (02-Registration > Register-Account).


## Step 4: Connect with LoyJoy

- Specify the LoyJoy wekhook in 01-Settings > Application > Update-Settings as defined in LoyJoy under Bot / Publish.
- Create a user in 00-Users > Create-User with username and password.
- Set up this username and password according with the hostname in LoyJoy under Bot / Publish.


## Step 5: Chat via WhatsApp with LoyJoy

- Paste some arbitrary text (e.g. `Letse go!`) into [https://www.urlencoder.org/](https://www.urlencoder.org/) and press `Encode` to transform to URL-encoded text.
- Replace `phonenumber` and `urlencoded-text` in the following URL: `https://api.whatsapp.com/send?phone={phonenumber}&text={urlencoded-text}&source&data&app_absent`
- Now you can share this URL. When a customer clicks this URL, WhatsApp should open with text `Letse go!` ready to send. After sending the bot should answer automatically.


## Step 6: Configure keepalive

- WhatsApp Business Api docker containers will crash every few days due to memory leaks in coreapp and deadlocks in PostgreSQL database server. So it is absolutely mandatory to set up a keepalive cloud function, which monitors and reboots the Google Compute Engine VM.
- Set up the cloud function in folder `keepalive` as `whatsapp-<tenant>-keepalive` in region `europe-west3` with 128 MB for PubSub topic `whatsapp-keepalive`.
- Set up a Google Cloud Scheduler with `every 1 minutes` for PubSub topic `whatsapp-keepalive`. The payload has to be like

```
{
    "smtpFrom": ...,
    "smtpHost": ...,
    "smtpPassword": ...,
    "smtpTo": ...,
    "smtpUsername": ...,
    "whatsAppHostname": ...,
    "whatsAppUsername": ...,
    "whatsAppPassword": ...,
    "vm": ...,
    "zone": ...
}
```


## Step n-1: If the disk is full

```
$ docker exec integration-whatsapp_waweb_1 /opt/whatsapp/bin/cleanup.sh
$ docker exec integration-whatsapp_wacore_1 /opt/whatsapp/bin/cleanup.sh
```
