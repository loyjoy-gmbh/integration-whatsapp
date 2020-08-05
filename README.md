Steps to set up a new machines for a whatsapp-business account
---------------------------------------------

- Create new Postgres10 Database in GCloud with naming convention `whatsapp-<country-code><number>` and smallest Instance
- Set allowed network to `0.0.0.0/0` for DB
- Create new Compute Engine instance in GCloud with whatsapp template with naming convention `whatsapp-<country-code><number>`
- Set static IP for VM 
- Fill Meta Variables of newly created Compute Engine instance
- Restart machine
- Import Postman Collection & Postman Env into Postman.
- Set the URL environment variable to VM's url in Postman.
- For the first login the admin credentials needs to be set. The default admin login is username: `admin` with password: `secret`. That results in the base64 encoded string `YWRtaW46c2VjcmV0`. Set this token in the environment with the key `Base64AdminCredentials`. Remember to set a secure password in body.
- Retrieve token and paste it into `AdminAuthToken` of environment variables in Postman.
- Register Phone number (02-Registration > Requst-Code):  Request-Code { "cc": "49", "phone_number": "<number>", "method": "sms", cert: "<cert>" }
- Validate account with the code you received via sms (02-Registration > Register-Account).
- Specify wekhook in 01-Settings > Application > Update-Settings.
- Create user in 00-Users > Create-User with username and password
- Set username, password and hostname in LoyJoy.


Create link for init message
----------------------------
- Phonenumber should have the following format: 49160xxxx.
- Paste text in [https://www.urlencoder.org/](https://www.urlencoder.org/) and press `Encode` to get urlencoded text.
- Replace `phonenumber` and `urlencoded-text` in the following link and share it.

https://api.whatsapp.com/send?phone={phonenumber}&text={urlencoded-text}&source&data&app_absent