Steps to set up a new machines for a whatsapp-business account
---------------------------------------------

- Create new PostgreSQL 10 database in GCloud with naming convention `whatsapp-<country-code><number>` and instance size as in other WhatsApp installations.
- Set allowed network to `0.0.0.0/0` for DB.
- Create new Compute Engine instance in GCloud with naming convention `whatsapp-<country-code><number>`, Container Optimized OS (cannot be changed afterwards, so double check) and CPU/Mem as in other machines of this type.
- Set external static IP address for VM via `VPC network -> external ip address`.
- Fill meta variables of newly created Compute Engine instance.
- Restart machine and wait until WhatsApp automatically has added users and databases to PostgreSQL server.
- Open the external ip in Web browser. A WhatsApp signin form should show up.
- The default admin username as defined by WhatsApp is `admin` with password `secret`. Set a secure password (64 chars!) and document it accordingly (ask the team, where to document, there is a place already).
- Register phone number (02-Registration > Requst-Code):  Request-Code { "cc": "49", "phone_number": "<number>", "method": "sms", cert: "<cert>" }
- You will receive a SMS under this phone number. Validate the account with the code you received via SMS (02-Registration > Register-Account).
- Specify the LoyJoy wekhook in 01-Settings > Application > Update-Settings as defined in LoyJoy under Bot / Publish.
- Create a user in 00-Users > Create-User with username and password.
- Set up this username and password according with the hostname in LoyJoy under Bot / Publish.


Create link for init message
----------------------------
- Phone number should have the following format: 491xxxxxx.
- Paste some arbitrary text (e.g. `Letse go!`) into [https://www.urlencoder.org/](https://www.urlencoder.org/) and press `Encode` to transform to URL-encoded text.
- Replace `phonenumber` and `urlencoded-text` in the following URL: `https://api.whatsapp.com/send?phone={phonenumber}&text={urlencoded-text}&source&data&app_absent`
- Now you can share this URL. When a customer clicks this URL, WhatsApp should open with text `Letse go!` ready to send. After sending the bot should answer automatically.
